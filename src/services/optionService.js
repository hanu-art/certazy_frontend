import api from "./api";

/**
 * optionService.js
 *
 * Backend base: /api/v1/options
 *
 * PUBLIC:
 *   GET  /api/v1/options/question/:question_id → options by question
 *
 * ADMIN ONLY:
 *   POST /api/v1/options/create          → create option
 *   POST /api/v1/options/bulk/create     → bulk create options
 *   PUT  /api/v1/options/update/:id     → update option
 *   DELETE /api/v1/options/delete/:id   → delete option
 */

const optionService = {
    // Public
    getByQuestionId: (questionId) => api.get(`/v1/options/question/${questionId}`),

    // Admin only
    create: (data) => api.post("/v1/options/create", data),
    bulkCreate: (data) => api.post("/v1/options/bulk/create", data),
    update: (id, data) => api.put(`/v1/options/update/${id}`, data),
    delete: (id) => api.delete(`/v1/options/delete/${id}`),
};

export default optionService;
