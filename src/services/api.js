import axios from "axios";

/**
 * api.js — Axios Instance
 *
 * Poore app ka single HTTP client.
 * Har service file isi se import karti hai.
 *
 * Kya karta hai:
 *  1. Base URL set karta hai .env se
 *  2. Har request mein Authorization header auto-attach karta hai
 *  3. 401 aane pe refresh token se new access token leta hai
 *  4. Refresh bhi fail ho toh logout karke /login pe bhejta hai
 */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // refresh token cookie ke liye
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Store ko lazy load karo — circular import se bachne ke liye ──
let store;
const getStore = async () => {
    if (!store) {
        store = (await import("@/app/store")).default;
    }
    return store;
};

// ── Request interceptor ───────────────────────────────────
// Har request se pehle — access token header mein lagao
api.interceptors.request.use(
    async (config) => {
        const s = await getStore();
        const token = s.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.post("/v1/auth/refresh");
                const newToken = data.data.accessToken;

                const s = await getStore();
                const { setToken } = await import("@/features/auth/authSlice");
                s.dispatch(setToken(newToken));

                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);

                const s = await getStore();
                const { logout } = await import("@/features/auth/authSlice");
                s.dispatch(logout());

                window.location.href = "/login";
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;