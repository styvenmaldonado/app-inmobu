import { defineStore } from "pinia";

// Definir un tipo para los diálogos
type DialogAction = "create" | "edit" | undefined;

interface DialogData {
    action: DialogAction;
    state?: boolean;
    callback?: () => void;
    index?: number;
}

type DialogRecord = Record<string, DialogData>;

export const useGlobalUIStore = defineStore("ui", {
    state: () => ({
        dialogName: undefined as string | undefined,
        drawer: false as boolean,
        dialogs: {} as DialogRecord, // Estados dinámicos para diálogos
        isLoading: false, // Estado global del loader
        loading:{
            message: undefined,
            opacity: 80
        },
        disabled: true as boolean,
        initialState: undefined as any | undefined,
        step: 1
    }),

    actions: {
        initialize(){

        },
        /**
         * Abre un diálogo con el nombre y acción especificados.
         *
         * @param {string} dialogName - Nombre del diálogo a abrir.
         * @param {DialogAction} action - Acción asociada al diálogo ("create" | "edit").
         * @param index
         */
        openDialog({dialogName, action, index  }:{dialogName: string, action: DialogAction, index?: number}): void {
            const dialog= this.dialogs[dialogName] || {};
            this.dialogName = dialogName;

            // Ejecutar el callback si la acción es "create"
            if (action === 'create') {
                dialog.callback?.();
            }

            // Actualizar los datos del diálogo
            this.dialogs[dialogName] = {
                ...dialog, // Mantener propiedades existentes (como callback)
                action,
                state: true,
                index: index,
            };
        },

        /**
         * Configura un callback para un diálogo específico.
         *
         * @param {string} dialogName - Nombre del diálogo a configurar.
         * @param {() => void} callback - Callback a ejecutar.
         */
        initializeDialog({dialogName, callback}: { dialogName: string, callback?: () => void }) {
            if (!this.dialogs[dialogName]) {
                console.warn(`El diálogo '${dialogName}' no existe. La operación 'resetDialog' no tendrá efecto.`);
            }
            this.dialogName = dialogName;
            this.dialogs[dialogName] = {
                action: undefined,
                state: false,
                callback: callback ?? (() => {}) // Asegura un callback por defecto
            };
        },

        /**
         * Cierra un diálogo específico con su nombre.
         *
         * @param {string} dialogName - El nombre único del diálogo a cerrar.
         */
        closeDialog() {
            const dialogName = this.dialogName || -1;
            const dialog = this.dialogs[dialogName];
            if (dialog) {
                dialog.state = false; // Establecer como cerrado
            } else {
                console.warn(`El diálogo '${dialogName}' no existe.`);
            }
        },

        setInitialState(state:any){
            if(!state) return ;
            this.initialState = state

        },
        /**
         * Activa el estado de carga global.
         */
        showLoading() {
            this.isLoading = true;
        },
        inactiveDisabled(){
            this.disabled = false
        },
        /**
         * Desactiva el estado de carga global.
         */
        hideLoading() {
            this.isLoading = false;
        },

        nextStep() {
            this.step++;
        },

        reset(){
            this.step = 1;
            this.initialState = undefined;
            this.dialogName = undefined;
            this.dialogs = {};
            this.disabled = true;
        }
    },

    getters: {
        /**
         * Determina si un diálogo está abierto.
         *
         * @param {string} dialogName - Nombre del diálogo a verificar.
         * @returns {boolean} - Valor `true` si está abierto, de lo contrario `false`.
         **/
        isDialogOpen: (state) => (dialogName: string): boolean => {
            return !!state.dialogs[dialogName]?.state;
        },
        isDisabledState: (state): boolean => {
            return state.disabled
        },
        getDialogAction: (state) => (): string |  undefined => {
            if (state.dialogName) return state.dialogs[state.dialogName]?.action
        },
        getCurrentIndex: (state) => (): number => {
            if (!state.dialogName) {
                return -1; // Ningún diálogo está activo
            }

            // Obtener el diálogo actual basado en el nombre
            const currentDialog = state.dialogs[state.dialogName];

            // Validar que exista un índice y sea un número válido
            if (currentDialog && typeof currentDialog.index === 'number') {
                return currentDialog.index;
            }

            // Retornar -1 si no se cumple la validación
            return -1;
        },

    },
});