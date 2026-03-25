import api from "./api";

/**
 * paymentService.js
 *
 * Base: /api/v1/payments
 *
 * STUDENT:
 *   GET  /api/v1/payments/history           → payment history
 *   POST /api/v1/payments/razorpay/create-order
 *   POST /api/v1/payments/razorpay/verify
 *   POST /api/v1/payments/paypal/create-order
 *   POST /api/v1/payments/paypal/capture
 */

const paymentService = {
    getMyPayments: ()       => api.get("/v1/payments/history"),

    // Razorpay
    razorpayCreateOrder: (data) => api.post("/v1/payments/razorpay/create-order", data),
    razorpayVerify:      (data) => api.post("/v1/payments/razorpay/verify",        data),

    // PayPal
    paypalCreateOrder: (data) => api.post("/v1/payments/paypal/create-order", data),
    paypalCapture:     (data) => api.post("/v1/payments/paypal/capture",       data),
};

export default paymentService;