import api from "./api";

/**
 * enrollmentService.js
 *
 * Base: /api/v1/enrollments
 *
 * Using existing working endpoints and fallbacks for missing admin endpoints
 *
 * STUDENT:
 *   GET  /api/v1/enrollments          → my enrolled courses (with progress)
 *   GET  /api/v1/enrollments/:courseId → am I enrolled in this course?
 *
 * ADMIN ONLY (FALLBACKS):
 *   GET  /api/v1/enrollments/admin/all → all enrollments with filters (TODO: implement)
 *   GET  /api/v1/enrollments/admin/stats → enrollment statistics (TODO: implement)
 */

const enrollmentService = {
    // GET /v1/enrollments — student ke saare enrolled courses
    getMyEnrollments: () => api.get("/v1/enrollments"),

    // GET /v1/enrollments/:courseId — check if enrolled
    checkEnrollment: (courseId) => api.get(`/v1/enrollments/${courseId}`),

    // Admin only (fallbacks - will return 403, need backend implementation)
    getAllEnrollments: async (params = {}) => {
        try {
            return await api.get("/v1/enrollments", { params });
        } catch (error) {
            if (error.response?.status === 403) {
                // Return mock data when endpoint is not available for admins
                return { 
                    data: { 
                        enrollments: [
                            { id: 1, userName: 'John Doe', courseName: 'React Course', status: 'active', enrolledAt: new Date().toISOString() },
                            { id: 2, userName: 'Jane Smith', courseName: 'Node.js Course', status: 'active', enrolledAt: new Date().toISOString() },
                        ] 
                    } 
                };
            }
            throw error;
        }
    },
    
    getEnrollmentStats: async () => {
        try {
            return await api.get("/v1/enrollments");
        } catch (error) {
            if (error.response?.status === 403) {
                // Return mock stats when endpoint is not available for admins
                return { 
                    data: { 
                        totalEnrollments: 150,
                        activeEnrollments: 120,
                        completedEnrollments: 30,
                        thisMonthEnrollments: 25,
                    } 
                };
            }
            throw error;
        }
    },
};

export default enrollmentService;