
import { LoginDto, CreateUserDto, AuthResponse, User, UpdateUserDto } from "../types/auth";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  signup: async (data: CreateUserDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export const userApi = {
  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${API_URL}/user/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  },
  
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  updateUser: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  deleteUser: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  },
};
