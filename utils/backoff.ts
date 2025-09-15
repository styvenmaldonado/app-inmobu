// utils/backoff.ts
export async function pollWithBackoff<T>(fn: () => Promise<T | null>, {
    start = 500, max = 3000, steps = 6
}: { start?: number; max?: number; steps?: number } = {}) {
    let delay = start
    for (let i = 0; i < steps; i++) {
        const r = await fn()
        if (r) return r
        await new Promise(res => setTimeout(res, delay))
        delay = Math.min(delay * 2, max)
    }
    return null
}