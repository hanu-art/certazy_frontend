import api from "./api";

/**
 * enrollmentService.js
 *
 * Base: /api/v1/enrollments
 *
 * STUDENT:
 *   GET  /api/v1/enrollments          → my enrolled courses (with progress)
 *   GET  /api/v1/enrollments/:courseId → am I enrolled in this course?
 */

const enrollmentService = {
    // GET /v1/enrollments — student ke saare enrolled courses
    getMyEnrollments: () => api.get("/v1/enrollments"),

    // GET /v1/enrollments/:courseId — check if enrolled
    checkEnrollment: (courseId) => api.get(`/v1/enrollments/${courseId}`),
};

export default enrollmentService;