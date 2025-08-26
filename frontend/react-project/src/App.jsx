import { useState, useEffect } from "react";
import "./App.css";

import AddAssetForm from "./components/AddAssetForm";
import AddTaskForm from "./components/AddTaskForm";
import RegisterForm from "./components/RegisterForm";
import TaskCard from "./components/TaskCard";

function App() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [unassignedMembers, setUnassignedMembers] = useState([]);

  const openRegisterModal = () => setShowRegisterModal(true);
  const closeRegisterModal = () => setShowRegisterModal(false);
  const openAssetModal = () => setShowAssetModal(true);
  const closeAssetModal = () => setShowAssetModal(false);
  const openTaskModal = () => setShowTaskModal(true);
  const closeTaskModal = () => setShowTaskModal(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tasks/");
        const data = await response.json();

        const sortedTasks = [...data].sort((a, b) => {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return dateA - dateB;
        });

        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/members/");
        const data = await response.json();
        setMembers(data);
        console.log("Fetched Members:", data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchTasks();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (tasks.length === 0 || members.length === 0) return;

    // Normalize assigned artist names
    const assignedNames = tasks
      .map((task) => {
        if (typeof task.artist === "string") {
          return task.artist.trim().toLowerCase();
        }
        if (task.artist && task.artist.name && task.artist.surname) {
          return `${task.artist.name} ${task.artist.surname}`.trim().toLowerCase();
        }
        return "";
      })
      .filter(Boolean);

    const unassigned = members.filter((member) => {
      const fullName = `${member.name} ${member.surname}`.trim().toLowerCase();
      return !assignedNames.includes(fullName);
    });

    setUnassignedMembers(unassigned);
    console.log("Unassigned Members:", unassigned);
  }, [tasks, members]);

  const memberNames = [...members]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((member) => `${member.name} ${member.surname}`);

  return (
    <div className="App">
      <h1>Hello Francesco 👋</h1>
      <button onClick={openRegisterModal}>Register</button>
      <button onClick={openAssetModal}>Add Asset</button>
      <button onClick={openTaskModal}>Add Task</button>

      <RegisterForm isOpen={showRegisterModal} onClose={closeRegisterModal} />
      <AddAssetForm isOpen={showAssetModal} onClose={closeAssetModal} />
      <AddTaskForm isOpen={showTaskModal} onClose={closeTaskModal} />

      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.name} task={task} members={memberNames} />
        ))}
      </div>

      <div className="unassigned-list">
        <h2>🎨 Artists Without Tasks</h2>
        <ul>
          {unassignedMembers.map((member) => (
            <li key={member.id}>
              {member.name} {member.surname}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;