import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function UserLoginForm({ setUser }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
      const user = users.find(u => u.email === email && u.role === 'voter');
      if (!user) {
        setError('Voter not found');
        return;
      }
      setUser(user);
      history.push('/vote');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Voter Email"
          required
        />
        <button type="submit">Login as Voter</button>
      </form>
    </div>
  );
}

export default UserLoginForm;
