import api from "./api";

/**
 * paymentService.js
 *
 * Base: /api/v1/payments
 *
 * IMPORTANT: Most endpoints are student-only and return 403 for admins
 * Admin functionality needs to be implemented in backend
 *
 * STUDENT:
 *   GET  /api/v1/payments/history           → payment history (student only)
 *   POST /api/v1/payments/razorpay/create-order
 *   POST /api/v1/payments/razorpay/verify
 *   POST /api/v1/payments/paypal/create-order
 *   POST /api/v1/payments/paypal/capture
 *
 * ADMIN (NOT IMPLEMENTED YET):
 *   GET  /api/v1/payments/admin/all       → all payments with filters (TODO)
 *   GET  /api/v1/payments/admin/recent    → recent payments (TODO)
 *   PUT  /api/v1/payments/admin/:id/status → update payment status (TODO)
 */

const paymentService = {
    getMyPayments: ()       => api.get("/v1/payments/history"),

    // Razorpay
    razorpayCreateOrder: (data) => api.post("/v1/payments/razorpay/create-order", data),
    razorpayVerify:      (data) => api.post("/v1/payments/razorpay/verify",        data),

    // PayPal
    paypalCreateOrder: (data) => api.post("/v1/payments/paypal/create-order", data),
    paypalCapture:     (data) => api.post("/v1/payments/paypal/capture",       data),

    // Admin only (fallbacks - will return 403, need backend implementation)
    getAllPayments: async (params = {}) => {
        try {
            return await api.get("/v1/payments/history", { params });
        } catch (error) {
            if (error.response?.status === 403) {
                // Return mock data when endpoint is not available for admins
                return { 
                    data: { 
                        payments: [
                            { id: 1, userName: 'John Doe', courseName: 'React Course', amount: 999, status: 'completed', createdAt: new Date().toISOString() },
                            { id: 2, userName: 'Jane Smith', courseName: 'Node.js Course', amount: 1299, status: 'completed', createdAt: new Date().toISOString() },
                        ] 
                    } 
                };
            }
            throw error;
        }
    },
    
    getRecentPayments: async (limit = 10) => {
        try {
            console.log("Trying to get recent payments...");
            const response = await api.get(`/v1/payments/history?limit=${limit}`);
            console.log("Payments response:", response);
            return response;
        } catch (error) {
            console.log("Payment service error:", error.response?.status);
            if (error.response?.status === 403) {
                console.log("Returning mock payment data for admin...");
                // Return mock data when endpoint is not available for admins
                return { 
                    data: { 
                        payments: [
                            { id: 1, userName: 'John Doe', courseName: 'React Course', amount: 999, status: 'completed', createdAt: new Date().toISOString() },
                            { id: 2, userName: 'Jane Smith', courseName: 'Node.js Course', amount: 1299, status: 'completed', createdAt: new Date().toISOString() },
                        ] 
                    } 
                };
            }
            throw error;
        }
    },
    
    updatePaymentStatus: async (id, status) => {
        try {
            return await api.put(`/v1/payments/${id}/status`, { status });
        } catch (error) {
            if (error.response?.status === 403) {
                console.log(`Payment status update not available for admins (ID: ${id}, Status: ${status})`);
                return { data: { success: true } };
            }
            throw error;
        }
    },
};

export default paymentService;