import React, { useEffect, useState } from "react";
import "./App.css";
import { UserProvider, useUser } from "./contexts/userContext";
import { useTodoApi } from "./hooks/useTodo";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const { isLoggedIn, login, logout } = useUser(); // Add logout to the destructured values
  const { createTodo, getTodos, deleteTodo, updateTodo, getPrivateAuth } =
    useTodoApi();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    const todosRes = await getTodos();
    setTodos(todosRes.todos as unknown as Todo[]);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && isLoggedIn) {
      const result = await createTodo(text, false);
      setTodos([...todos, result.todos as Todo]);
      setText("");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleUpdateTodo = async (
    id: string,
    newText: string,
    completed: boolean
  ) => {
    await updateTodo(id, newText, completed);
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, completed } : todo
      )
    );
  };

  const testPrivateMethod = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await getPrivateAuth();
    console.log("response", response);
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      {isLoggedIn ? (
        <>
          <div className="user-controls">
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter todo text"
              className="todo-input"
            />
            <button type="submit" className="todo-button">
              Add Todo
            </button>
            <button
              type="button"
              className="todo-button"
              onClick={testPrivateMethod}
            >
              Test private
            </button>
          </form>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    handleUpdateTodo(todo.id, todo.text, !todo.completed)
                  }
                />
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) =>
                    handleUpdateTodo(todo.id, e.target.value, todo.completed)
                  }
                />
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>Please log in to manage your todos.</p>
          <button onClick={login} className="login-button">
            Log In
          </button>
        </>
      )}
    </div>
  );
};

const WrappedApp: React.FC = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default WrappedApp;
