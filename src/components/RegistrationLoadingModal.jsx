import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegistrationLoadingModal({ isOpen, studentData, onComplete }) {
  const [progress, setProgress] = useState(10);
  const [statusText, setStatusText] = useState('Connecting to Workshop Registration Server...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(10);
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(40);
      setStatusText('Verifying Workshop Slot Availability (30 Max Seats)...');
    }, 800);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusText(`Allocating Workshop Seat #${studentData?.seatNumber || '12'} & Generating Official ID Card...`);
    }, 1800);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('SEAT CONFIRMED! 🚀');
    }, 2800);

    const t4 = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, studentData]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1100,
        background: 'rgba(2, 2, 5, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, #091224 0%, #030612 100%)',
          border: '1px solid rgba(0, 199, 181, 0.5)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 199, 181, 0.25)'
        }}
      >
        {/* Animated Cyber Spinner */}
        <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 2rem auto' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '4px solid rgba(0, 199, 181, 0.15)',
              borderTopColor: '#00C7B5',
              borderRightColor: '#0A84FF'
            }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#FFD600' }}>
            <Sparkles size={32} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 900, marginBottom: '0.8rem', color: '#FFF' }}>
          CONFIRMING WORKSHOP SEAT...
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', minHeight: '44px', marginBottom: '2rem' }}>
          {statusText}
        </p>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0A84FF, #00C7B5, #FFD600)',
              borderRadius: '10px'
            }}
          />
        </div>

        <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: '#00C7B5', fontWeight: 700, letterSpacing: '1px' }}>
          PLEASE WAIT • DO NOT CLOSE THIS PAGE
        </div>
      </motion.div>
    </div>
  );
}
