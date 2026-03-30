import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/services/authService";

/**
 * authSlice.js
 *
 * Global auth state — poore app mein yahan se read karo.
 *
 * State:
 *   user         → logged in user object (name, email, role, avatar)
 *   accessToken  → JWT access token (memory only — never localStorage)
 *   isLoggedIn   → boolean
 *   isFirstLogin → sub-admin first login force change password
 *   loading      → API call chal raha hai
 *   error        → error message
 */

// ─────────────────────────────────────────────
// ASYNC THUNKS — API calls
// ─────────────────────────────────────────────

// POST /api/v1/auth/login
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await authService.login(credentials);
            return data.data; // { user, accessToken }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

// POST /api/v1/auth/logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (err) {
            // Logout fail ho toh bhi state clear karo
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// GET /api/v1/auth/me
// App start pe logged in user fetch karo
export const fetchMe = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await authService.me();
            return data.data; // { user }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Session expired"
            );
        }
    }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: null,
        accessToken: null,
        isLoggedIn: false,
        isFirstLogin: false, // sub-admin force change password
        loading: false,
        error: null,
    },

    reducers: {
        // api.js interceptor se naya token aane pe
        setToken: (state, action) => {
            state.accessToken = action.payload;
        },

        // OAuth login ke baad token + user set karo
        // Google/GitHub callback se redirect aane pe
        setAuthFromOAuth: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isLoggedIn = true;
            state.isFirstLogin = user.is_first_login ?? false;
        },

        // Error clear karo
        clearError: (state) => {
            state.error = null;
        },

        // Clear auth state completely
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLoggedIn = false;
            state.isFirstLogin = false;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // ── Login ──────────────────────────────
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user, accessToken } = action.payload;
                state.user = user;
                state.accessToken = accessToken;
                state.isLoggedIn = true;
                state.isFirstLogin = user.is_first_login ?? false;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── Logout ─────────────────────────────
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isLoggedIn = false;
                state.isFirstLogin = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                // Fail ho toh bhi clear karo
                state.user = null;
                state.accessToken = null;
                state.isLoggedIn = false;
            });

        // ── Fetch Me ───────────────────────────
        builder
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(fetchMe.rejected, (state) => {
                // Token expired — state clear karo
                state.user = null;
                state.accessToken = null;
                state.isLoggedIn = false;
                state.loading = false;
            });
    },
});

export const { setToken, setAuthFromOAuth, clearError, clearAuth } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsFirstLogin = (state) => state.auth.isFirstLogin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;