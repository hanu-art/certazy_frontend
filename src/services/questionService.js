import api from "./api";

/**
 * questionService.js
 *
 * Backend base: /api/v1/questions
 *
 * PUBLIC:
 *   GET  /api/v1/questions/test/:test_id → questions by test with options
 *   GET  /api/v1/questions/:id          → single question
 *
 * ADMIN ONLY:
 *   POST /api/v1/questions/create       → create question
 *   PUT  /api/v1/questions/update/:id   → update question
 *   DELETE /api/v1/questions/delete/:id → delete question
 */

const questionService = {
    // Public
    getByTestId: (testId) => api.get(`/v1/questions/test/${testId}`),
    getById: (id) => api.get(`/v1/questions/${id}`),

    // Admin only
    create: (data) => api.post("/v1/questions/create", data),
    update: (id, data) => api.put(`/v1/questions/update/${id}`, data),
    delete: (id) => api.delete(`/v1/questions/delete/${id}`),
};

export default questionService;
