import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, X, CheckCircle, Share2, Sparkles, Rocket, RefreshCw } from 'lucide-react';
import IdCardCanvas, { drawStudentBadgeOnCanvas } from './IdCardCanvas';

export default function IdCardModal({ isOpen, onClose, studentData, onUpdateTrack }) {
  const [copied, setCopied] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(studentData?.missionTrack || 'AI AGENTS');
  const canvasElementRef = useRef(null);

  if (!isOpen || !studentData) return null;

  const currentStudentData = {
    ...studentData,
    missionTrack: selectedTrack
  };

  const handleTrackChange = (e) => {
    const newTrack = e.target.value;
    setSelectedTrack(newTrack);
    if (onUpdateTrack) {
      onUpdateTrack(newTrack);
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    drawStudentBadgeOnCanvas(canvas, currentStudentData);
    
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const safeName = (currentStudentData.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `AI_Sprint_2026_ID_Card_${safeName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const canvas = document.createElement('canvas');
    drawStudentBadgeOnCanvas(canvas, currentStudentData);
    const dataUrl = canvas.toDataURL('image/png', 1.0);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Pass - ${currentStudentData.name}</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #fff;
              font-family: Arial, sans-serif;
            }
            img {
              max-width: 460px;
              height: auto;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              border-radius: 12px;
            }
            @media print {
              body { background: transparent; }
              img { max-width: 100%; width: 400px; }
            }
          </style>
        </head>
        <body>
          <div>
            <img src="${dataUrl}" alt="Student ID Card" />
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = () => {
    const text = `I just confirmed my seat for AI Sprint 2.0: Full-Stack AI Product Building Workshop by Medsquire Technologies! My Seat is #${currentStudentData.seatNumber}. Join me in Eluru on Oct 02, 2026!`;
    if (navigator.share) {
      navigator.share({
        title: 'AI Sprint 2.0 Workshop Pass',
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          background: 'rgba(2, 2, 5, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '540px',
            background: 'linear-gradient(180deg, #0A1124 0%, #030612 100%)',
            border: '1px solid rgba(0, 199, 181, 0.4)',
            borderRadius: '24px',
            padding: '2rem 1.5rem',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 199, 181, 0.2)',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} />
          </button>

          {/* Success Badge Banner */}
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 199, 181, 0.12)',
                border: '1px solid rgba(0, 199, 181, 0.4)',
                padding: '6px 16px',
                borderRadius: '30px',
                color: '#00C7B5',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '0.8rem'
              }}
            >
              <Sparkles size={16} /> SEAT CONFIRMED #{currentStudentData.seatNumber}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 900, margin: '0 0 0.4rem 0', color: '#FFF' }}>
              OFFICIAL WORKSHOP DELEGATE PASS
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Show this ID card at the venue entrance on <strong>02 OCT 2026</strong> in Eluru for workshop entry verification.
            </p>
          </div>

          {/* Track Selector Bar inside Modal */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Rocket size={16} /> MISSION TRACK:
            </span>
            <select
              value={selectedTrack}
              onChange={handleTrackChange}
              style={{
                background: '#040711',
                color: '#00C7B5',
                border: '1px solid rgba(0, 199, 181, 0.4)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="AI AGENTS">🤖 AI AGENTS</option>
              <option value="AI VISION">👁️ AI VISION</option>
              <option value="AI WEB">🌐 AI WEB</option>
              <option value="AI HEALTHCARE">🏥 AI HEALTHCARE</option>
              <option value="AI EDUCATION">📚 AI EDUCATION</option>
              <option value="AI AUTOMATION">⚙️ AI AUTOMATION</option>
              <option value="DATA + AI">📊 DATA + AI</option>
              <option value="YOUR OWN IDEA">🚀 YOUR OWN IDEA</option>
            </select>
          </div>

          {/* Canvas ID Card Display */}
          <div style={{ marginBottom: '1.5rem' }}>
            <IdCardCanvas 
              studentData={currentStudentData} 
              onCanvasReady={(c) => { canvasElementRef.current = c; }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              onClick={handleDownload}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '1.05rem',
                gap: '10px'
              }}
            >
              <Download size={20} /> DOWNLOAD ID CARD (PNG)
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '0.95rem'
                }}
              >
                <Printer size={18} /> PRINT PASS
              </button>

              <button
                onClick={handleShare}
                className="btn-secondary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '0.95rem'
                }}
              >
                <Share2 size={18} /> {copied ? 'COPIED!' : 'SHARE PASS'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
