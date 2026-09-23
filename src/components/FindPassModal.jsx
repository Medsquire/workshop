import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, CreditCard, AlertCircle } from 'lucide-react';

export default function FindPassModal({ isOpen, onClose, onSelectStudent }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return;

    try {
      const stored = localStorage.getItem('ai_sprint_registrations');
      const list = stored ? JSON.parse(stored) : [];

      const found = list.find(
        (s) =>
          (s.email && s.email.toLowerCase() === cleanQ) ||
          (s.phone && s.phone.replace(/[^0-9]/g, '') === cleanQ.replace(/[^0-9]/g, '')) ||
          (s.id && s.id.toLowerCase() === cleanQ)
      );

      if (found) {
        onSelectStudent(found);
        onClose();
      } else {
        setError('No registration found with this Phone, Email or ID. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1050,
        background: 'rgba(2, 2, 5, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: '#090F1E',
          border: '1px solid var(--panel-border)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', borderRadius: '50%', background: 'rgba(10, 132, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}>
            <CreditCard size={26} />
          </div>
          <h3 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 0.5rem 0' }}>FIND MY STUDENT ID CARD</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your Phone Number or Email Address used during registration.</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Registered Phone Number or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 9014312221 or name@gmail.com"
                required
                style={{ paddingRight: '45px' }}
              />
              <Search
                size={20}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.4)', padding: '10px 14px', borderRadius: '8px', color: '#FF453A', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            SEARCH PASS →
          </button>
        </form>
      </motion.div>
    </div>
  );
}
