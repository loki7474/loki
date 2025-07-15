import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

function VotingForm() {
  const [email, setEmail] = useState('');
  const [vote, setVote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    try {
      const response = await fetch('http://localhost:5000/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vote })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Error occurred');
        setMessage('');
      } else {
        setMessage(data.message);
        setError('');
      }
    } catch (err) {
      setError('Network error');
      setMessage('');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setMessage('Vote cancelled.');
  };

  return (
    <div>
      <h2>Vote</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {message && <div style={{color: 'green'}}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          required
        />
        <input
          value={vote}
          onChange={e => setVote(e.target.value)}
          placeholder="Your vote"
          required
        />
        <button type="submit">Submit Vote</button>
      </form>
      <ConfirmModal
        open={showConfirm}
        user={email}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default VotingForm;
