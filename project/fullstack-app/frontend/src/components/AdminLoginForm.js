import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function AdminLoginForm({ setUser }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
      const user = users.find(u => u.email === email && u.role === 'admin');
      if (!user) {
        setError('Admin not found');
        return;
      }
      setUser(user);
      history.push('/admin');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Admin Email"
          required
        />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLoginForm;
