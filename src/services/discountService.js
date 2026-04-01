import api from "./api";

/**
 * discountService.js
 *
 * Backend base: /api/v1/discounts
 *
 * PUBLIC:
 *   GET  /api/v1/discounts              → all active discounts
 *   GET  /api/v1/discounts/:code        → discount by code
 *
 * ADMIN ONLY:
 *   POST /api/v1/discounts/             → create discount
 *   GET  /api/v1/discounts/admin/all    → all discounts (admin view)
 *   PUT  /api/v1/discounts/:id          → update discount
 *   DELETE /api/v1/discounts/:id        → delete discount
 */

const discountService = {
    // Public
    getAll: () => api.get("/v1/discounts"),
    getByCode: (code) => api.get(`/v1/discounts/${code}`),

    // Admin only
    create: (data) => api.post("/v1/discounts/", data),
    getAllAdmin: () => api.get("/v1/discounts/"),
    update: (id, data) => api.put(`/v1/discounts/${id}`, data),
    delete: (id) => api.delete(`/v1/discounts/${id}`),
};

export default discountService;