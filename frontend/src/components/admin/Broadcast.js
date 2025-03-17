import React, { useState, useEffect } from 'react';

const Broadcast = () => {
  const apiUrl = 'http://localhost:5000/api/broadcasts'; // Update with your backend URL
  const [message, setMessage] = useState('');
  const [broadcasts, setBroadcasts] = useState([]);
  const [updateId, setUpdateId] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  // Fetch all broadcasts on component mount
  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Fetch all broadcasts from the backend
  const fetchBroadcasts = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setBroadcasts(data.broadcasts); // Assuming data contains an array of broadcasts
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  // Handle creating a new broadcast
  const createBroadcast = async (e) => {
    e.preventDefault();

    if (!message) {
      return alert('Message is required!');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(''); // Clear the input field
        fetchBroadcasts(); // Reload the broadcasts list
        alert('Broadcast created successfully');
      } else {
        alert(result.message || 'Error creating broadcast');
      }
    } catch (error) {
      console.error('Error creating broadcast:', error);
    }
  };

  // Handle updating a broadcast
  const updateBroadcast = async (e) => {
    e.preventDefault();

    if (!updateId || !updateMessage) {
      return alert('ID and message are required!');
    }

    try {
      const response = await fetch(`${apiUrl}/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: updateMessage }),
      });

      const result = await response.json();

      if (response.ok) {
        setUpdateId('');
        setUpdateMessage('');
        fetchBroadcasts(); // Reload the broadcasts list
        alert('Broadcast updated successfully');
      } else {
        alert(result.message || 'Error updating broadcast');
      }
    } catch (error) {
      console.error('Error updating broadcast:', error);
    }
  };

  // Handle deleting a broadcast
  const deleteBroadcast = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        fetchBroadcasts(); // Reload the broadcasts list
        alert('Broadcast deleted successfully');
      } else {
        alert(result.message || 'Error deleting broadcast');
      }
    } catch (error) {
      console.error('Error deleting broadcast:', error);
    }
  };

  return (
    <div className="broadcast-container">
      <h1>Broadcast Management</h1>

      {/* Create Broadcast */}
      <div className="form-container">
        <form onSubmit={createBroadcast}>
          <textarea
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Create Broadcast</button>
        </form>
      </div>

      {/* Update Broadcast */}
      <div className="form-container">
        <form onSubmit={updateBroadcast}>
          <input
            type="text"
            placeholder="Enter Broadcast ID"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
            required
          />
          <textarea
            placeholder="Enter new message"
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            required
          />
          <button type="submit">Update Broadcast</button>
        </form>
      </div>

      {/* Display All Broadcasts */}
      <div className="broadcasts-list">
        <h2>All Broadcasts</h2>
        <ul>
          {broadcasts.map((broadcast) => (
            <li key={broadcast._id}>
              <p>{broadcast.message}</p>
              <button onClick={() => deleteBroadcast(broadcast._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Broadcast;
