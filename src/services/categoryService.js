import api from "./api";

/**
 * categoryService.js
 *
 * Backend base: /api/v1/categories
 *
 * PUBLIC:
 *   GET  /api/v1/categories              → sab categories
 *   GET  /api/v1/categories/slug/:slug   → slug se single category
 *   GET  /api/v1/categories/:id          → id se single category
 *
 * ADMIN ONLY:
 *   POST   /api/v1/categories/create       → create
 *   PUT    /api/v1/categories/update/:id   → update
 *   DELETE /api/v1/categories/delete/:id   → soft delete
 */

const categoryService = {
    // Public
    getAll: () => api.get("/v1/categories"),
    getBySlug: (slug) => api.get(`/v1/categories/slug/${slug}`),
    getById: (id) => api.get(`/v1/categories/${id}`),

    // Admin only
    create: (data) => api.post("/v1/categories/create", data),
    update: (id, data) => api.put(`/v1/categories/update/${id}`, data),
    delete: (id) => api.delete(`/v1/categories/delete/${id}`),
};

export default categoryService;