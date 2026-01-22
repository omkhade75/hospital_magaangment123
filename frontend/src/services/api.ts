import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
    getToken: () => localStorage.getItem("auth_token"),
    setToken: (token: string) => localStorage.setItem("auth_token", token),
    clearToken: () => localStorage.removeItem("auth_token"),

    get: async (endpoint: string) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Network response was not ok");
            }
            return await response.json();
        } catch (error: any) {
            console.error("API Get Error:", error);
            toast.error(error.message || "Failed to fetch data");
            throw error;
        }
    },

    post: async (endpoint: string, data: any) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Network response was not ok");
            }
            return await response.json();
        } catch (error: any) {
            console.error("API Post Error:", error);
            toast.error(error.message || "Failed to send data");
            throw error;
        }
    }
};
