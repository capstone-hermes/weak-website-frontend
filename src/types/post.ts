export interface Post {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userEmail: string;
}

export interface CreatePostDto {
  content: string;
}

export interface PostResponse {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userEmail: string;
}

export interface DeletePostResponse {
  message: string;
}