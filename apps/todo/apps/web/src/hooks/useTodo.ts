import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/userContext"; // Assuming UserContext is exported from UserContext.tsx

const apiUrl = process.env.REACT_APP_API_URL;

export const useTodoApi = () => {
  const { token } = useContext(UserContext);

  const axiosInstance = axios.create({
    baseURL: apiUrl,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const createTodo = async (text: string, completed: boolean) => {
    try {
      const response = await axiosInstance.post(`/todo`, { text, completed });
      return response.data;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  };

  const getTodos = async () => {
    try {
      const response = await axiosInstance.get(`/todo`);
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axiosInstance.delete(`/todo/${id}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  };

  const updateTodo = async (id: string, text: string, completed: boolean) => {
    try {
      const response = await axiosInstance.patch(`/todo/${id}`, {
        text,
        completed,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  };

  const getPrivateAuth = async () => {
    try {
      const response = await axiosInstance.get(`/private/auth`);
      return response;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  };

  return {
    createTodo,
    getTodos,
    deleteTodo,
    updateTodo,
    getPrivateAuth,
  };
};
