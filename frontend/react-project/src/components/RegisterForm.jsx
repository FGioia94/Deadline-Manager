// FormModal.jsx
import React from "react";
import { Form, Button } from "react-bootstrap";
import { getCookie } from "../assets/utilities/token";
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.surnameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8000/csrf/", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");
    console.log("CSRF Token:", csrfToken);

    try {
      const res = await fetch("http://localhost:8000/members/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          name: this.nameRef.current.value,
          surname: this.surnameRef.current.value,
          email: this.emailRef.current.value,
          password: this.passwordRef.current.value,
        }),
      });

      if (!res.ok) throw new Error("Request Error");

      const data = await res.json();
      this.props.onClose();
    } catch (err) {
      console.error("Error:", err);
    }
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
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" ref={this.nameRef} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Surname"
              ref={this.surnameRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              ref={this.emailRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={this.passwordRef}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default RegisterForm