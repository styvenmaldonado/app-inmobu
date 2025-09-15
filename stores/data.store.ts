export const useDataStore = defineStore('fhir', {
    state: () => ({
        /**
         * Represents a list that can hold any type of value.
         * The list is initialized as an empty array.
         */
        list: [] as any[],
        initial: undefined as any | undefined,
        current: undefined as any | undefined,
        searchParameters: undefined as any | undefined,
    }),
    getters: {
        /**
         * Retrieves the current state of the provided state object.
         * The method creates and returns a deep copy of the `current` property
         * from the `state` object to prevent unintended mutations.
         *
         * @param {object} state - The state object containing a `current` property.
         * @returns {object} A deep copy of the `current` property of the state object.
         */
        getCurrentState: (state): object => {
            return state?.current && JSON.parse(JSON.stringify(state.current))
        },
        /**
         * Returns a deep copy of the initial state stored in the provided state object.
         *
         * @param {object} state - The state object containing the initial state to be returned.
         * @returns {object} A deep copy of the initial state.
         */
        getInitialStateState: (state): object => {
            return state?.initial && JSON.parse(JSON.stringify(state.initial ))
        },
        /**
         * Compares the `current` state with the `initial` state for equality.
         * Performs a deep comparison by serializing and deserializing the objects.
         *
         * @param {Object} state - The state object containing `current` and `initial` properties to compare.
         * @returns {boolean} - Returns true if the `current` state is equal to the `initial` state, otherwise false.
         */
        isEqualInitialToCurrentState: (state): boolean => {
            return state?.current && state?.initial && JSON.stringify(state.current) == JSON.stringify(state.initial)
        }
    },
    actions: {
        /**
         * Initializes the object with the provided initial state. Resets any existing state and sets the initial state.
         *
         * @*/
        initialize(initialState: object) {
           this.$reset();
           this.initial =  JSON.parse(JSON.stringify(initialState));

        },

        /**
         * Resets the current state to its initial state by deep cloning the initial state.
         *
         * @return {void} Does not return any value.
         */
        reset() {
            if(!this.initial) return;
            this.current = JSON.parse(JSON.stringify(this.initial));
        },

        /**
         * Resets the search parameters to their default state.
         * This method clears any existing search parameters by setting them to undefined.
         *
         * @return {void} Does not return a value.
         */
        resetSearchParameters() {
          this.searchParameters = undefined;
        },

        /**
         * Updates the state of the object. If no state is provided, the method will terminate without making changes.
         *
         * @param {object} [state] - An optional state object to update the current and initial state.
         * @return {void} This method does not return a value.
         */
        setState(state?:object | undefined | null ){
            if(!state) return;
            this.$reset();
            this.initial = JSON.parse(JSON.stringify(state));
            this.current = JSON.parse(JSON.stringify(state));
        },

        /**
         * Sets the initial value after validating its presence. If no value is provided, the initial value is set to undefined.
         * If a value is provided, it is deep cloned to avoid unintended modifications.
         *
         * @param {any} initial - The initial value to set. Can be of any type.
         * @return {void} - This method does not return a value.
         */
        setInitial(initial: any) {
            if (!initial) {
                this.initial = undefined;
            } else {
                this.initial =  JSON.parse(JSON.stringify(initial));
            }
        },

        /**
         * Sets the current value.
         *
         * @param {any} current - The value to set as the current.
         * @return {void} Does not return a value.
         */
        setCurrent(current: any) {
            if (!current) {
                this.current = undefined;
            } else {
                this.current =  JSON.parse(JSON.stringify(current));
            }
        },

        /**
         * Updates the search parameters for the current instance by deeply copying the provided searchParameters object.
         *
         * @param {any} searchParameters - The set of parameters to be used for searching. This parameter is deeply cloned.
         * @return {void} No return value.
         */
        setSearchParameters(searchParameters: any) {
            this.searchParameters =  JSON.parse(JSON.stringify(searchParameters));
        },

        /**
         *
         */
        pushList(object: any) {
            this.list.push(object);
        },

        /**
         * Modifica la lista reemplazando o eliminando un elemento en un índice especificado.
         *
         * @param {number} index - Índice en el que se realizará la operación. Debe estar dentro de los límites de la lista.
         * @param {any} [object] - Opcional. Si se proporciona, reemplaza el elemento en el índice especificado. Si no se proporciona, elimina el elemento en el índice.
         * @return {void}
         */
        spliceList(index: number, object?: any): void {

            // Validar si el índice está fuera de rango
            if (index < 0 || index >= this.list.length) {
                console.warn(`[spliceList]: El índice ${index} está fuera del rango permitido (0 - ${this.list.length - 1}).`);
                return;
            }

            if (object !== undefined) {
                // Reemplazar el elemento en el índice con el nuevo objeto
                this.list.splice(index, 1, object);
                console.info(`[spliceList]: Reemplazado el elemento en índice ${index} con`, object);
            } else {
                // Eliminar el elemento en el índice
                this.list.splice(index, 1);
                console.info(`[spliceList]: Eliminado el elemento en índice ${index}.`);
            }
        },

        /**
         * Resets the list property to an empty array.
         *
         * @return {void} No return value.
         */
        resetList() {
            this.list = [];
        },

        /**
         * Adds an object to a nested array structure based on the provided path.
         *
         * @param {string[]} path - The path representing the nested structure where the object should be added.
         * @param {any} object - The object to be added to the specified nested array.
         * @return {void}
         */
        addObject(path: string[], object: any) {
            const pushToNestedArray = (obj: any, path: string[], newItem: any) => {
                let target = path.reduce((acc, key, index) => {
                    if (!acc[key]) {
                        // Creamos la propiedad si no existe, manteniendo la estructura correcta
                        acc[key] = isNaN(Number(path[index + 1])) ? {} : [];
                    }
                    return acc[key];
                }, obj);

                if (Array.isArray(target)) {
                    target.push(newItem);
                } else {
                    console.warn('El destino no es un array, no se puede realizar el push.');
                }
            };

            if (this.current) {
                pushToNestedArray(this.current, path, object);
            }
        },

        /**
         * Removes an object from a nested array*/
        removeObject(path: string[], index: number) {
            const getNestedArray = (obj: any, path: string[]) => {
                return path.reduce((acc, key) => {
                    return acc && acc[key] !== undefined ? acc[key] : undefined;
                }, obj);
            };

            if (this.current) {
                const targetArray = getNestedArray(this.current, path);

                // Verifica si el destino es un array y el índice es válido
                if (Array.isArray(targetArray) && index >= 0 && index < targetArray.length) {
                    targetArray.splice(index, 1); // Elimina el elemento en el índice especificado
                } else {
                    console.warn('El destino no es un array válido o el índice está fuera de rango.');
                }
            }
        },
    },
});




















































