import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Update this to match your backend's base URL

const Broadcast = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editMessage, setEditMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/broadcasts`);
      setMessages(response.data.broadcasts);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const validateMessage = (message) => {
    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount < 25) {
      alert("Message must contain at least 25 words.");
      return false;
    }
    if (wordCount > 150) {
      alert("Message cannot exceed 150 words.");
      return false;
    }
    return true;
  };

  //validation part
  const handleCreate = async () => {
    if (!newMessage.trim()) return alert("Message cannot be empty!");
    if (!validateMessage(newMessage)) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/broadcasts`, { message: newMessage });
      setMessages([response.data, ...messages]);
      setNewMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };


  //validation part

  const handleUpdate = async (id) => {
    if (!editMessage.text.trim()) return alert("Message cannot be empty!");
    if (!validateMessage(editMessage.text)) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/broadcasts/${id}`, { message: editMessage.text });
      setMessages(messages.map((msg) => (msg._id === id ? response.data.broadcast : msg)));
      setEditMessage(null);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/broadcasts/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        Send Broadcast Messages
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <textarea
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          rows="3"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleCreate}
        >
          Send Message
        </button>
      </div>
      <div>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {editMessage && editMessage.id === msg._id ? (
                <>
                  <textarea
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "16px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    rows="2"
                    value={editMessage.text}
                    onChange={(e) =>
                      setEditMessage({ ...editMessage, text: e.target.value })
                    }
                  />
                  <button
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => handleUpdate(msg._id)}
                  >
                    Save
                  </button>
                  <button
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => setEditMessage(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "16px", marginBottom: "10px" }}>{msg.message}</p>
                  <button
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#ffc107",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => setEditMessage({ id: msg._id, text: msg.message })}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#666" }}>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Broadcast;
