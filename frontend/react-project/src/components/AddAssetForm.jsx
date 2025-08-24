import React from "react";
import { Form, Button } from "react-bootstrap";
import { getCookie } from "../assets/utilities/token";

class AddAssetForm extends React.Component {
  constructor(props) {
    super(props);
    this.assetNameRef = React.createRef();
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8000/csrf/", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");
    console.log("CSRF Token:", csrfToken);

    fetch("http://localhost:8000/assets/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ name: this.assetNameRef.current.value }),
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
            <Form.Label>Asset Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Asset Name"
              ref={this.assetNameRef}
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

export default AddAssetForm;
