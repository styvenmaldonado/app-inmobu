<script setup lang="ts">
import { onBeforeUnmount, ref, computed } from 'vue'
import { useAwsCreds } from '@/composables/useAwsCreds'
import { pollWithBackoff } from '@/utils/backoff'

/**
 * Config pública (Nuxt)
 */
const config = useRuntimeConfig()
const API_URL = ('https://pxbb5bgita.execute-api.us-east-1.amazonaws.com/Prod/').trim()
const { region, getCredentials } = useAwsCreds()

/**
 * Estado UI
 */
const videoEl = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isBusy = ref(false)
const status = ref<'idle'|'preparing'|'recording'|'analyzing'|'done'|'error'>('idle')
const message = ref('')
const progress = ref(0)
const sessionId = ref<string>('')
const confidence = ref<number | null>(null)

/**
 * Códec H.264 (requisito práctico del streaming)
 */
const h264MimeCandidates = [
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4;codecs=avc1.42E01E',
  'video/webm;codecs=h264'
]
const supportedMime = ref<string | null>(null)
const canRecordH264 = computed(() => !!supportedMime.value)

/**
 * Límites de tamaño (10 MB total)
 */
const MAX_BYTES = 10 * 1024 * 1024
let bytesSent = 0
let rec: MediaRecorder | null = null
let stopRequested = false

function detectH264Support() {
  const MR: any = (window as any).MediaRecorder
  if (!MR) return null
  for (const mime of h264MimeCandidates) {
    if (typeof MR.isTypeSupported === 'function' && MR.isTypeSupported(mime)) return mime
  }
  return null
}

async function askCamera() {
  stream.value = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
    audio: false
  })
  if (videoEl.value && stream.value) {
    ;(videoEl.value as HTMLVideoElement).srcObject = stream.value
    await (videoEl.value as HTMLVideoElement).play()
  }
}

async function createSession() {
  const r = await fetch(`${API_URL}/start-liveness`, { method: 'POST' })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const j = await r.json()
  if (!j?.sessionId) throw new Error('No sessionId')
  sessionId.value = j.sessionId
}

async function pollResults() {
  const result = await pollWithBackoff(async () => {
    const r = await fetch(`${API_URL}/get-liveness-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.value })
    })
    const j = await r.json()
    const c = j?.data?.confidence
    if (r.status === 200 && typeof c === 'number') return j
    return null
  }, { start: 600, max: 3000, steps: 6 })

  if (!result) throw new Error('Tiempo de espera agotado al consultar resultados')
  confidence.value = result.data.confidence
  status.value = 'done'
}

/**
 * Generador de eventos desde MediaRecorder → RequestEventStream
 */
function makeRequestEventStream(mediaRec: MediaRecorder) {
  const queue: Blob[] = []
  let resolveChunk: ((v: Blob | null) => void) | null = null

  mediaRec.ondataavailable = (ev: BlobEvent) => {
    if (!ev.data || ev.data.size === 0) return
    queue.push(ev.data)
    if (resolveChunk) { const fn = resolveChunk; resolveChunk = null; fn(queue.shift() || null) }
  }

  return async function *generator() {
    // Evento informativo inicial (opcional)
    yield { ClientSessionInformationEvent: { } }

    while (true) {
      if (stopRequested && queue.length === 0) break
      const nextChunk = await new Promise<Blob | null>((res) => {
        if (queue.length > 0) return res(queue.shift() || null)
        resolveChunk = res
      })
      if (!nextChunk) break

      bytesSent += nextChunk.size
      if (bytesSent > MAX_BYTES) {
        try { mediaRec.stop() } catch {}
        stopRequested = true
      }

      const arrayBuf = await nextChunk.arrayBuffer()
      yield {
        VideoEvent: {
          TimestampMillis: Date.now(),
          VideoChunk: new Uint8Array(arrayBuf)
        }
      }
    }
  }
}

/**
 * Utilidad: convierte AsyncIterable → Web ReadableStream usando el helper oficial del SDK
 */
async function toReadableStream<T>(iterable: AsyncIterable<T>) {
  const { readableStreamFromIterable } = await import('@aws-sdk/util-stream-browser')
  return readableStreamFromIterable(iterable as any)
}

async function startStreaming() {
  isBusy.value = true
  message.value = ''
  progress.value = 0
  bytesSent = 0

  try {
    status.value = 'preparing'

    // 1) Cámara
    if (!('mediaDevices' in navigator)) throw new Error('Cámara no disponible')
    await askCamera()

    // 2) Códec
    supportedMime.value = detectH264Support()
    if (!supportedMime.value) {
      throw new Error('Este dispositivo/navegador no soporta H.264 necesario para el liveness')
    }

    // 3) Sesión backend
    await createSession()

    // 4) Credenciales temporales
    const credentials = await getCredentials()

    // 5) Import dinámico del cliente streaming (code-splitting)
    const { RekognitionStreamingClient, StartFaceLivenessSessionCommand } = await import('@aws-sdk/client-rekognitionstreaming')

    // 6) Preparar MediaRecorder
    rec = new MediaRecorder(stream.value as MediaStream, {
      mimeType: supportedMime.value!,
      videoBitsPerSecond: 2_500_000
    })
    stopRequested = false

    const width = (videoEl.value?.videoWidth || 1280)
    const height = (videoEl.value?.videoHeight || 720)

    // 7) Generador AsyncIterable + conversión a ReadableStream
    const requestEventStream = makeRequestEventStream(rec)
    const requestStream = await toReadableStream(requestEventStream())

    // 8) Cliente y comando
    const client = new RekognitionStreamingClient({ region, credentials })

    const CHALLENGE_VERSIONS = 'FaceMovementAndLight_1.0.0' // ajusta según tu región/cuenta

    const cmd: any = new StartFaceLivenessSessionCommand({
      SessionId: sessionId.value,
      ChallengeVersions: CHALLENGE_VERSIONS,
      VideoWidth: String(width),
      VideoHeight: String(height),
      RequestEventStream: requestStream
    })

    // 9) Iniciar grabación y enviar
    status.value = 'recording'
    rec.start(200) // ~200ms por blob

    const res: any = await client.send(cmd)
    const respStream: AsyncIterable<any> = res?.ResponseEventStream || res

    for await (const evt of respStream as any) {
      if (evt?.ServerSessionInformationEvent) {
        message.value = 'Desafío recibido. Sigue las instrucciones.'
      }
      if (evt?.ValidationException) {
        status.value = 'error'
        message.value = 'Validación falló (formato/tamaño de video).'
      }
      if (evt?.ThrottlingException) {
        message.value = 'Throttling, reintentando…'
      }
      if (evt?.DisconnectionEvent) {
        // servidor cerró: salimos del loop
        break
      }
      progress.value = Math.min(100, progress.value + 3)
    }

    // 10) Consultar resultados
    status.value = 'analyzing'
    try { rec.stop() } catch {}
    stopRequested = true

    await pollResults()
  } catch (e: any) {
    console.error(e)
    status.value = 'error'
    message.value = e?.message || String(e)
  } finally {
    isBusy.value = false
  }
}

function stopAll() {
  try { rec?.stop() } catch {}
  stopRequested = true
  stream.value?.getTracks().forEach(t => t.stop())
  stream.value = null
}

onBeforeUnmount(() => stopAll())
</script>
<template>
  <div class="liveness-card">
    <h2>Verificación de Liveness (Vue nativo)</h2>

    <div v-if="status==='idle' || status==='error'">
      <p v-if="status==='error'" class="error">{{ message }}</p>
      <button :disabled="isBusy" @click="startStreaming">Iniciar verificación</button>
      <p class="hint">Se solicitará acceso a la cámara. Requiere navegador con soporte H.264.</p>
    </div>

    <div v-if="status==='preparing'">
      <p>Preparando cámara…</p>
    </div>

    <div v-if="status==='recording'">
      <video ref="videoEl" autoplay playsinline class="preview"></video>
      <div class="bar"><div class="prog" :style="{ width: progress + '%' }"></div></div>
      <p>{{ message || 'Mira a la cámara y mantén tu rostro centrado.' }}</p>
      <button class="ghost" @click="stopAll">Cancelar</button>
    </div>

    <div v-if="status==='analyzing'">
      <p>Analizando…</p>
      <div class="bar"><div class="prog" :style="{ width: Math.min(100, progress + 10) + '%' }"></div></div>
    </div>

    <div v-if="status==='done'">
      <h3 v-if="(confidence ?? 0) > 90">¡Verificación Exitosa! ✅</h3>
      <h3 v-else>Verificación Fallida ❌</h3>
      <p>Puntaje de confianza: <strong>{{ confidence?.toFixed(2) ?? '—' }}%</strong></p>
      <button @click="() => { status='idle'; confidence=null; message=''; progress=0 }">Intentar de nuevo</button>
    </div>
  </div>
</template>

<style scoped>
.liveness-card { max-width: 560px; margin: 0 auto; padding: 1.25rem; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
.preview { width: 100%; max-width: 460px; border-radius: 12px; background: #000; }
.bar { margin-top: 12px; height: 10px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.prog { height: 100%; background: #10b981; transition: width .2s linear; }
button { padding: .6rem 1rem; border-radius: 10px; border: 1px solid #0ea5e9; background: #0ea5e9; color: white; cursor: pointer; }
button.ghost { background: transparent; color: #111827; border-color: #9ca3af; }
.error { color: #b91c1c; }
.hint { color: #6b7280; font-size: .9rem; }
</style>
