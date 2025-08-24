// FormModal.jsx
import React from "react";
import { Form, Button } from "react-bootstrap";
import { getCookie } from "../assets/utilities/token";

class LoginForm extends Rect.Component{

    
}


class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.taskNameRef = React.createRef();
    this.state = { selectedDepartment: "" };
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDepartment = this.state.selectedDepartment;

    await fetch("http://localhost:8000/csrf/", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");
    console.log("CSRF Token:", csrfToken);

    fetch("http://localhost:8000/tasks/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        name: this.taskNameRef.current.value,

        department: selectedDepartment,
        artist: "",
        deadline: "",
        status: "",
        asset: "",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request Error");
        return res.json();
      })
      .then((data) => {
        console.log("Asset Created Successfully:", data);
        this.props.onClose();
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  render() {
    const { isOpen, onClose, children } = this.props;

    if (!isOpen) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          {children}
        </div>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Task Name"
              ref={this.taskNameRef}
            />
          </Form.Group>
          <Form.Group controlId="departmentSelect">
            <Form.Label>Department</Form.Label>
            <Form.Select
              value={this.state.selectedDepartment}
              onChange={(e) => this.setState({ selectedDepartment: e.target.value })}
            >
              <option value="">-- Choose Department --</option>
              <option value="modeling">Modeling</option>
              <option value="texturing">Texturing</option>
              <option value="rigging">Rigging</option>
              <option value="lookdev">Lookdev</option>
              <option value="grooming">Grooming</option>
              <option value="animation">Animation</option>
              <option value="fx">FX</option>
              <option value="cfx-muscle">CFX Muscle</option>
              <option value="cfx-hair">CFX Hair</option>
              <option value="lighting">Lighting</option>
              <option value="pipeline">Pipeline</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default AddTaskForm;
