import React, { useState, useRef } from "react";
import "../assets/css/TaskCard.css";
import { Form, Button } from "react-bootstrap";

const TaskCard = ({
  task,
  members,
  idData,
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
  const passwordRef = useRef();

  const [date, setDate] = useState("");
  const [artist, setArtist] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [affectScore, setAffectScore] = useState(false);

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

  const updateScore = async (id, scoreChange) => {
    const csrfToken = getCookie("csrftoken");

    await fetch(`http://localhost:8000/members/${id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ score: scoreChange }),
    });
  };

  const handleDeadlineSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== "") {
      alert("Incorrect password");
      return;
    }

    try {
      await patchTask({ name: task.name, deadline: dateRef.current.value });
    } catch (err) {
      console.error("Deadline update failed:", err);
    }
  };

  const handleArtistSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== "") {
      alert("Incorrect password");
      return;
    }

    try {
      await patchTask({ name: task.name, artist: artistRef.current.value });
    } catch (err) {
      console.error("Artist update failed:", err);
    }
  };

  const deleteTask = async () => {
    if (passwordRef.current.value !== "") {
      alert("Incorrect password");
      return;
    }

    const confirmed = window.confirm("Are you sure?");
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

    if (affectScore) {
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const deadlineStr = deadlineDate.toISOString().split("T")[0];

      let scoreChange = 0;
      if (todayStr < deadlineStr) {
        scoreChange = 1;
      } else if (todayStr > deadlineStr) {
        scoreChange = -1;
      } else {
        scoreChange = 0.5;
      }
      console.log(task);
      const id = idData[task.artist];
      console.log(task.artist);
      console.log(id);
      await updateScore(id, scoreChange);
    }

    alert("Task deleted!");
    window.location.reload();
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
          <Form onSubmit={handleDeadlineSubmit}>
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
                {members.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="info" type="submit" className="mt-2">
              Update Artist
            </Button>
          </Form>

          <Form.Group controlId="formAffectScore" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Affect Score"
              checked={affectScore}
              onChange={(e) => setAffectScore(e.target.checked)}
            />
          </Form.Group>

          <Button variant="danger" className="mt-4" onClick={deleteTask}>
            🗑️ Task Completed
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
