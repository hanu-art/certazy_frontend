import api from "./api";

/**
 * certificateService.js
 *
 * Base: /api/v1/certificates
 *
 * STUDENT:
 *   GET  /api/v1/certificates → my certificates
 */

const certificateService = {
    // GET /v1/certificates — student ke saare certificates
    getMyCertificates: () => api.get("/v1/certificates"),
};

export default certificateService;