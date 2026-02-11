import axios from "axios";

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Function to login
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // axios.post is generic, specify type directly
    const response = await axios.post<LoginResponse>("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error", error);
    throw new Error("Login failed");
  }
};