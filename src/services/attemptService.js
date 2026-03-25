import api from "./api";

/**
 * attemptService.js
 *
 * Base: /api/v1/attempts
 *
 * STUDENT:
 *   POST /api/v1/attempts/:testId/start       → test start karo
 *   POST /api/v1/attempts/submit              → test submit karo
 *   GET  /api/v1/attempts/:testId/history     → ek test ki history
 *   GET  /api/v1/attempts/:attemptId/detail   → attempt ka detail (answers)
 */

const attemptService = {
    // Test start karo
    startAttempt: (testId) => api.post(`/v1/attempts/${testId}/start`),

    // Test submit karo
    submitAttempt: (data) => api.post("/v1/attempts/submit", data),

    // Ek test ki attempt history
    getAttemptHistory: (testId) => api.get(`/v1/attempts/${testId}/history`),

    // Single attempt ka full detail (answers + explanations)
    getAttemptDetail: (attemptId) => api.get(`/v1/attempts/${attemptId}/detail`),
};

export default attemptService;