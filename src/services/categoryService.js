import api from "./api";

/**
 * categoryService.js
 *
 * Backend base: /api/v1/categories
 *
 * PUBLIC:
 *   GET  /api/v1/categories              → sab categories
 *   GET  /api/v1/categories/slug/:slug   → slug se single category
 *   GET  /api/v1/categories/:id          → id se single category
 *
 * ADMIN ONLY:
 *   POST   /api/v1/categories/create       → create
 *   PUT    /api/v1/categories/update/:id   → update
 *   DELETE /api/v1/categories/delete/:id   → soft delete
 */
const categoryService = {
  // GET all categories
  getAll: async () => {
    try {
      const response = await api.get("/v1/categories");
      return response;
    } catch (error) {
    
      throw error;
    }
  },

  // GET category by slug
  getBySlug: async (slug) => {
    try {
      return await api.get(`/v1/categories/slug/${slug}`);
    } catch (error) {
  
      throw error;
    }
  },
  
  // GET category by ID
  getById: async (id) => {
    try {
      return await api.get(`/v1/categories/${id}`);
    } catch (error) {
     
      throw error;
    }
  },

  // CREATE category
  create: async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        sort_order: data.sort_order || 1,
        is_active: data.status === "active" ? 1 : 0,
         parent_id: data.parent_id || undefined,
      };

      
      const response = await api.post("/v1/categories/create", payload);
   
      return response;
    } catch (error) {
   
      throw error;
    }
  },

  // UPDATE category
  update: async (id, data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        sort_order: data.sort_order || 1,
      };

      const response = await api.put(`/v1/categories/update/${id}`, payload);
    
  
      
      return response;
    } catch (error) {
    
      throw error;
    }
  },

  // DELETE category
  delete: async (id) => {
    try {
     
      const response = await api.delete(`/v1/categories/delete/${id}`);
    
      return response;
    } catch (error) {
    
      throw error;
    }
  },
};

export default categoryService;