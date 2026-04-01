import api from "./api";

/**
 * adminService.js
 *
 * IMPORTANT: Backend only has limited admin routes
 * Existing admin routes:
 *   GET  /api/v1/admin/permissions/:userId
 *   POST /api/v1/admin/permissions
 *   PUT  /api/v1/admin/permissions/:userId
 *   DELETE /api/v1/admin/permissions/:userId
 *
 * All other admin functionality needs to use existing public/student endpoints
 * Most endpoints are student-protected and will return 403 for admins
 *
 * WORKING ENDPOINTS:
 *   GET  /api/v1/auth/users/all         → all users with filters
 *   GET  /api/v1/auth/users/:id         → single user details
 *   PUT  /api/v1/auth/users/:id/status  → activate/deactivate user
 *   GET  /api/v1/courses              → all courses (filters + pagination)
 *   GET  /api/v1/courses/:slug        → single course
 *   
 * STUDENT-ONLY ENDPOINTS (403 for admins):
 *   GET  /api/v1/payments/history     → payment history (student only)
 *   GET  /api/v1/enrollments          → enrolled courses (student only)
 *   GET  /api/v1/reviews/*           → reviews (student/limited access)
 */

const adminService = {
    // Dashboard - using existing endpoints
    getDashboardStats: async () => {
        try {
            // Get users count
            const usersResponse = await api.get("/v1/auth/users/all");
            const users = usersResponse.data?.data?.users || [];
            
            // Get courses count  
            const coursesResponse = await api.get("/v1/courses");
            const courses = coursesResponse.data?.data?.courses || [];
            
            return {
                data: {
                    totalUsers: users.length,
                    activeUsers: users.filter(u => u.status === 'active').length,
                    totalCourses: courses.length,
                    publishedCourses: courses.filter(c => c.status === 'published').length,
                    totalRevenue: 0, // TODO: Calculate from payments when available
                    thisMonthRevenue: 0, // TODO: Calculate from payments when available
                    pendingReviews: 0, // TODO: Get from reviews when available
                    pendingPayments: 0, // TODO: Get from payments when available
                }
            };
        } catch (error) {
            return {
                data: {
                    totalUsers: 0,
                    activeUsers: 0,
                    totalCourses: 0,
                    publishedCourses: 0,
                    totalRevenue: 0,
                    thisMonthRevenue: 0,
                    pendingReviews: 0,
                    pendingPayments: 0,
                }
            };
        }
    },
    
    getRevenueOverview: async () => {
        return { data: { monthly: [] } }; // TODO: Implement when payment data available
    },

    // Users - using existing auth endpoints
    getUsers: (params = {}) => api.get("/v1/auth/users/all", { params }),
    getUserById: (id) => api.get(`/v1/auth/users/${id}`),
    updateUserStatus: (id, data) => api.put(`/v1/auth/users/${id}/status`, data),
    
    // Courses - using existing course endpoints
    getCourses: (params = {}) => api.get("/v1/courses", { params }),
    getCourseById: (id) => api.get(`/v1/courses/${id}`),
    toggleCourseStatus: async (id) => {
        // TODO: Implement when course update endpoint available
        console.log("Toggle course status for:", id);
    },
    toggleCourseFeatured: async (id) => {
        // TODO: Implement when course update endpoint available
        console.log("Toggle featured for:", id);
    },
    
    // Categories - using existing endpoints when available
    getCategories: async () => {
        try {
            // Extract categories from courses
            const coursesResponse = await api.get("/v1/courses");
            const courses = coursesResponse.data?.data?.courses || [];
            const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
            
            return {
                data: {
                    categories: categories.map((cat, index) => ({
                        id: index + 1,
                        name: cat,
                        description: `${cat} category`,
                        status: 'active'
                    }))
                }
            };
        } catch (error) {
            return { data: { categories: [] } };
        }
    },
    
    createCategory: async (data) => {
        // TODO: Implement when category endpoint available
        console.log("Create category:", data);
        return { data: { category: data } };
    },
    
    updateCategory: async (id, data) => {
        // TODO: Implement when category endpoint available  
        console.log("Update category:", id, data);
        return { data: { category: data } };
    },
    
    deleteCategory: async (id) => {
        // TODO: Implement when category endpoint available
        console.log("Delete category:", id);
        return { success: true };
    },
    
    // Payments - using existing payment endpoints
    getPayments: async (params = {}) => {
        try {
            const response = await api.get("/v1/payments/history", { params });
            return {
                data: {
                    payments: response.data?.data?.payments?.map(payment => ({
                        ...payment,
                        user: payment.user || { name: 'Unknown User', email: 'unknown@example.com' },
                        course: payment.course || { title: 'Unknown Course' },
                        userName: payment.user?.name || 'Unknown User',
                        userEmail: payment.user?.email || 'unknown@example.com', 
                        courseName: payment.course?.title || 'Unknown Course',
                    })) || []
                }
            };
        } catch (error) {
            return { data: { payments: [] } };
        }
    },
    
    getRecentPayments: async (limit = 10) => {
        const response = await api.get("/v1/payments/history", { params: { limit } });
        return {
            data: {
                payments: response.data?.data?.payments?.slice(0, limit).map(payment => ({
                    ...payment,
                    user: payment.user || { name: 'Unknown User', email: 'unknown@example.com' },
                    course: payment.course || { title: 'Unknown Course' },
                    userName: payment.user?.name || 'Unknown User',
                    userEmail: payment.user?.email || 'unknown@example.com',
                    courseName: payment.course?.title || 'Unknown Course',
                })) || []
            }
        };
    },
    
    updatePaymentStatus: async (id, status) => {
        // TODO: Implement when payment update endpoint available
        console.log("Update payment status:", id, status);
        return { success: true };
    },
    
    // Reviews - using existing endpoints when available
    getPendingReviews: async (limit = 10) => {
        try {
            // TODO: Implement when review endpoints available
            return { data: { reviews: [] } };
        } catch (error) {
            return { data: { reviews: [] } };
        }
    },
    
    getAllReviews: (params = {}) => {
        // TODO: Implement when review endpoints available
        return Promise.resolve({ data: { reviews: [] } });
    },
    
    approveReview: async (id) => {
        // TODO: Implement when review endpoints available
        console.log("Approve review:", id);
        return { success: true };
    },
    
    rejectReview: async (id) => {
        // TODO: Implement when review endpoints available
        console.log("Reject review:", id);
        return { success: true };
    },
    
    // Enrollments - using existing endpoints
    getEnrollments: (params = {}) => api.get("/v1/enrollments", { params }),
    updateEnrollment: (id, data) => {
        // TODO: Implement when enrollment update endpoint available
        console.log("Update enrollment:", id, data);
        return Promise.resolve({ success: true });
    },
    
    // Discounts - using existing endpoints when available
    getDiscounts: () => {
        // TODO: Implement when discount endpoints available
        return Promise.resolve({ data: { discounts: [] } });
    },
    
    createDiscount: (data) => {
        // TODO: Implement when discount endpoint available
        console.log("Create discount:", data);
        return Promise.resolve({ data: { discount: data } });
    },
    
    updateDiscount: (id, data) => {
        // TODO: Implement when discount endpoint available
        console.log("Update discount:", id, data);
        return Promise.resolve({ success: true });
    },
    
    deleteDiscount: (id) => {
        // TODO: Implement when discount endpoint available
        console.log("Delete discount:", id);
        return Promise.resolve({ success: true });
    },
    
    // Certificates - using existing endpoints when available
    getCertificates: () => {
        // TODO: Implement when certificate endpoints available
        return Promise.resolve({ data: { certificates: [] } });
    },
    
    issueCertificate: (data) => {
        // TODO: Implement when certificate endpoint available
        console.log("Issue certificate:", data);
        return Promise.resolve({ data: { certificate: data } });
    },
    
    revokeCertificate: (id) => {
        // TODO: Implement when certificate endpoint available
        console.log("Revoke certificate:", id);
        return Promise.resolve({ success: true });
    },
    
    // Contact Messages - using existing endpoints
    getContactMessages: (params = {}) => {
        // TODO: Implement when contact endpoints available
        return Promise.resolve({ data: { messages: [] } });
    },
    
    markMessageAsRead: (id) => {
        // TODO: Implement when contact endpoints available
        console.log("Mark message as read:", id);
        return Promise.resolve({ success: true });
    },
    
    replyToMessage: (id, data) => {
        // TODO: Implement when contact endpoints available
        console.log("Reply to message:", id, data);
        return Promise.resolve({ success: true });
    },
    
    // Settings - using existing endpoints when available
    getSettings: () => {
        // TODO: Implement when settings endpoints available
        return Promise.resolve({ data: { settings: {} } });
    },
    
    updateSettings: (data) => {
        // TODO: Implement when settings endpoints available
        console.log("Update settings:", data);
        return Promise.resolve({ success: true });
    },
    
    // Reports
    getRevenueReport: (params = {}) => {
        // TODO: Implement when report endpoints available
        return Promise.resolve({ data: { report: [] } });
    },
    
    getUserReport: (params = {}) => {
        // TODO: Implement when report endpoints available
        return Promise.resolve({ data: { report: [] } });
    },
    
    getCourseReport: (params = {}) => {
        // TODO: Implement when report endpoints available
        return Promise.resolve({ data: { report: [] } });
    },
    
    exportData: (type, params = {}) => {
        // TODO: Implement when export endpoints available
        console.log("Export data:", type, params);
        return Promise.resolve(new Blob());
    },
};

export default adminService;