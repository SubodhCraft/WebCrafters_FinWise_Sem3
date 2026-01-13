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

const config = {
  headers: {
    "authorization": `Bearer ${localStorage.getItem("token")}`,
  },
};
//Register User and check Login   
export const createUserApi = (data) => Api.post("/api/auth/register", data);
export const loginUserApi = (data) => Api.post("/api/auth/login", data);
export const forgotPasswordApi = (data) => Api.post("/api/auth/forgot-password", data);
export const getAllUsersApi = () => Api.get("/api/auth/get_all_users", config());

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

export default Api;