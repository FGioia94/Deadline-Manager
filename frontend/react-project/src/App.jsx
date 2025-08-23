import { useState } from "react";
import "./App.css";

import AddAssetForm from './components/add-asset';

function App() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <div>
      <h1>Hello Francesco 👋</h1>
      <button onClick={openModal}>Open Modal</button>
      <AddAssetForm isOpen={showModal} onClose={closeModal}>
        <h2>This is your modal content!</h2>
      </AddAssetForm>
    </div>
  );
}

export default App;