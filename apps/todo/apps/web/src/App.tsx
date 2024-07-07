import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./utils/firebase";
import "./App.css";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./utils/api";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchTodos();
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

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

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      {isLoggedIn ? (
        <>
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
          <button onClick={handleLogin} className="login-button">
            Log In
          </button>
        </>
      )}
    </div>
  );
};

export default App;
