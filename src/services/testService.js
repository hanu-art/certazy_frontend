import api from "./api";

/**
 * testService.js
 *
 * Backend base: /api/v1/tests
 *
 * PUBLIC:
 *   GET  /api/v1/tests/course/:course_id → tests by course
 *   GET  /api/v1/tests/:id/full        → full test with questions
 *   GET  /api/v1/tests/:id             → single test
 *
 * STUDENT:
 *   POST /api/v1/tests/:id/attempt     → start exam attempt
 *   PUT  /api/v1/tests/:id/submit      → submit exam
 *   GET  /api/v1/tests/:id/result      → get exam result
 *
 * ADMIN ONLY:
 *   POST /api/v1/tests/create          → create test
 *   PUT  /api/v1/tests/update/:id       → update test
 *   DELETE /api/v1/tests/delete/:id     → delete test
 */

const testService = {
    // Public
    getByCourseId: (courseId) => api.get(`/v1/tests/course/${courseId}`),
    getTestFull: (id) => api.get(`/v1/tests/${id}/full`),
    getById: (id) => api.get(`/v1/tests/${id}`),

    // Student
    startAttempt: (testId) => api.post(`/v1/tests/${testId}/attempt`),
    submitExam: (testId, data) => api.put(`/v1/tests/${testId}/submit`, data),
    getResult: (testId) => api.get(`/v1/tests/${testId}/result`),
    getStudentAttempts: (studentId) => api.get(`/v1/tests/attempts/student/${studentId}`),

    // Admin only
    create: (data) => api.post("/v1/tests/create", data),
    update: (id, data) => api.put(`/v1/tests/update/${id}`, data),
    delete: (id) => api.delete(`/v1/tests/delete/${id}`),
};

export default testService;