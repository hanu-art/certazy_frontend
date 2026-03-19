import api from "./api";

/**
 * sectionService.js
 *
 * Backend base: /api/v1/sections
 *
 * PUBLIC:
 *   GET  /api/v1/sections/course/:course_id  → all sections of a course
 *   GET  /api/v1/sections/:id                → single section
 *
 * ADMIN ONLY:
 *   POST   /api/v1/sections/create
 *   PUT    /api/v1/sections/update/:id
 *   DELETE /api/v1/sections/delete/:id
 */

const sectionService = {
    // Public
    getByCourseId: (courseId) => api.get(`/v1/sections/course/${courseId}`),
    getById: (id) => api.get(`/v1/sections/${id}`),

    // Admin only
    create: (data) => api.post("/v1/sections/create", data),
    update: (id, data) => api.put(`/v1/sections/update/${id}`, data),
    delete: (id) => api.delete(`/v1/sections/delete/${id}`),
};

export default sectionService;