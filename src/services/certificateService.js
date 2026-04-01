import api from "./api";

/**
 * certificateService.js
 *
 * Backend base: /api/v1/certificates
 *
 * STUDENT:
 *   GET  /api/v1/certificates → my certificates
 *
 * PUBLIC:
 *   GET  /api/v1/certificates/:id      → download certificate
 *
 * ADMIN ONLY:
 *   POST /api/v1/certificates/issue    → issue certificate
 *   GET  /api/v1/certificates/admin/all → all certificates (admin view)
 *   PUT  /api/v1/certificates/:id/revoke → revoke certificate
 */

const certificateService = {
    // GET /v1/certificates — student ke saare certificates
    getMyCertificates: () => api.get("/v1/certificates"),
    
    // Public
    download: (id) => api.get(`/v1/certificates/${id}`, { responseType: 'blob' }),

    // Admin only
    issue: (data) => api.post("/v1/certificates/issue", data),
    getAllAdmin: () => api.get("/v1/certificates/admin/all"),
    revoke: (id) => api.put(`/v1/certificates/${id}/revoke`),
};

export default certificateService;