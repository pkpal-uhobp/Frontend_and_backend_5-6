import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json", accept: "application/json" },
});

export const api = {
    getUsers: async () => (await apiClient.get("/users")).data,
    createUser: async (user) => (await apiClient.post("/users", user)).data,
    updateUser: async (id, patch) => (await apiClient.patch(`/users/${id}`, patch)).data,
    deleteUser: async (id) => (await apiClient.delete(`/users/${id}`)),
};