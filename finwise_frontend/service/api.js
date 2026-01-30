import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Helper to get fresh token
const getConfig = () => ({
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

const getConfigMultipart = () => ({
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
});

// Register User and check Login   
export const createUserApi = (data) => Api.post("/api/auth/register", data);
export const loginUserApi = (data) => Api.post("/api/auth/login", data);
export const forgotPasswordApi = (data) => Api.post("/api/auth/forgot-password", data);
export const getAllUsersApi = () => Api.get("/api/auth/get_all_users", getConfig());

// User Profile
export const getUserProfileApi = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return Api.get(`/api/auth/getUserById/${user?.id}`, getConfig());
};

export const saveSecurityQuestionsApi = (data) => {
  return Api.post("/api/security/save", data);
};

// Get security questions by email
export const getSecurityQuestionsApi = (email) => {
  return Api.get(`/api/security/questions/${email}`);
};

// Verify security answers
export const verifySecurityAnswersApi = (data) => {
  return Api.post("/api/security/verify", data);
};

// Reset password
export const resetPasswordApi = (data) => {
  return Api.post("/api/security/reset-password", data);
};

// --- Transaction APIs ---
export const createTransactionApi = (data) => Api.post('/api/transactions', data, getConfig());
export const getRecentTransactionsApi = () => Api.get('/api/transactions/recent', getConfig());
export const getAllTransactionsApi = (params) => Api.get('/api/transactions', { ...getConfig(), params });
export const getTransactionStatsApi = () => Api.get('/api/transactions/stats', getConfig());
export const updateTransactionApi = (id, data) => Api.put(`/api/transactions/${id}`, data, getConfig());
export const deleteTransactionApi = (id) => Api.delete(`/api/transactions/${id}`, getConfig());
export const getTransactionsByDateRangeApi = (params) => Api.get('/api/transactions/date-range', { ...getConfig(), params });
export const getAnalyticsByCategoryApi = (params) => Api.get('/api/transactions/analytics/category', { ...getConfig(), params });
export const getMonthlyTrendsApi = (params) => Api.get('/api/transactions/analytics/trends', { ...getConfig(), params });
export const getTransactionsByMonthApi = (params) => Api.get('/api/transactions/calendar', { ...getConfig(), params });

// --- Category APIs ---
export const getAllCategoriesApi = () => Api.get('/api/categories', getConfig());
export const createCategoryApi = (data) => Api.post('/api/categories', data, getConfig());
export const deleteCategoryApi = (id) => Api.delete(`/api/categories/${id}`, getConfig());

// --- Goal APIs ---
export const getAllGoalsApi = () => Api.get('/api/goals', getConfig());
export const createGoalApi = (data) => Api.post('/api/goals', data, getConfig());
export const updateGoalApi = (id, data) => Api.put(`/api/goals/${id}`, data, getConfig());
export const deleteGoalApi = (id) => Api.delete(`/api/goals/${id}`, getConfig());

// --- Self Note APIs ---
export const getAllNotesApi = () => Api.get('/api/notes', getConfig());
export const createNoteApi = (data) => Api.post('/api/notes', data, getConfig());
export const updateNoteApi = (id, data) => Api.put(`/api/notes/${id}`, data, getConfig());
export const deleteNoteApi = (id) => Api.delete(`/api/notes/${id}`, getConfig());

// --- Feedback APIs ---
export const createFeedbackApi = (data) => Api.post('/api/feedback', data, getConfig());
export const getAllFeedbacksApi = () => Api.get('/api/feedback', getConfig());
export const resolveFeedbackApi = (id) => Api.patch(`/api/feedback/${id}/resolve`, {}, getConfig());
export const deleteFeedbackApi = (id) => Api.delete(`/api/feedback/${id}`, getConfig());

export default Api;