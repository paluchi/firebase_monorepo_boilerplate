// App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import { UserProvider, useUser } from "./contexts/userContext";
import { useTodoApi } from "./hooks/useTodo";
import { FaPlus, FaTrash, FaCheck, FaUndo } from "react-icons/fa";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const { isLoggedIn, login, logout } = useUser();
  const { createTodo, getTodos, deleteTodo, updateTodo, getPrivateAuth } = useTodoApi();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    const todosRes = await getTodos();
    setTodos(todosRes.todos as Todo[]);
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

  const handleUpdateTodo = async (id: string, newText: string, completed: boolean) => {
    await updateTodo(id, newText, completed);
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText, completed } : todo)));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        {isLoggedIn ? (
          <button className="btn btn-secondary" onClick={logout}>
            Log Out
          </button>
        ) : (
          <button className="btn btn-primary" onClick={login}>
            Log In
          </button>
        )}
      </header>

      {isLoggedIn ? (
        <main className="app-main">
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button type="submit" className="btn btn-primary">
              <FaPlus />
            </button>
          </form>

          <div className="todo-filters">
            <button
              className={`btn ${filter === "all" ? "btn-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn ${filter === "active" ? "btn-active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`btn ${filter === "completed" ? "btn-active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <button
                  className="btn btn-toggle"
                  onClick={() => handleUpdateTodo(todo.id, todo.text, !todo.completed)}
                >
                  {todo.completed ? <FaUndo /> : <FaCheck />}
                </button>
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => handleUpdateTodo(todo.id, e.target.value, todo.completed)}
                  className="todo-text"
                />
                <button className="btn btn-delete" onClick={() => handleDeleteTodo(todo.id)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </main>
      ) : (
        <div className="login-message">Please log in to manage your todos.</div>
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