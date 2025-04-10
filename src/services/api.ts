
import { LoginDto, CreateUserDto, AuthResponse, User } from "../types/auth";
import { Post, CreatePostDto, PostResponse, DeletePostResponse } from "../types/post";
import { getCurrentUserId } from "../utils/auth";

const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

// General validation error reporting API for client-side errors
export const validationApi = {
  reportClientError: async (errorInfo?: Record<string, any>): Promise<void> => {
    await fetch(`${API_URL}/validation/client-error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorInfo || {}),
    });
    // Always returns 400 Bad Request, no need to process response
  },
};

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
  
  // V2.1.5, V2.1.6: Change password functionality
  changePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
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

export const postApi = {
  createPost: async (data: CreatePostDto): Promise<PostResponse> => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    
    return response.json();
  },

  getAllPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    
    return response.json();
  },

  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }
    
    return response.json();
  },

  getCurrentUserPosts: async (): Promise<Post[]> => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      throw new Error("No authenticated user found");
    }
    
    return postApi.getUserPosts(userId);
  },

  deletePost: async (id: number): Promise<DeletePostResponse> => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete post ${id}`);
    }
    
    return response.json();
  },
};
