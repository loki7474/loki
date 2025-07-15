import React from 'react';

function ConfirmModal({ open, user, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
        <h3>Are you sure you want to vote as "{user}"?</h3>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 4 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
