import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Create a new todo
export const createTodo = async (text: string, completed: boolean) => {
  try {
    const response = await axios.post(`${apiUrl}/todo`, { text, completed });
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

// Get all todos
export const getTodos = async () => {
  try {
    const response = await axios.get(`${apiUrl}/todo`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

// Delete a todo by ID
export const deleteTodo = async (id: string) => {
  try {
    await axios.delete(`${apiUrl}/todo/${id}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

// Update a todo by ID
export const updateTodo = async (
  id: string,
  text: string,
  completed: boolean
) => {
  try {
    const response = await axios.patch(`${apiUrl}/todo/${id}`, {
      text,
      completed,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};
