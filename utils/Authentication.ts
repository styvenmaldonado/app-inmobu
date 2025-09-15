import {API_URL} from "~/global";
import type {User} from "~/interface/User";

const TOKEN_EXPIRATION_TIME = 10 * 60000; // 10 minutos


export const signIn = async (credentials: Credentials, callback: string) => {
        const idToken = await $fetch(`${API_URL}/auth/login/`, {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        localStorage.setItem("AuthenticationServiceIDTOKEN", idToken as string);
        await navigateTo(callback);

}

let cachedUser: any = null; // Caché en memoria
let userPromise: Promise<any> | null = null; // Caché de la promesa en curso

export const getUser = async (): Promise<User | boolean> => {
    try {
        if (cachedUser) {
            return cachedUser;
        }

        if (userPromise) {
            return userPromise;
        }

        // Obtener el token desde el almacenamiento local
        const idToken = localStorage.getItem("AuthenticationServiceIDTOKEN");
        if (!idToken) {
            cachedUser = false; // Cachear el resultado falso
            return false;
        }

        // Guardar la promesa en curso para evitar múltiples llamadas
        userPromise = useAsyncData(
            idToken,
            () =>
                $fetch("/api/auth", {
                    method: "POST",
                    body: { token: idToken },
                })
        ).then(({ data }) => {
            cachedUser = data.value; // Cachear los datos obtenidos
            userPromise = null; // Limpiar la promesa en curso
            return cachedUser;
        });

        // Retorna el resultado de la promesa
        return userPromise;
    } catch (error) {
        console.error("Error al verificar autenticación del usuario:", error);
        cachedUser = false; // Cachear el resultado falso
        userPromise = null; // Limpiar la promesa fallida
        return false;
    }
};

export const getAccessToken = async () => {
    const idToken = localStorage.getItem("AuthenticationServiceIDTOKEN");
    if (!idToken) logOut()
    let accessTokenData = sessionStorage.getItem("AuthenticationServiceACCESSTOKEN");
    if (!accessTokenData || JSON.parse(accessTokenData).expire < Date.now()) {
        const accessToken = await $fetch(`${API_URL}/auth/accessToken`, {
            method: "POST",
            query: { token: idToken },
        });
        accessTokenData = JSON.stringify({
            expire: Date.now() + TOKEN_EXPIRATION_TIME,
            token: accessToken,
        });
        sessionStorage.setItem("AuthenticationServiceACCESSTOKEN", accessTokenData);
    }
    return JSON.parse(accessTokenData).token;
}



export const logOut = async () => {
    const token = localStorage.getItem("AuthenticationServiceIDTOKEN");
    await $fetch(`${API_URL}/auth/logOut`, {
        method: "POST",
        query: { token },
    });
    await  localStorage.clear()
    await  sessionStorage.clear()
    await navigateTo("/login")
}


interface Credentials {
    username: string;
    password: string;
}