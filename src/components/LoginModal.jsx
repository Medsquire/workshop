import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Phone, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginStudentApi } from '../utils/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    // Only accept numeric digits up to 10 chars
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your password.');
      return;
    }

    // Try MongoDB backend login first
    loginStudentApi(cleanPhone, cleanPass).then((mongoStudent) => {
      if (mongoStudent) {
        onLoginSuccess(mongoStudent);
        onClose();
        return;
      }

      // LocalStorage fallback
      try {
        const stored = localStorage.getItem('ai_sprint_registrations');
        const list = stored ? JSON.parse(stored) : [];

        const student = list.find(
          (s) =>
            s.phone &&
            s.phone.replace(/[^0-9]/g, '') === cleanPhone &&
            s.password === cleanPass
        );

        if (student) {
          onLoginSuccess(student);
          onClose();
        } else {
          setError('Invalid 10-digit Phone Number or Password. Please verify your credentials or register for free.');
        }
      } catch (err) {
        setError('An error occurred during login. Please try again.');
      }
    });
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
        background: 'rgba(2, 2, 5, 0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #0A1124 0%, #040814 100%)',
          border: '1px solid rgba(10, 132, 255, 0.4)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '50px', height: '50px', margin: '0 auto 1rem auto', borderRadius: '50%', background: 'rgba(10, 132, 255, 0.15)', border: '1px solid var(--neon-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}>
            <LogIn size={24} />
          </div>
          <h3 style={{ fontSize: '1.7rem', fontFamily: 'Outfit', fontWeight: 900, margin: '0 0 0.4rem 0', color: '#FFF' }}>
            STUDENT LOGIN
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Log in to view your workshop seat & download your ID Card.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>PHONE NUMBER (10 DIGITS)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="e.g. 9014312221"
                maxLength={10}
                required
                style={{ paddingRight: '45px' }}
              />
              <Phone
                size={18}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>
            {phone && phone.length < 10 && (
              <div style={{ fontSize: '0.75rem', color: '#FF9500', marginTop: '4px' }}>
                {10 - phone.length} more digits required
              </div>
            )}
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your registration password"
                required
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.4)', padding: '10px 14px', borderRadius: '8px', color: '#FF453A', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '14px' }}>
            LOGIN & VIEW MY PASS →
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Haven't registered yet? <a href="#register" onClick={onClose} style={{ color: 'var(--neon-cyan)', fontWeight: 700, textDecoration: 'none' }}>Register for Free</a>
        </div>
      </motion.div>
    </div>
  );
}
