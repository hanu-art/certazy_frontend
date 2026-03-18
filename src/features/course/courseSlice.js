import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "@/services/courseService";

/**
 * courseSlice.js
 *
 * Global course state — CoursesPage reads from here.
 *
 * State:
 *   courses     → fetched courses list
 *   pagination  → total, page, limit, totalPages
 *   filters     → category, level, search, sort
 *   loading     → API call in progress
 *   error       → error message
 */

// ─────────────────────────────────────────────
// ASYNC THUNK
// ─────────────────────────────────────────────

// GET /api/v1/courses?status=published&page=1&limit=12&...
export const fetchCourses = createAsyncThunk(
    "course/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const { data } = await courseService.getAll({
                status: "published",
                ...params,
            });
            return data; // { data: [...], pagination: {...} }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch courses"
            );
        }
    }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const courseSlice = createSlice({
    name: "course",

    initialState: {
        courses: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 0,
        },
        filters: {
            category: null,  // category slug from URL — e.g. "amazon-aws"
            level: null,  // "beginner" | "intermediate" | "advanced"
            search: null,  // search query string
            sort: null,  // "newest" | "price_high" | "price_low" | "rating"
        },
        loading: false,
        error: null,
    },

    reducers: {
        // Set individual filter — triggers new fetch from component
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
            state.pagination.page = 1; // reset to page 1 on filter change
        },

        // Clear all filters
        clearFilters: (state) => {
            state.filters = {
                category: null,
                level: null,
                search: null,
                sort: null,
            };
            state.pagination.page = 1;
        },

        // Set page
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.courses = action.payload.data;
                state.pagination = action.payload.pagination;
                state.loading = false;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilter, clearFilters, setPage, clearError } = courseSlice.actions;

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────
export const selectCourses = (state) => state.course.courses;
export const selectPagination = (state) => state.course.pagination;
export const selectFilters = (state) => state.course.filters;
export const selectCoursesLoading = (state) => state.course.loading;
export const selectCoursesError = (state) => state.course.error;

export default courseSlice.reducer;