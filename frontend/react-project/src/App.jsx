import { useState } from "react";
import "./App.css";

import AddAssetForm from './components/AddAssetForm';
import AddTaskForm from './components/AddTaskForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const openRegisterModal = () => setShowRegisterModal(true);
  const closeRegisterModal = () => setShowRegisterModal(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const openAssetModal = () => setShowAssetModal(true);
  const closeAssetModal = () => setShowAssetModal(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const openTaskModal = () => setShowTaskModal(true);
  const closeTaskModal = () => setShowTaskModal(false);
  return (
    <div>
      <h1>Hello Francesco 👋</h1>
      <button onClick={openRegisterModal}>Register</button>
      <button onClick={openAssetModal}>Add Asset</button>
      <button onClick={openTaskModal}>Add Task</button>
      <RegisterForm isOpen={showRegisterModal} onClose={closeRegisterModal}>
      </RegisterForm>
      <AddAssetForm isOpen={showAssetModal} onClose={closeAssetModal}>
      </AddAssetForm>
      <AddTaskForm isOpen={showTaskModal} onClose={closeTaskModal}>
      </AddTaskForm>
    </div>
  );
}

export default App;