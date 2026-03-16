import axios from "axios";

/**
 * api.js — Axios Instance
 *
 * Yeh file poore app ka single HTTP client hai.
 * Har service file isi se import karti hai.
 *
 * Kya karta hai:
 *  1. Base URL set karta hai .env se
 *  2. Har request mein Authorization header auto-attach karta hai
 *  3. 401 aane pe refresh token se new access token leta hai
 *  4. Refresh bhi fail ho toh logout karke /login pe bhejta hai
 */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // .env → VITE_API_BASE_URL=http://localhost:5000/api
    withCredentials: true,                              // refresh token cookie ke liye
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor ───────────────────────────────────
// Har request se pehle — access token header mein lagao
api.interceptors.request.use(
    (config) => {
        // Redux store se token lo
        // Circular import se bachne ke liye store yahan import karo
        const { store } = require("@/app/store");
        const token = store.getState().auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────
// 401 aaye toh refresh karo, phir original request retry karo
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
    (response) => response, // success — as it is return karo

    async (error) => {
        const originalRequest = error.config;

        // 401 aaya + yeh already retry nahi hai
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Agar refresh chal raha hai toh queue mein daal do
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
                // Refresh token cookie automatically jayegi (withCredentials: true)
                const { data } = await api.post("/auth/refresh");
                const newToken = data.data.accessToken;

                // Redux mein naya token save karo
                const { store } = require("@/app/store");
                const { setToken } = require("@/features/auth/authSlice");
                store.dispatch(setToken(newToken));

                // Queue mein pending requests ko naya token do
                processQueue(null, newToken);

                // Original request retry karo
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh bhi fail — logout karo
                processQueue(refreshError, null);

                const { store } = require("@/app/store");
                const { logout } = require("@/features/auth/authSlice");
                store.dispatch(logout());

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