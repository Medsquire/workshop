import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, Lock, User, Search, RefreshCw, Download, 
  Printer, LogOut, Trash2, Eye, Award, CheckCircle2, 
  Building, Phone, Mail, Users, Filter, Calendar, ExternalLink,
  Copy, Check, Send, MapPin, Clock, Laptop, Edit, Edit3, Save,
  UserCheck, UserX, CheckSquare, Square
} from 'lucide-react';
import { 
  adminLoginApi, 
  fetchAdminStudentsApi, 
  deleteAdminStudentApi,
  updateAdminStudentApi,
  toggleAdminStudentAttendanceApi 
} from '../utils/api';

const WhatsAppIcon = ({ size = 16, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export function getWhatsAppInvitationText(studentName = '', seatNumber = '') {
  const greeting = studentName ? `Good morning ${studentName},` : `Good morning,`;
  const seatInfo = seatNumber ? ` (Seat #${seatNumber})` : '';

  return `${greeting}

Today's Full-Stack AI Product Building Workshop (AI Sprint 2026) starts at 10:00 AM.${seatInfo}

Please be on time at the location.

Timing: 10:00 AM to 04:00 PM
Requirement: Bring your laptop

Venue Location: Medsquire Technologies Pvt Ltd, One Town, Kathepu St, Paidichintapadu, Eluru, Andhra Pradesh - 534001
Google Map Link: https://maps.app.goo.gl/qwfNdAiyeYb1mnVd9

Contact Us / WhatsApp: 90143 12221

Regards,
Medsquire Technologies`;
}

export function sendWhatsAppInvitation(phone, studentName = '', seatNumber = '') {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (!cleanPhone) {
    alert('No valid phone number found for this student.');
    return;
  }
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = getWhatsAppInvitationText(studentName, seatNumber);
  const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export default function AdminModal({ isOpen, onClose, onSelectStudentPass }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('vinnu');
  const [password, setPassword] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Student Data state
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedJoiningType, setSelectedJoiningType] = useState('ALL');
  const [selectedAttendanceFilter, setSelectedAttendanceFilter] = useState('ALL');
  const [activeStudentDetail, setActiveStudentDetail] = useState(null);

  // Edit Student state
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // WhatsApp Broadcast Modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadStudents();
    }
  }, [isOpen, isLoggedIn]);

  const loadStudents = async () => {
    setFetchingStudents(true);
    try {
      const data = await fetchAdminStudentsApi();
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setFetchingStudents(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLoginApi(username, password);
      if (res.success) {
        setIsLoggedIn(true);
        setAdminInfo(res.admin || { username: 'vinnu', _id: '6abdfe7d94bfc43e3807205e' });
        loadStudents();
      } else {
        setError(res.message || 'Invalid Username or Password.');
      }
    } catch (err) {
      setError('An error occurred during admin login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminInfo(null);
    setPassword('');
  };

  // Toggle Attendance handler
  const handleToggleAttendance = async (studentId, currentAttended) => {
    const targetId = studentId;
    const newAttendedState = !currentAttended;

    // Optimistically update local UI state
    setStudents(prev => prev.map(s => {
      if (s.id === targetId || s._id === targetId) {
        return { ...s, attended: newAttendedState };
      }
      return s;
    }));

    if (activeStudentDetail && (activeStudentDetail.id === targetId || activeStudentDetail._id === targetId)) {
      setActiveStudentDetail(prev => prev ? { ...prev, attended: newAttendedState } : null);
    }

    try {
      await toggleAdminStudentAttendanceApi(targetId, newAttendedState);
    } catch (err) {
      console.error('Failed to update attendance on server:', err);
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId, name) => {
    if (window.confirm(`Are you sure you want to delete registration for ${name} (${studentId})?`)) {
      const success = await deleteAdminStudentApi(studentId);
      if (success) {
        setStudents(prev => prev.filter(s => s.id !== studentId && s._id !== studentId));
        if (activeStudentDetail && (activeStudentDetail.id === studentId || activeStudentDetail._id === studentId)) {
          setActiveStudentDetail(null);
        }
      } else {
        alert('Failed to delete student from database.');
      }
    }
  };

  // Save Edit Student details
  const handleSaveEditStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsSavingEdit(true);
    const targetId = editingStudent.id || editingStudent._id;

    try {
      const res = await updateAdminStudentApi(targetId, editingStudent);
      if (res.success && res.data) {
        const updatedRecord = res.data;
        setStudents(prev => prev.map(s => (s.id === targetId || s._id === targetId) ? updatedRecord : s));
        if (activeStudentDetail && (activeStudentDetail.id === targetId || activeStudentDetail._id === targetId)) {
          setActiveStudentDetail(updatedRecord);
        }
        setEditingStudent(null);
      } else {
        alert(res.message || 'Failed to update student details.');
      }
    } catch (err) {
      alert('An error occurred while saving student changes.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const exportToCSV = () => {
    if (!students || students.length === 0) {
      alert('No student records available to export.');
      return;
    }

    const headers = [
      'Seat Number', 'Attendance', 'Student ID', 'Name', 'Email', 'Phone', 
      'College', 'Year of Study', 'Branch', 'Joining Type', 
      'Team Name', 'Mission Track', 'Registration Date'
    ];

    const csvRows = [headers.join(',')];

    students.forEach(s => {
      const row = [
        s.seatNumber || '',
        s.attended ? 'Attended' : 'Absent',
        `"${s.id || ''}"`,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${s.phone || ''}"`,
        `"${(s.college || '').replace(/"/g, '""')}"`,
        `"${(s.yearOfStudy || '').replace(/"/g, '""')}"`,
        `"${(s.branch || '').replace(/"/g, '""')}"`,
        `"${(s.joiningType || '').replace(/"/g, '""')}"`,
        `"${(s.teamName || '').replace(/"/g, '""')}"`,
        `"${(s.missionTrack || '').replace(/"/g, '""')}"`,
        `"${s.registeredAt ? new Date(s.registeredAt).toLocaleString() : ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Workshop_Registered_Students_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyBroadcastText = () => {
    const text = getWhatsAppInvitationText();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Filter students based on search query, track, joining type, and attendance
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.college && s.college.toLowerCase().includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q)) ||
      (s.teamName && s.teamName.toLowerCase().includes(q))
    );

    const matchesTrack = selectedTrack === 'ALL' || (s.missionTrack || '').toUpperCase().includes(selectedTrack.toUpperCase());
    const matchesJoining = selectedJoiningType === 'ALL' || (s.joiningType || '').toLowerCase() === selectedJoiningType.toLowerCase();
    
    let matchesAttendance = true;
    if (selectedAttendanceFilter === 'ATTENDED') matchesAttendance = Boolean(s.attended);
    if (selectedAttendanceFilter === 'ABSENT') matchesAttendance = !Boolean(s.attended);

    return matchesSearch && matchesTrack && matchesJoining && matchesAttendance;
  });

  const totalStudents = students.length;
  const attendedCount = students.filter(s => Boolean(s.attended)).length;
  const soloCount = students.filter(s => s.joiningType === 'solo').length;
  const teamCount = students.filter(s => s.joiningType === 'team').length;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1100,
        background: 'rgba(2, 2, 7, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isLoggedIn ? '1200px' : '440px',
          maxHeight: '94vh',
          background: 'linear-gradient(180deg, #091122 0%, #030712 100%)',
          border: '1px solid rgba(10, 132, 255, 0.4)',
          borderRadius: '24px',
          padding: isLoggedIn ? '2rem' : '2.5rem 2rem',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
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
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {!isLoggedIn ? (
          /* ========================================================= */
          /* 1. ADMIN LOGIN VIEW                                       */
          /* ========================================================= */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1.2rem auto',
                borderRadius: '50%',
                background: 'rgba(255, 214, 0, 0.15)',
                border: '1px solid #FFD600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD600'
              }}>
                <Shield size={30} />
              </div>

              <span style={{
                background: 'rgba(10, 132, 255, 0.15)',
                border: '1px solid rgba(10, 132, 255, 0.4)',
                color: '#0A84FF',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '0.8rem'
              }}>
                WORKSHOP DATABASE PORTAL
              </span>

              <h3 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 900, margin: '0 0 0.4rem 0', color: '#FFF' }}>
                ADMIN LOGIN
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Log in to view and manage all registered student records in <strong style={{ color: '#0A84FF' }}>workshop</strong> database.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>ADMIN USERNAME</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username (e.g. vinnu)"
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <User
                    size={18}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password (leave empty if blank)"
                    style={{ paddingRight: '45px' }}
                  />
                  <Lock
                    size={18}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255, 59, 48, 0.15)',
                  border: '1px solid rgba(255, 59, 48, 0.4)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  color: '#FF453A',
                  fontSize: '0.85rem',
                  marginBottom: '1.2rem'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '14px' }}
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN DASHBOARD →'}
              </button>
            </form>

            <div style={{
              marginTop: '1.8rem',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <div><strong>Target Admin Document:</strong></div>
              <div style={{ fontFamily: 'monospace', color: 'var(--neon-cyan)', marginTop: '4px' }}>
                _id: ObjectId('6abdfe7d94bfc43e3807205e')
              </div>
              <div style={{ fontFamily: 'monospace', color: '#FFF' }}>
                username: "vinnu"
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 2. ADMIN DASHBOARD VIEW (REGISTERED STUDENTS)             */
          /* ========================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header / Admin Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '1.2rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={22} color="#FFD600" />
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 900, margin: 0, color: '#FFF' }}>
                    ADMIN DASHBOARD
                  </h2>
                  <span style={{ background: 'rgba(255, 214, 0, 0.2)', border: '1px solid #FFD600', color: '#FFD600', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    vinnu
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Database: <strong style={{ color: 'var(--neon-cyan)' }}>workshop</strong></span> • 
                  <span>Collection: <strong style={{ color: '#0A84FF' }}>users</strong></span> •
                  <span style={{ color: '#30D158' }}>● Live MongoDB Connected</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  style={{
                    background: 'rgba(37, 211, 102, 0.18)',
                    border: '1px solid rgba(37, 211, 102, 0.5)',
                    color: '#25D366',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <WhatsAppIcon size={16} /> WhatsApp Invitations
                </button>

                <button
                  onClick={loadStudents}
                  disabled={fetchingStudents}
                  style={{
                    background: 'rgba(10, 132, 255, 0.15)',
                    border: '1px solid rgba(10, 132, 255, 0.4)',
                    color: '#0A84FF',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} className={fetchingStudents ? 'spin' : ''} />
                  {fetchingStudents ? 'Refreshing...' : 'Refresh'}
                </button>

                <button
                  onClick={exportToCSV}
                  style={{
                    background: 'rgba(48, 209, 88, 0.15)',
                    border: '1px solid rgba(48, 209, 88, 0.4)',
                    color: '#30D158',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255, 69, 58, 0.15)',
                    border: '1px solid rgba(255, 69, 58, 0.4)',
                    color: '#FF453A',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{
                background: 'rgba(10, 132, 255, 0.08)',
                border: '1px solid rgba(10, 132, 255, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(10, 132, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>REGISTERED STUDENTS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit', color: '#FFF' }}>{totalStudents}</div>
                </div>
              </div>

              {/* Attendance Metric Card */}
              <div style={{
                background: 'rgba(48, 209, 88, 0.08)',
                border: '1px solid rgba(48, 209, 88, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(48, 209, 88, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#30D158' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <div style={{ color: '#30D158', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>WORKSHOP ATTENDANCE</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit', color: '#FFF' }}>
                    {attendedCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {totalStudents} Attended</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 214, 0, 0.08)',
                border: '1px solid rgba(255, 214, 0, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255, 214, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD600' }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>SEATS FILLED</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit', color: '#FFD600' }}>
                    {totalStudents} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 30 Seats</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(37, 211, 102, 0.08)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setIsWhatsAppModalOpen(true)}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                  <WhatsAppIcon size={24} />
                </div>
                <div>
                  <div style={{ color: '#25D366', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>WHATSAPP INVITATIONS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Outfit', color: '#FFF' }}>
                    Send Reminders 📲
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div style={{
              display: 'flex',
              gap: '0.8rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {/* Search Bar */}
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, ID, phone, email, college..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFF',
                    fontSize: '0.85rem'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Attendance Status Filter */}
              <select
                value={selectedAttendanceFilter}
                onChange={(e) => setSelectedAttendanceFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <option value="ALL" style={{ background: '#091122' }}>ALL ATTENDANCE</option>
                <option value="ATTENDED" style={{ background: '#091122' }}>🟢 ATTENDED</option>
                <option value="ABSENT" style={{ background: '#091122' }}>⚪ ABSENT</option>
              </select>

              {/* Mission Track Filter */}
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <option value="ALL" style={{ background: '#091122' }}>ALL TRACKS</option>
                <option value="AI AGENTS" style={{ background: '#091122' }}>🤖 AI AGENTS</option>
                <option value="AI VISION" style={{ background: '#091122' }}>👁️ AI VISION</option>
                <option value="AI HEALTHCARE" style={{ background: '#091122' }}>🏥 AI HEALTHCARE</option>
                <option value="AI WEB" style={{ background: '#091122' }}>🌐 AI WEB</option>
                <option value="AI AUTOMATION" style={{ background: '#091122' }}>⚡ AI AUTOMATION</option>
              </select>

              {/* Joining Type Filter */}
              <select
                value={selectedJoiningType}
                onChange={(e) => setSelectedJoiningType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <option value="ALL" style={{ background: '#091122' }}>ALL JOINING TYPES</option>
                <option value="solo" style={{ background: '#091122' }}>👤 SOLO</option>
                <option value="team" style={{ background: '#091122' }}>👥 TEAM</option>
              </select>
            </div>

            {/* Students Table */}
            <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.3)' }}>
              {fetchingStudents ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <RefreshCw size={24} className="spin" style={{ marginBottom: '0.5rem', color: '#0A84FF' }} />
                  <div>Loading registered student data from MongoDB...</div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <User size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#FFF' }}>No registered students found.</div>
                  <div style={{ fontSize: '0.85rem' }}>Try clearing filters or search query.</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <th style={{ padding: '10px 14px' }}>SEAT #</th>
                      <th style={{ padding: '10px 14px' }}>ATTENDANCE</th>
                      <th style={{ padding: '10px 14px' }}>STUDENT ID</th>
                      <th style={{ padding: '10px 14px' }}>NAME & BRANCH</th>
                      <th style={{ padding: '10px 14px' }}>CONTACT</th>
                      <th style={{ padding: '10px 14px' }}>COLLEGE</th>
                      <th style={{ padding: '10px 14px' }}>JOINING / TEAM</th>
                      <th style={{ padding: '10px 14px' }}>MISSION TRACK</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((st, idx) => (
                      <tr
                        key={st.id || st._id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: 900 }}>
                          <span style={{
                            background: 'rgba(255, 214, 0, 0.15)',
                            border: '1px solid rgba(255, 214, 0, 0.4)',
                            color: '#FFD600',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            #{st.seatNumber || (idx + 1)}
                          </span>
                        </td>

                        {/* Attendance Toggle Button Column */}
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => handleToggleAttendance(st.id || st._id, st.attended)}
                            title={st.attended ? "Mark as Absent" : "Mark as Attended"}
                            style={{
                              background: st.attended ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              border: st.attended ? '1px solid rgba(48, 209, 88, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                              color: st.attended ? '#30D158' : 'var(--text-muted)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 800,
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {st.attended ? <UserCheck size={14} /> : <UserX size={14} />}
                            {st.attended ? 'Attended' : 'Mark Attended'}
                          </button>
                        </td>

                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                          {st.id || 'N/A'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.9rem' }}>{st.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.branch} • {st.yearOfStudy}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ color: '#FFF', fontWeight: 600 }}>📞 {st.phone}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>✉️ {st.email}</div>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {st.college}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {st.joiningType === 'team' ? (
                            <span style={{ background: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                              👥 {st.teamName || 'Team'}
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '6px' }}>
                              👤 Solo
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: 'rgba(0, 199, 181, 0.15)', color: 'var(--neon-cyan)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                            {st.missionTrack || 'AI AGENTS'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              title="Edit Student Details"
                              onClick={() => setEditingStudent({ ...st })}
                              style={{
                                background: 'rgba(255, 214, 0, 0.2)',
                                border: '1px solid rgba(255, 214, 0, 0.5)',
                                color: '#FFD600',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 800
                              }}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              title="Send WhatsApp Invitation"
                              onClick={() => sendWhatsAppInvitation(st.phone, st.name, st.seatNumber)}
                              style={{
                                background: 'rgba(37, 211, 102, 0.2)',
                                border: '1px solid rgba(37, 211, 102, 0.5)',
                                color: '#25D366',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 700
                              }}
                            >
                              <WhatsAppIcon size={14} /> Send
                            </button>
                            <button
                              title="View Full Student Details"
                              onClick={() => setActiveStudentDetail(st)}
                              style={{
                                background: 'rgba(10, 132, 255, 0.2)',
                                border: 'none',
                                color: '#0A84FF',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              title="Open Student Pass"
                              onClick={() => {
                                onClose();
                                if (onSelectStudentPass) onSelectStudentPass(st);
                              }}
                              style={{
                                background: 'rgba(48, 209, 88, 0.2)',
                                border: 'none',
                                color: '#30D158',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Award size={15} />
                            </button>
                            <button
                              title="Delete Record"
                              onClick={() => handleDeleteStudent(st.id || st._id, st.name)}
                              style={{
                                background: 'rgba(255, 69, 58, 0.2)',
                                border: 'none',
                                color: '#FF453A',
                                padding: '6px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Total Footer Status */}
            <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div>Showing <strong>{filteredStudents.length}</strong> of <strong>{totalStudents}</strong> registered students (Attended: <strong style={{ color: '#30D158' }}>{attendedCount}</strong>)</div>
              <div>Authorized Admin Portal • Medsquire Technologies</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Student Details Modal */}
      {editingStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1300,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              background: '#091122',
              border: '1px solid rgba(255, 214, 0, 0.5)',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 70px rgba(0,0,0,0.95)',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={() => setEditingStudent(null)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto 0.8rem auto', borderRadius: '50%', background: 'rgba(255, 214, 0, 0.15)', border: '1px solid #FFD600', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD600' }}>
                <Edit3 size={24} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 900, margin: 0, color: '#FFF' }}>
                EDIT STUDENT DETAILS
              </h3>
              <div style={{ color: 'var(--neon-cyan)', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                ID: {editingStudent.id || editingStudent._id}
              </div>
            </div>

            <form onSubmit={handleSaveEditStudent}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>STUDENT FULL NAME</label>
                <input
                  type="text"
                  value={editingStudent.name || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>COLLEGE NAME</label>
                <input
                  type="text"
                  value={editingStudent.college || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>BRANCH</label>
                  <input
                    type="text"
                    value={editingStudent.branch || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, branch: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>YEAR OF STUDY</label>
                  <select
                    value={editingStudent.yearOfStudy || '3rd Year'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, yearOfStudy: e.target.value })}
                  >
                    <option value="1st Year" style={{ background: '#091122' }}>1st Year</option>
                    <option value="2nd Year" style={{ background: '#091122' }}>2nd Year</option>
                    <option value="3rd Year" style={{ background: '#091122' }}>3rd Year</option>
                    <option value="4th Year" style={{ background: '#091122' }}>4th Year</option>
                    <option value="MCA / Other" style={{ background: '#091122' }}>MCA / Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>JOINING TYPE</label>
                  <select
                    value={editingStudent.joiningType || 'solo'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, joiningType: e.target.value })}
                  >
                    <option value="solo" style={{ background: '#091122' }}>Solo</option>
                    <option value="team" style={{ background: '#091122' }}>Team</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>TEAM NAME</label>
                  <input
                    type="text"
                    value={editingStudent.teamName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, teamName: e.target.value })}
                    placeholder="Team Name (if team)"
                    disabled={editingStudent.joiningType !== 'team'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>MISSION TRACK</label>
                  <select
                    value={editingStudent.missionTrack || 'AI AGENTS'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, missionTrack: e.target.value })}
                  >
                    <option value="AI AGENTS" style={{ background: '#091122' }}>🤖 AI AGENTS</option>
                    <option value="AI VISION" style={{ background: '#091122' }}>👁️ AI VISION</option>
                    <option value="AI HEALTHCARE" style={{ background: '#091122' }}>🏥 AI HEALTHCARE</option>
                    <option value="AI WEB" style={{ background: '#091122' }}>🌐 AI WEB</option>
                    <option value="AI AUTOMATION" style={{ background: '#091122' }}>⚡ AI AUTOMATION</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>SEAT NUMBER</label>
                  <input
                    type="number"
                    value={editingStudent.seatNumber || 1}
                    onChange={(e) => setEditingStudent({ ...editingStudent, seatNumber: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={30}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>WORKSHOP ATTENDANCE</label>
                <select
                  value={editingStudent.attended ? 'true' : 'false'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, attended: e.target.value === 'true' })}
                >
                  <option value="false" style={{ background: '#091122' }}>⚪ Absent</option>
                  <option value="true" style={{ background: '#091122' }}>🟢 Attended (Present)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                >
                  <Save size={16} /> {isSavingEdit ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingStudent(null)}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* WhatsApp Invitations Blast Modal */}
      {isWhatsAppModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1250,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              background: '#091122',
              border: '1px solid rgba(37, 211, 102, 0.5)',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 70px rgba(0,0,0,0.95)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.2)', border: '1px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                <WhatsAppIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 900, margin: 0, color: '#FFF' }}>
                  WHATSAPP INVITATION BROADCASTER
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Send tomorrow's workshop reminder to all {totalStudents} registered students
                </div>
              </div>
            </div>

            {/* Message Preview Box */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#25D366', textTransform: 'uppercase' }}>
                  💬 INVITATION MESSAGE PREVIEW:
                </span>
                <button
                  onClick={handleCopyBroadcastText}
                  style={{
                    background: copiedMessage ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: copiedMessage ? '#30D158' : '#FFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedMessage ? <Check size={14} /> : <Copy size={14} />}
                  {copiedMessage ? 'Copied to Clipboard!' : 'Copy Broadcast Text'}
                </button>
              </div>

              <textarea
                readOnly
                value={getWhatsAppInvitationText('[Student Name]', '[Seat #]')}
                style={{
                  width: '100%',
                  height: '150px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontFamily: 'sans-serif',
                  lineHeight: '1.5',
                  resize: 'none'
                }}
              />
            </div>

            {/* Student Send List */}
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              REGISTERED STUDENTS ({students.length}):
            </div>

            <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', padding: '8px' }}>
              {students.map((st, i) => (
                <div
                  key={st.id || i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    marginBottom: '4px'
                  }}
                >
                  <div>
                    <span style={{ color: '#FFD600', fontWeight: 800, marginRight: '8px' }}>#{st.seatNumber || (i+1)}</span>
                    <strong style={{ color: '#FFF' }}>{st.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '8px' }}>({st.phone})</span>
                  </div>
                  <button
                    onClick={() => sendWhatsAppInvitation(st.phone, st.name, st.seatNumber)}
                    style={{
                      background: '#25D366',
                      border: 'none',
                      color: '#000',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <WhatsAppIcon size={14} color="#000" /> Send WhatsApp
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button
                className="btn-secondary"
                onClick={() => setIsWhatsAppModalOpen(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail Modal for Single Student */}
      {activeStudentDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1200,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#091122',
              border: '1px solid rgba(10, 132, 255, 0.4)',
              borderRadius: '20px',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
            }}
          >
            <button
              onClick={() => setActiveStudentDetail(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ background: 'rgba(255, 214, 0, 0.2)', color: '#FFD600', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                SEAT #{activeStudentDetail.seatNumber}
              </span>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', margin: '0.5rem 0 0.2rem 0', color: '#FFF' }}>
                {activeStudentDetail.name}
              </h3>
              <div style={{ fontFamily: 'monospace', color: 'var(--neon-cyan)', fontSize: '0.9rem', fontWeight: 700 }}>
                {activeStudentDetail.id}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Attendance:</span>
                <strong style={{ color: activeStudentDetail.attended ? '#30D158' : '#FF453A' }}>
                  {activeStudentDetail.attended ? '🟢 Attended (Present)' : '⚪ Absent'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <strong style={{ color: '#FFF' }}>{activeStudentDetail.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <strong style={{ color: '#FFF' }}>{activeStudentDetail.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>College:</span>
                <strong style={{ color: '#FFF', textAlign: 'right', maxWidth: '240px' }}>{activeStudentDetail.college}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Branch & Year:</span>
                <strong style={{ color: '#FFF' }}>{activeStudentDetail.branch} ({activeStudentDetail.yearOfStudy})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Joining Type:</span>
                <strong style={{ color: '#0A84FF' }}>{activeStudentDetail.joiningType === 'team' ? `Team (${activeStudentDetail.teamName})` : 'Solo'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mission Track:</span>
                <strong style={{ color: 'var(--neon-cyan)' }}>{activeStudentDetail.missionTrack}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registered Date:</span>
                <strong style={{ color: '#FFF' }}>{activeStudentDetail.registeredAt ? new Date(activeStudentDetail.registeredAt).toLocaleString() : 'N/A'}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => handleToggleAttendance(activeStudentDetail.id || activeStudentDetail._id, activeStudentDetail.attended)}
                  style={{
                    flex: 1,
                    background: activeStudentDetail.attended ? 'rgba(255, 69, 58, 0.2)' : 'rgba(48, 209, 88, 0.2)',
                    border: activeStudentDetail.attended ? '1px solid #FF453A' : '1px solid #30D158',
                    color: activeStudentDetail.attended ? '#FF453A' : '#30D158',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {activeStudentDetail.attended ? <UserX size={16} /> : <UserCheck size={16} />}
                  {activeStudentDetail.attended ? 'Mark as Absent' : 'Mark Attended'}
                </button>

                <button
                  onClick={() => {
                    const studentToEdit = { ...activeStudentDetail };
                    setActiveStudentDetail(null);
                    setEditingStudent(studentToEdit);
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 214, 0, 0.2)',
                    border: '1px solid #FFD600',
                    color: '#FFD600',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={16} /> Edit Details
                </button>
              </div>

              <button
                onClick={() => sendWhatsAppInvitation(activeStudentDetail.phone, activeStudentDetail.name, activeStudentDetail.seatNumber)}
                style={{
                  background: '#25D366',
                  color: '#000',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <WhatsAppIcon size={18} color="#000" /> SEND WHATSAPP INVITATION
              </button>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setActiveStudentDetail(null);
                    onClose();
                    if (onSelectStudentPass) onSelectStudentPass(activeStudentDetail);
                  }}
                >
                  🎓 VIEW ID CARD PASS
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveStudentDetail(null)}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
