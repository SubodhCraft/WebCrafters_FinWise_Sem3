// import axios from "axios";

// const Api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// //   withCredentials: true,
//     headers: {
//     "Content-Type": "application/json",
//   },
// });

// const ApiFormData = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// //   withCredentials: true,
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
// });

// const config = {
//   headers: {
//     "authorization": `Bearer ${localStorage.getItem("token")}`,
//   },
// };
// //Register User and check Login   
// export const createUserApi = (data) => Api.post("/api/auth/register", data);
// export const loginUserApi = (data) => Api.post("/api/auth/login", data);
// export const forgotPasswordApi = (data) => Api.post("/api/auth/forgot-password", data);
// export const getAllUsersApi = () => Api.get("/api/auth/get_all_users", config());
// export const getUserProfileApi = () => Api.get("/api/auth/profile", config());


// export const saveSecurityQuestionsApi = (data) => {
//   return Api.post("/api/security/save", data);
// };

// // Get security questions by email
// export const getSecurityQuestionsApi = (email) => {
//   return Api.get(`/api/security/questions/${email}`);
// };

// // Verify security answers
// export const verifySecurityAnswersApi = (data) => {
//   return Api.post("/api/security/verify", data);
// };

// // Reset password
// export const resetPasswordApi = (data) => {
//   return Api.post("/api/security/reset-password", data);
// };

// // Create new transaction
// export const createTransactionApi = (data) => {
//   return Api.post("/api/transactions", data, config());
// };

// // Get recent transactions (last 10)
// export const getRecentTransactionsApi = () => {
//   return Api.get("/api/transactions/recent", config());
// };

// // Get all transactions with pagination and filters
// export const getAllTransactionsApi = (params) => {
//   return Api.get("/api/transactions", { ...config(), params });
// };

// // Get transaction statistics
// export const getTransactionStatsApi = () => {
//   return Api.get("/api/transactions/stats", config());
// };

// // Update transaction
// export const updateTransactionApi = (id, data) => {
//   return Api.put(`/api/transactions/${id}`, data, config());
// };

// // Delete transaction
// export const deleteTransactionApi = (id) => {
//   return Api.delete(`/api/transactions/${id}`, config());
// };

// // Get transactions by date range
// export const getTransactionsByDateRangeApi = (startDate, endDate) => {
//   return Api.get("/api/transactions/date-range", {
//     ...config(),
//     params: { startDate, endDate }
//   });
// };

// // Get all categories (income and expense)
// export const getAllCategoriesApi = () => {
//   return Api.get("/api/categories", config());
// };

// // Create new category (Admin only)
// export const createCategoryApi = (data) => {
//   return Api.post("/api/categories", data, config());
// };

// // Update category (Admin only)
// export const updateCategoryApi = (id, data) => {
//   return Api.put(`/api/categories/${id}`, data, config());
// };

// // Delete category (Admin only)
// export const deleteCategoryApi = (id) => {
//   return Api.delete(`/api/categories/${id}`, config());
// };

// export default Api;








































// import axios from "axios";

// /* ================= BASE API ================= */
// const Api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* ================= FORM DATA API ================= */
// const ApiFormData = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
// });
// const config = {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`
//   }
// };

// /* ================= TOKEN INTERCEPTOR ================= */
// const attachToken = (req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// };

// Api.interceptors.request.use(attachToken, (error) =>
//   Promise.reject(error)
// );

// ApiFormData.interceptors.request.use(attachToken, (error) =>
//   Promise.reject(error)
// );

// /* ================= AUTH ================= */
// export const createUserApi = (data) =>
//   Api.post("/api/auth/register", data);

// export const loginUserApi = (data) =>
//   Api.post("/api/auth/login", data);

// export const forgotPasswordApi = (data) =>
//   Api.post("/api/auth/forgot-password", data);

// export const getAllUsersApi = () =>
//   Api.get("/api/auth/get_all_users");

// export const getUserProfileApi = () =>
//   Api.get("/api/auth/profile", config());

// /* ================= SECURITY QUESTIONS ================= */
// export const saveSecurityQuestionsApi = (data) =>
//   Api.post("/api/security/save", data);

// export const getSecurityQuestionsApi = (email) =>
//   Api.get(`/api/security/questions/${email}`);

// export const verifySecurityAnswersApi = (data) =>
//   Api.post("/api/security/verify", data);

// export const resetPasswordApi = (data) =>
//   Api.post("/api/security/reset-password", data);

// /* ================= TRANSACTIONS ================= */
// export const createTransactionApi = (data) =>
//   Api.post("/api/transactions", data);

// export const getRecentTransactionsApi = () =>
//   Api.get("/api/transactions/recent");

// export const getAllTransactionsApi = (params) =>
//   Api.get("/api/transactions", { params });

// export const getTransactionStatsApi = () =>
//   Api.get("/api/transactions/stats");

// export const updateTransactionApi = (id, data) =>
//   Api.put(`/api/transactions/${id}`, data);

// export const deleteTransactionApi = (id) =>
//   Api.delete(`/api/transactions/${id}`);

// export const getTransactionsByDateRangeApi = (startDate, endDate) =>
//   Api.get("/api/transactions/date-range", {
//     params: { startDate, endDate },
//   });

// /* ================= CATEGORIES ================= */
// export const getAllCategoriesApi = () =>
//   Api.get("/api/categories");

// export const createCategoryApi = (data) =>
//   Api.post("/api/categories", data);

// export const updateCategoryApi = (id, data) =>
//   Api.put(`/api/categories/${id}`, data);

// export const deleteCategoryApi = (id) =>
//   Api.delete(`/api/categories/${id}`);

// // ==================== SELF NOTE APIs ====================

// // Create new self note
// export const createSelfNoteApi = (data) => {
//   return Api.post("/api/selfnotes", data, config());
// };

// // Get all self notes with pagination and search
// export const getAllSelfNotesApi = (params) => {
//   return Api.get("/api/selfnotes", { ...config(), params });
// };

// // Get recent self notes (last 10)
// export const getRecentSelfNotesApi = () => {
//   return Api.get("/api/selfnotes/recent", config());
// };

// // Get single self note by ID
// export const getSelfNoteByIdApi = (id) => {
//   return Api.get(`/api/selfnotes/${id}`, config());
// };

// // Update self note
// export const updateSelfNoteApi = (id, data) => {
//   return Api.put(`/api/selfnotes/${id}`, data, config());
// };

// // Toggle pin status
// export const togglePinSelfNoteApi = (id) => {
//   return Api.patch(`/api/selfnotes/${id}/pin`, {}, config());
// };

// // Delete self note
// export const deleteSelfNoteApi = (id) => {
//   return Api.delete(`/api/selfnotes/${id}`, config());
// };

// // Get notes count
// export const getSelfNotesCountApi = () => {
//   return Api.get("/api/selfnotes/count", config());
// };

// export default Api;



















































import axios from "axios";

/* ================= BASE API ================= */
const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= FORM DATA API ================= */
const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/* ================= TOKEN INTERCEPTOR ================= */
const attachToken = (req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
};

Api.interceptors.request.use(attachToken, (error) =>
  Promise.reject(error)
);

ApiFormData.interceptors.request.use(attachToken, (error) =>
  Promise.reject(error)
);

/* ================= AUTH ================= */
export const createUserApi = (data) =>
  Api.post("/api/auth/register", data);

export const loginUserApi = (data) =>
  Api.post("/api/auth/login", data);

export const forgotPasswordApi = (data) =>
  Api.post("/api/auth/forgot-password", data);

export const getAllUsersApi = () =>
  Api.get("/api/auth/get_all_users");

export const getUserProfileApi = () =>
  Api.get("/api/auth/profile");

export const updateUserProfileApi = (data) =>
  Api.put("/api/auth/profile", data);

export const changePasswordApi = (data) =>
  Api.post("/api/auth/change-password", data);

export const uploadProfilePictureApi = (formData) =>
  ApiFormData.post("/api/auth/upload-profile-picture", formData);

export const deleteAccountApi = (data) =>
  Api.delete("/api/auth/delete-account", { data });


/* ================= SECURITY QUESTIONS ================= */
export const saveSecurityQuestionsApi = (data) =>
  Api.post("/api/security/save", data);

export const getSecurityQuestionsApi = (email) =>
  Api.get(`/api/security/questions/${email}`);

export const verifySecurityAnswersApi = (data) =>
  Api.post("/api/security/verify", data);

export const resetPasswordApi = (data) =>
  Api.post("/api/security/reset-password", data);

/* ================= TRANSACTIONS ================= */
export const createTransactionApi = (data) =>
  Api.post("/api/transactions", data);

export const getRecentTransactionsApi = () =>
  Api.get("/api/transactions/recent");

export const getAllTransactionsApi = (params) =>
  Api.get("/api/transactions", { params });

export const getTransactionStatsApi = () =>
  Api.get("/api/transactions/stats");

export const updateTransactionApi = (id, data) =>
  Api.put(`/api/transactions/${id}`, data);

export const deleteTransactionApi = (id) =>
  Api.delete(`/api/transactions/${id}`);

export const getTransactionsByDateRangeApi = (startDate, endDate) =>
  Api.get("/api/transactions/date-range", {
    params: { startDate, endDate },
  });

/* ================= CATEGORIES ================= */
export const getAllCategoriesApi = () =>
  Api.get("/api/categories");

export const createCategoryApi = (data) =>
  Api.post("/api/categories", data);

export const updateCategoryApi = (id, data) =>
  Api.put(`/api/categories/${id}`, data);

export const deleteCategoryApi = (id) =>
  Api.delete(`/api/categories/${id}`);

/* ================= SELF NOTES ================= */

// Create new self note
export const createSelfNoteApi = (data) =>
  Api.post("/api/selfnotes", data);

// Get all self notes (pagination + search)
export const getAllSelfNotesApi = (params) =>
  Api.get("/api/selfnotes", { params });

// Get recent self notes
export const getRecentSelfNotesApi = () =>
  Api.get("/api/selfnotes/recent");

// Get single self note
export const getSelfNoteByIdApi = (id) =>
  Api.get(`/api/selfnotes/${id}`);

// Update self note
export const updateSelfNoteApi = (id, data) =>
  Api.put(`/api/selfnotes/${id}`, data);

// Toggle pin
export const togglePinSelfNoteApi = (id) =>
  Api.patch(`/api/selfnotes/${id}/pin`);

// Delete self note
export const deleteSelfNoteApi = (id) =>
  Api.delete(`/api/selfnotes/${id}`);

// Count notes
export const getSelfNotesCountApi = () =>
  Api.get("/api/selfnotes/count");

/* ================= GOALS ================= */
export const createGoalApi = (data) =>
  Api.post("/api/goals", data);

export const getAllGoalsApi = (params) =>
  Api.get("/api/goals", { params });

export const getGoalsSummaryApi = () =>
  Api.get("/api/goals/summary");

export const getGoalByIdApi = (id) =>
  Api.get(`/api/goals/${id}`);

export const updateGoalApi = (id, data) =>
  Api.put(`/api/goals/${id}`, data);

export const deleteGoalApi = (id) =>
  Api.delete(`/api/goals/${id}`);

export const toggleGoalStatusApi = (id) =>
  Api.patch(`/api/goals/${id}/toggle`);

export const updateGoalProgressApi = (id, data) =>
  Api.patch(`/api/goals/${id}/progress`, data);

export const syncGoalProgressApi = (id) =>
  Api.post(`/api/goals/${id}/sync`);

/* ================= ANALYTICS ================= */
export const getAnalyticsByCategoryApi = (params) =>
  Api.get("/api/transactions/analytics/category", { params });

export const getMonthlyTrendsApi = (params) =>
  Api.get("/api/transactions/analytics/trends", { params });

export const getCalendarTransactionsApi = (year, month) =>
  Api.get("/api/transactions/calendar", { params: { year, month } });

/* ================= ADMIN ================= */
export const getAdminStatsApi = () =>
  Api.get("/api/admin/stats");

export const getCategoryStatsApi = () =>
  Api.get("/api/admin/category-stats");

export const getAllUsersAdminApi = (params) =>
  Api.get("/api/admin/users", { params });

export const deleteUserAdminApi = (id) =>
  Api.delete(`/api/admin/users/${id}`);

export const toggleUserRoleAdminApi = (id) =>
  Api.patch(`/api/admin/users/${id}/role`);

/* ================= FEEDBACK ================= */
export const createFeedbackApi = (data) =>
  Api.post("/api/feedback", data);

export const getAllFeedbacksApi = () =>
  Api.get("/api/feedback");

export const resolveFeedbackApi = (id) =>
  Api.patch(`/api/feedback/${id}/resolve`);

export const deleteFeedbackApi = (id) =>
  Api.delete(`/api/feedback/${id}`);

export default Api;
