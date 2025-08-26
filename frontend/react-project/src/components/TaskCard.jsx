import React, { useState, useRef } from "react";
import "../assets/css/TaskCard.css";
import { Form, Button } from "react-bootstrap";

const TaskCard = ({
  task,
  members,
  artistFilter = "all",
  assetFilter = "all",
}) => {
  if (
    (artistFilter !== "all" && artistFilter !== task.artist) ||
    (assetFilter !== "all" && assetFilter !== task.asset)
  ) {
    return <></>;
  }
  const deadline = new Date(task.deadline);
  const now = new Date();
  const timeDiff = deadline - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  let urgencyClass = "";
  if (daysDiff < 0) {
    urgencyClass = "overdue";
  } else if (daysDiff === 0) {
    urgencyClass = "today";
  } else if (daysDiff <= 7) {
    urgencyClass = "urgent";
  } else if (daysDiff <= 12) {
    urgencyClass = "soon";
  } else {
    urgencyClass = "normal";
  }

  const dateRef = useRef();
  const artistRef = useRef();
  const [date, setDate] = useState("");
  const [artist, setArtist] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const passwordRef = useRef();
  const [password, setPassword] = useState("");

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const patchTask = async (payload) => {
    await fetch("http://localhost:8000/csrf/", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");

    const res = await fetch("http://localhost:8000/tasks/", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Request Error");
    const data = await res.json();
    alert("Update successful! Reload to see changes.");
  };

  const handleDeadlineSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== "ADMIN2025Moonshot_") {
      alert("Incorrect password");
      return;
    }

    try {
      await patchTask({ name: task.name, deadline: dateRef.current.value });
    } catch (err) {
      console.error("Deadline update failed:", err);
    }
  };
  const deleteTask = async () => {
    if (passwordRef.current.value !== "ADMIN2025Moonshot_") {
      alert("Incorrect password");
      return;
    }
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo task?"
    );
    if (!confirmed) return;

    await fetch("http://localhost:8000/csrf/", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("csrftoken");
    const res = await fetch(`http://localhost:8000/tasks/?name=${task.name}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    if (!res.ok) {
      alert("Failed to delete task");
      return;
    }

    alert("Task deleted!.");
    window.location.reload();
  };
  const handleArtistSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== "ADMIN2025Moonshot_") {
      alert("Incorrect password");
      return;
    }

    try {
      await patchTask({ name: task.name, artist: artistRef.current.value });
    } catch (err) {
      console.error("Artist update failed:", err);
    }
  };

  return (
    <div className={`card task-card ${urgencyClass}`}>
      <div
        className="card-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <h2>{task.name.toUpperCase()}</h2>
        <h3>{task.asset}</h3>
        <h3>{task.department}</h3>
        <h3>{task.artist}</h3>
        <h3>{task.deadline}</h3>
        <h3>{task.status}</h3>
      </div>

      {isOpen && (
        <div className="card-body">
          {/* Deadline Form */}

          <Form onSubmit={handleDeadlineSubmit}>
            {/* Shared Password Field */}
            <Form.Group controlId="formPassword">
              <Form.Label>Enter Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Update Deadline</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                ref={dateRef}
                required
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="mt-2">
              Update Deadline
            </Button>
          </Form>

          {/* Artist Form */}
          <Form onSubmit={handleArtistSubmit} className="mt-4">
            <Form.Group controlId="formArtist">
              <Form.Label>Update Artist</Form.Label>
              <Form.Select
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                ref={artistRef}
                required
              >
                <option value="">Select an artist</option>
                {members.map((member, index) => {
                  return (
                    <option key={index} value={member}>
                      {member}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Button variant="info" type="submit" className="mt-2">
              Update Artist
            </Button>
          </Form>
          <Button variant="danger" className="mt-4" onClick={deleteTask}>
            🗑️ Task Completed
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
