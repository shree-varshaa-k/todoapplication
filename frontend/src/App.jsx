import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState({ title: "", desc: "" });
  const [editID, setEditID] = useState(null);

  const getTodo = async () => {
    try {
      const response = await axios.get("/api/todo/");
      console.log("Fetched todos:", response.data); // Debugging log
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addHandler = async () => {
    if (input.title.trim() && input.desc.trim() !== "") {
      const newTodo = {
        title: input.title,
        desc: input.desc,
      };

      try {
        const response = await axios.post("/api/todo", newTodo);
        console.log("Added todo:", response.data); // Debugging log
        setTodos([...todos, response.data]);
        setInput({ title: "", desc: "" });
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    } else {
      alert("Enter the Value");
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editHandler = (task) => {
    setEditID(task._id);
    setInput({ title: task.title, desc: task.desc });
  };

  const saveHandler = async () => {
    try {
      const response = await axios.patch(`/api/todo/${editID}`, {
        title: input.title,
        desc: input.desc,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === editID
            ? { ...todo, title: response.data.title, desc: response.data.desc }
            : todo
        )
      );
      setEditID(null);
      setInput({ title: "", desc: "" });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={input.desc}
          onChange={(e) => setInput({ ...input, desc: e.target.value })}
        />
        {editID ? (
          <button onClick={saveHandler}>Save</button>
        ) : (
          <button onClick={addHandler}>Add</button>
        )}
      </div>

      <ul>
        {todos.map((task) => (
          <li key={task._id}>
            <div>
              <p>{task.title}</p>
              <p>{task.desc}</p>
            </div>
            <div>
              <button onClick={() => editHandler(task)}>Edit</button>
              <button onClick={() => deleteHandler(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
