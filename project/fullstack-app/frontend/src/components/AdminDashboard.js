import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('voter');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch users (for monitoring)
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setError('Could not fetch users'));
  }, [message]);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error occurred');
        setMessage('');
      } else {
        setMessage('User added');
        setError('');
        setEmail('');
        setRole('voter');
      }
    } catch {
      setError('Network error');
      setMessage('');
    }
  };

  // Delete user
  const handleDeleteUser = async (userEmail) => {
    if (!window.confirm(`Delete user ${userEmail}?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userEmail}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error occurred');
        setMessage('');
      } else {
        setMessage('User deleted');
        setError('');
      }
    } catch {
      setError('Network error');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {message && <div style={{color: 'green'}}>{message}</div>}
      <form onSubmit={handleAddUser}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="User email"
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      <h3>Admins</h3>
      <ul>
        {users.filter(user => user.role === 'admin').map(user => (
          <li key={user.email}>
            {user.email} (admin)
            <button onClick={() => handleDeleteUser(user.email)} style={{marginLeft:8}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
