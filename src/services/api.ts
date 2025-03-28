
import { LoginDto, CreateUserDto, AuthResponse, User } from "../types/auth";
import { getCurrentUserId } from "../utils/auth";

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
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
    
    return response.json();
  },

  getCurrentUser: async (): Promise<User> => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      throw new Error("No authenticated user found");
    }
    
    return userApi.getUser(userId);
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    
    return response.json();
  },
};
