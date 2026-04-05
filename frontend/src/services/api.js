import axios from "axios";

const API = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
const token = localStorage.getItem("token");
if (token) {
req.headers.Authorization = `Bearer ${token}`;
}
return req;
});

// ================= AUTH =================
export const loginUser = (data) => API.post("/user/login", data);
export const registerUser = (data) => API.post("/user/register", data);

// ================= USER =================
export const fetchUserProfile = () => API.get("/user/profile");
export const updateUserProfile = (data) => API.patch("/user/profile", data);

// ================= ORDERS =================
export const fetchUserOrders = () => API.get("/orders/user");

// ================= WISHLIST =================
export const fetchUserWishlist = () => API.get("/wishlist/user");
export const removeWishlistItem = (id) => API.delete(`/wishlist/${id}`);

// ================= ADDRESS =================
export const getAddresses = () => API.get("/address");
export const addAddress = (data) => API.post("/address", data);
export const updateAddress = (id, data) => API.patch(`/address/${id}`, data);
export const deleteAddress = (id) => API.delete(`/address/${id}`);

export default API;
