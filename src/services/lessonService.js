import api from "./api";

/**
 * lessonService.js
 *
 * Backend base: /api/v1/lessons
 *
 * PUBLIC:
 *   GET  /api/v1/lessons/section/:section_id       → lessons by section
 *   GET  /api/v1/lessons/free/course/:course_id    → free preview lessons
 *   GET  /api/v1/lessons/:id                       → single lesson
 *
 * ADMIN ONLY:
 *   POST   /api/v1/lessons/create
 *   PUT    /api/v1/lessons/update/:id
 *   DELETE /api/v1/lessons/delete/:id
 */

const lessonService = {
    // Public
    getBySectionId: (sectionId) => api.get(`/v1/lessons/section/${sectionId}`),
    getFreeByCourseId: (courseId) => api.get(`/v1/lessons/free/course/${courseId}`),
    getById: (id) => api.get(`/v1/lessons/${id}`),

    // Admin only
    create: (data) => api.post("/v1/lessons/create", data),
    update: (id, data) => api.put(`/v1/lessons/update/${id}`, data),
    delete: (id) => api.delete(`/v1/lessons/delete/${id}`),
};

export default lessonService;