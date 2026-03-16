import api from "./api";

/**
 * authService.js
 *
 * Backend base: /api/v1/auth
 *
 * LOCAL AUTH:
 *   POST  /api/v1/auth/register          → student registration
 *   POST  /api/v1/auth/login             → login (all roles)
 *   POST  /api/v1/auth/refresh           → access token refresh
 *   POST  /api/v1/auth/logout            → logout
 *   POST  /api/v1/auth/change-password   → first login password change
 *   GET   /api/v1/auth/me                → logged in user info
 *
 * OAUTH:
 *   GET   /api/v1/auth/google            → Google OAuth redirect
 *   GET   /api/v1/auth/github            → GitHub OAuth redirect
 *   (callbacks backend handle karta hai)
 *
 * ADMIN:
 *   GET   /api/v1/auth/users/all         → all users list
 *   GET   /api/v1/auth/users/:id         → single user
 *   PUT   /api/v1/auth/users/:id/status  → activate/deactivate user
 */

const authService = {
    // Local auth
    register: (data) => api.post("/v1/auth/register", data),
    login: (data) => api.post("/v1/auth/login", data),
    refresh: () => api.post("/v1/auth/refresh"),
    logout: () => api.post("/v1/auth/logout"),
    changePassword: (data) => api.post("/v1/auth/change-password", data),
    me: () => api.get("/v1/auth/me"),

    // OAuth — browser redirect (not axios)
    googleLogin: () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/v1/auth/google`;
    },
    githubLogin: () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/v1/auth/github`;
    },

    // Admin
    getAllUsers: () => api.get("/v1/auth/users/all"),
    getUserById: (id) => api.get(`/v1/auth/users/${id}`),
    updateUserStatus: (id, data) => api.put(`/v1/auth/users/${id}/status`, data),
};

export default authService;