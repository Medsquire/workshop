import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ArrowDown, Laptop, Users, Wrench, 
  Rocket, Presentation, Award, CheckCircle2, ChevronDown,
  BrainCircuit, Bot, LineChart, Shield, Database, Globe, 
  Smartphone, Search, Cpu, LayoutTemplate, Workflow,
  Activity, Train, GraduationCap, Video, Cpu as Microchip,
  Menu, X, Coffee, Upload, CreditCard, Sparkles, LogIn, Lock,
  Eye, EyeOff, MapPin, Phone, Mail, ExternalLink, AlertCircle
} from 'lucide-react';
import IdCardModal from './IdCardModal';
import LoginModal from './LoginModal';
import RegistrationLoadingModal from './RegistrationLoadingModal';
import MedsquireLogo from './MedsquireLogo';
import { registerStudentApi, updateTrackApi } from '../utils/api';

const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// 1. Navigation
const Navigation = ({ onOpenLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
      background: 'rgba(2, 2, 5, 0.88)', backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--panel-border)', padding: '0.9rem 5%',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px' }}>
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M45 35 L80 35 L35 70 L80 70" stroke="#0A84FF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="75" cy="20" r="10" fill="#00C7B5" />
          </svg>
        </div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px' }}>
          Medsquire <span className="text-gradient">Technologies</span>
        </span>
      </div>
      
      <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <a href="#home" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>HOME</a>
        <a href="#missions" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>MISSIONS</a>
        <a href="#schedule" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>SCHEDULE</a>
        <a href="#location" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>LOCATION</a>
        
        <button 
          onClick={onOpenLogin}
          style={{ 
            background: 'rgba(10, 132, 255, 0.15)', 
            border: '1px solid rgba(10, 132, 255, 0.5)', 
            color: '#0A84FF', 
            padding: '8px 18px', 
            borderRadius: '8px', 
            fontWeight: 700, 
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <LogIn size={16} /> LOGIN
        </button>

        <a href="#register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>REGISTER</a>
      </div>
      
      <div style={{ display: window.innerWidth < 768 ? 'block' : 'none' }} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X color="white" /> : <Menu color="white" />}
      </div>
    </nav>
  );
};

// 2. Hero Section
const Hero = () => (
  <section id="home" className="section-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '7.5rem' }}>
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ maxWidth: '950px', margin: '0 auto', textAlign: 'center' }}>
      
      <motion.div variants={fadeUp} style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.8rem' }}>
        MEDSQUIRE TECHNOLOGIES PVT LTD PRESENTS
      </motion.div>

      {/* Workshop Name Badge */}
      <motion.div variants={fadeUp} style={{ marginBottom: '1.2rem' }}>
        <span style={{ background: 'rgba(255, 214, 0, 0.15)', border: '1px solid rgba(255, 214, 0, 0.5)', color: '#FFD600', padding: '6px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>
          🚀 FULL-STACK AI PRODUCT BUILDING WORKSHOP
        </span>
      </motion.div>
      
      <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6rem)', lineHeight: 1.1, marginBottom: '0.8rem', fontFamily: 'Outfit', fontWeight: 900, letterSpacing: '-2px' }}>
        AI SPRINT <span style={{ color: 'var(--accent-yellow)', textShadow: '0 0 20px rgba(255,214,0,0.4)' }}>2.0</span>
      </motion.h1>
      
      <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.3rem, 3.2vw, 2.2rem)', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>
        DON'T JUST LEARN AI.<br/><span className="text-gradient">BUILD A REAL AI PRODUCT IN ONE DAY.</span>
      </motion.h2>
      
      <motion.div variants={fadeUp} style={{ fontSize: '1.1rem', color: 'var(--accent-yellow)', fontWeight: 700, marginBottom: '1.5rem' }}>
        One Day • Hands-On Workshop • Complete AI Project
      </motion.div>
      
      <motion.p variants={fadeUp} style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
        <strong>The future is AI in every field. Everything is AI.</strong><br/><br/>
        Bring your laptop and join us. In this intensive workshop, we will teach you step-by-step how to build a complete working AI product from scratch. Let us build together!
      </motion.p>
      
      <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '10px 20px', fontWeight: 700 }}>02 OCT 2026</div>
        <div className="glass-card" style={{ padding: '10px 20px', fontWeight: 700 }}>10 AM – 4 PM</div>
        <div className="glass-card" style={{ padding: '10px 20px', fontWeight: 700 }}>ELURU, AP</div>
        <div className="glass-card" style={{ padding: '10px 20px', fontWeight: 900, color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>FREE REGISTRATION</div>
      </motion.div>
      
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="#register" className="btn-primary">
          REGISTER & CONFIRM SEAT <ChevronRight className="icon-arrow" />
        </a>
        <a href="#missions" className="btn-secondary">
          EXPLORE MISSION TRACKS <ArrowDown className="icon-arrow" />
        </a>
      </motion.div>
      
      <motion.div variants={fadeUp} style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        FREE REGISTRATION • LIMITED TO 30 SEATS • OFFICIAL ID CARD & CERTIFICATE
      </motion.div>
    </motion.div>
  </section>
);

// Concept section
const ConceptSection = () => (
  <section className="section-container darker">
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>WHAT IS <span className="text-gradient">AI SPRINT WORKSHOP?</span></motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          AI Sprint 2.0 is a hands-on technology workshop where students move from an idea to a working AI product in a single day.
        </motion.p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
          {['IDEA', 'BUILD', 'TEST', 'DEMO'].map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-card" style={{ width: '150px' }}>
              <div style={{ color: 'var(--neon-blue)', fontSize: '2rem', fontWeight: 900, opacity: 0.5 }}>0{i+1}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '1rem' }}>{step}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="glass-card interactive" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'radial-gradient(circle at center, rgba(10, 132, 255, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>HAVE AN <span style={{color:'var(--accent-yellow)'}}>AI IDEA?</span></motion.h2>
        <motion.h3 variants={fadeUp} style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Don't know how to build it? We will teach you.</motion.h3>
        <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Use AI, modern tools, and our expert guidance to turn your idea into a working prototype product today.
        </motion.p>
        <motion.div variants={fadeUp}>
          <a href="#register" className="btn-primary">REGISTER FOR WORKSHOP <ChevronRight className="icon-arrow" /></a>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Solo or Team — both are welcome.</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const benefits = [
  { icon: <Laptop size={32} color="#FFD600" />, text: "Bring Your Laptop" },
  { icon: <Users size={32} color="#00C7B5" />, text: "Build Solo or With Your Team" },
  { icon: <Wrench size={32} color="#0A84FF" />, text: "Use Cutting-Edge AI Tools" },
  { icon: <Rocket size={32} color="#FFD600" />, text: "Create a Complete Project in One Day" },
  { icon: <Presentation size={32} color="#00C7B5" />, text: "Present Your Project Live" },
  { icon: <Award size={32} color="#0A84FF" />, text: "Get Official Participation Certificate" },
  { icon: <Coffee size={32} color="#FFD600" />, text: "Snacks & Refreshments Provided" }
];

const BenefitsSection = () => (
  <section className="section-container" style={{ padding: '6rem 5%' }}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', fontFamily: 'Outfit', fontWeight: 800 }}
    >
      WHY <span className="text-gradient">ATTEND?</span>
    </motion.h2>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      {benefits.map((b, i) => (
        <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '220px', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>{b.icon}</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px', lineHeight: 1.4 }}>{b.text}</span>
        </div>
      ))}
    </motion.div>
  </section>
);

const Missions = () => {
  const missions = [
    { icon: '🤖', title: 'AI AGENTS', desc: 'Build an AI assistant that can reason, use tools and complete tasks.' },
    { icon: '👁️', title: 'AI VISION', desc: 'Build computer-vision projects using images or cameras.' },
    { icon: '🌐', title: 'AI WEB', desc: 'Build an AI-powered website or web application.' },
    { icon: '🏥', title: 'AI HEALTHCARE', desc: 'Create technology ideas for healthcare and assistance.' },
    { icon: '📚', title: 'AI EDUCATION', desc: 'Build intelligent learning and student-support systems.' },
    { icon: '⚙️', title: 'AI AUTOMATION', desc: 'Automate real-world workflows using AI.' },
    { icon: '📊', title: 'DATA + AI', desc: 'Use data, analytics and AI to solve a problem.' },
    { icon: '🚀', title: 'YOUR OWN IDEA', desc: 'Bring your own problem and create your own solution.' }
  ];

  return (
    <section id="missions" className="section-container solid">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>CHOOSE YOUR <span className="text-gradient">AI MISSION TRACK</span></h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Select your mission track after completing free registration.</p>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {missions.map((m, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-card interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{m.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{m.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem' }}>{m.desc}</p>
              <a href="#register" style={{ textDecoration: 'none', fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: 700, letterSpacing: '1px' }}>CHOOSE THIS TRACK →</a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Location & Venue Section
const LocationSection = () => (
  <section id="location" className="section-container darker">
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>WORKSHOP <span className="text-gradient">LOCATION & VENUE</span></h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Join us live at Medsquire Technologies headquarters in Eluru.</p>
      </motion.div>

      <div className="glass-card" style={{ padding: '3rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0, 199, 181, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00C7B5' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'Outfit', fontWeight: 900, color: '#FFF' }}>Medsquire Technologies Pvt Ltd</h3>
              <p style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', fontWeight: 700 }}>Eluru Center, Andhra Pradesh</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
            <strong>Full Venue Address:</strong><br />
            Medsquire Technologies Pvt Ltd,<br />
            One Town, Kathepu St, Paidichintapadu,<br />
            Eluru, Andhra Pradesh - 534001<br />
            <span style={{ color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 600 }}>(Nearby Venkanna Cheruvu)</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 600 }}>
              <Phone size={18} color="#0A84FF" /> WhatsApp / Contact: <a href="tel:9014312221" style={{ color: '#0A84FF', textDecoration: 'none' }}>90143 12221</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 600 }}>
              <InstagramIcon size={18} color="#FFD600" /> Instagram: <a href="https://www.instagram.com/medsquire" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD600', textDecoration: 'none' }}>@medsquire <ExternalLink size={14} /></a>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 350px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--panel-border)', textAlign: 'center' }}>
          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: '#FFF' }}>TIMINGS & DATE</h4>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-yellow)', marginBottom: '0.5rem' }}>02 OCT 2026</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '1.5rem' }}>10:00 AM – 04:00 PM</div>

          <a 
            href="https://maps.app.goo.gl/qwfNdAiyeYb1mnVd9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <MapPin size={18} /> OPEN IN GOOGLE MAPS
          </a>
        </div>
      </div>
    </div>
  </section>
);

// 9. Timeline
const Timeline = () => {
  const schedule = [
    { time: '10:00 AM', title: 'CHECK-IN & ID CARD SCAN', desc: 'Scan your generated Student ID Card at entrance for seat check-in.' },
    { time: '10:30 AM', title: 'CHOOSE YOUR IDEA', desc: 'Select a mission track or bring your own idea.' },
    { time: '11:00 AM', title: 'AI + TECH GUIDANCE', desc: 'Understand modern AI building tools and frameworks.' },
    { time: '12:00 PM', title: 'START BUILDING', desc: 'Start developing your AI product.' },
    { time: '1:00 PM', title: 'BREAK', desc: '' },
    { time: '1:30 PM', title: 'BUILD + TEST', desc: 'Develop, test and polish your AI project.' },
    { time: '3:30 PM', title: 'PROJECT DEMO', desc: 'Present what your team created live.' },
    { time: '4:00 PM', title: 'CERTIFICATE', desc: 'Receive official Medsquire workshop certificate.' }
  ];

  return (
    <section id="schedule" className="section-container">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>WORKSHOP <span className="text-gradient">SCHEDULE</span></motion.h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {schedule.map((s, i) => (
            <motion.div key={i} variants={fadeUp} style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ width: '120px', textAlign: 'right', fontWeight: 800, color: 'var(--accent-yellow)', fontSize: '1.1rem' }}>{s.time}</div>
              <div style={{ width: '2px', background: 'var(--panel-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--neon-cyan)' }} />
              </div>
              <div style={{ flex: 1, paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</h3>
                {s.desc && <p style={{ color: 'var(--text-muted)' }}>{s.desc}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// 20 & 21 & 22. Registration Form
const Registration = ({ onSubmitRegistration }) => {
  const [formData, setFormData] = useState({
    joiningType: 'solo',
    name: '',
    email: '',
    phone: '',
    password: '',
    college: '',
    yearOfStudy: '3rd Year',
    branch: 'CSE',
    teamName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbErrorDetails, setDbErrorDetails] = useState(null);

  const handlePhoneChange = (e) => {
    // Restrict strictly to 10 numeric digits
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData({ ...formData, phone: val });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getWhatsAppUrl = () => {
    if (!dbErrorDetails) return '#';
    const text = `Hi Medsquire Team, my registration details could not be saved to the database on the website. Please confirm my registration manually:

*Name:* ${dbErrorDetails.name}
*Phone:* ${dbErrorDetails.phone}
*Email:* ${dbErrorDetails.email}
*College:* ${dbErrorDetails.college}
*Branch:* ${dbErrorDetails.branch}
*Year:* ${dbErrorDetails.yearOfStudy}
*Joining Type:* ${dbErrorDetails.joiningType}
${dbErrorDetails.teamName ? `*Team Name:* ${dbErrorDetails.teamName}\n` : ''}*Mission Track:* ${dbErrorDetails.missionTrack}

Please help me confirm my seat for AI Sprint 2.0!`;

    return `https://wa.me/919014312221?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setDbErrorDetails(null);

    // Strict 10 digit Phone Number validation
    const cleanPhone = formData.phone.trim();
    if (cleanPhone.length !== 10) {
      setFormError('Phone number must contain exactly 10 numeric digits.');
      return;
    }

    // Strict Email Regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setFormError('Please enter a valid password (at least 4 characters).');
      return;
    }

    setIsSubmitting(true);

    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
    const studentId = `MS26-${randomHex}`;

    const studentRecord = {
      id: studentId,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: cleanPhone,
      password: formData.password.trim(),
      college: formData.college.trim(),
      yearOfStudy: formData.yearOfStudy,
      branch: formData.branch.trim(),
      joiningType: formData.joiningType,
      teamName: formData.teamName ? formData.teamName.trim() : '',
      missionTrack: 'AI AGENTS',
      photoUrl: photoUrl,
      registeredAt: new Date().toISOString()
    };

    // Save to MongoDB backend first
    const res = await registerStudentApi(studentRecord);
    setIsSubmitting(false);

    if (res && res.success && res.data) {
      // Save confirmed record to local storage cache
      try {
        const existing = localStorage.getItem('ai_sprint_registrations');
        const list = existing ? JSON.parse(existing) : [];
        const idx = list.findIndex(s => s.phone === res.data.phone || s.id === res.data.id);
        if (idx !== -1) {
          list[idx] = res.data;
        } else {
          list.push(res.data);
        }
        localStorage.setItem('ai_sprint_registrations', JSON.stringify(list));
      } catch (err) {
        console.error("Storage error:", err);
      }

      // Proceed to seat loading screen and generate official ID Card Pass
      onSubmitRegistration(res.data);
    } else {
      // DB Save Failed!
      const errorMsg = (res && res.message) || 'Database save failed. Details were NOT saved to MongoDB.';
      setFormError(errorMsg);
      setDbErrorDetails({
        ...studentRecord,
        errorMessage: errorMsg
      });
    }
  };

  return (
    <section id="register" className="section-container solid" style={{ borderTop: '1px solid var(--panel-border)' }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
        
        <div style={{ flex: '1 1 400px' }}>
          <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontFamily: 'Outfit', fontWeight: 900 }}>
              WORKSHOP <span className="text-gradient-yellow">REGISTRATION</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, marginBottom: '2rem' }}>
              AI SPRINT 2.0: FULL-STACK AI PRODUCT BUILDING WORKSHOP
            </p>
            
            <div className="glass-card" style={{ display: 'inline-block', borderColor: 'var(--neon-blue)', background: 'rgba(10, 132, 255, 0.1)' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--neon-blue)', marginBottom: '0.5rem' }}>30 SEATS MAXIMUM</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Limited workshop slots to ensure practical step-by-step guidance for every student.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>11</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>DAYS</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>21</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>HOURS</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>45</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>MINS</div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} style={{ marginTop: '3rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            <strong>02 OCT 2026 • 10 AM–4 PM • ELURU, AP</strong><br/><br/>
            Contact / WhatsApp: <a href="tel:9014312221" style={{ color: 'white', fontWeight: 700, textDecoration: 'none' }}>90143 12221</a>
          </motion.div>
        </div>
        
        <motion.div variants={fadeUp} style={{ flex: '1 1 500px' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', fontFamily: 'Outfit', fontWeight: 900, marginBottom: '1.5rem', color: '#FFF' }}>
              FREE WORKSHOP REGISTRATION
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>HOW ARE YOU JOINING?</label>
                <select 
                  value={formData.joiningType} 
                  onChange={(e) => setFormData({ ...formData, joiningType: e.target.value })}
                  required
                >
                  <option value="solo">SOLO PARTICIPANT</option>
                  <option value="team">WITH MY TEAM</option>
                </select>
              </div>

              {/* Student Photo Upload */}
              <div className="form-group">
                <label>STUDENT PHOTO (FOR ID CARD)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div 
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '2px dashed var(--neon-cyan)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt="Student Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Upload size={22} color="var(--neon-cyan)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ fontSize: '0.85rem', padding: '10px' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Upload student photo for ID Card pass (Optional)
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>FULL NAME *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g. Srini Vasu" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS *</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="name@example.com" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>PHONE NUMBER (10 DIGITS) *</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handlePhoneChange} 
                    placeholder="e.g. 9014312221" 
                    maxLength={10}
                    required 
                  />
                  {formData.phone && formData.phone.length < 10 && (
                    <div style={{ fontSize: '0.75rem', color: '#FF9500', marginTop: '4px' }}>
                      {10 - formData.phone.length} more digits required
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>CREATE PASSWORD *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      placeholder="Login password" 
                      required 
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
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
              </div>

              <div className="form-group">
                <label>COLLEGE / UNIVERSITY *</label>
                <input 
                  type="text" 
                  value={formData.college} 
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })} 
                  placeholder="e.g. Eluru College of Engineering" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>YEAR OF STUDY *</label>
                  <select 
                    value={formData.yearOfStudy} 
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    required
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="MCA / Other">MCA / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>BRANCH / STREAM *</label>
                  <input 
                    type="text" 
                    value={formData.branch} 
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })} 
                    placeholder="e.g. CSE, ECE, IT, AI&DS" 
                    required 
                  />
                </div>
              </div>

              {formData.joiningType === 'team' && (
                <div className="form-group">
                  <label>TEAM NAME</label>
                  <input 
                    type="text" 
                    value={formData.teamName} 
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })} 
                    placeholder="e.g. Cyber Ninjas" 
                  />
                </div>
              )}

              {formError && (
                <div style={{ background: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.5)', padding: '14px 16px', borderRadius: '12px', color: '#FF453A', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
                    <AlertCircle size={18} /> Details Not Saved to Database
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#FFD600', lineHeight: 1.5, marginBottom: dbErrorDetails ? '12px' : '0' }}>
                    {formError}
                  </div>

                  {dbErrorDetails && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '10px 16px', justifyContent: 'center' }}
                      >
                        🔄 TRY AGAIN
                      </button>

                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#25D366',
                          color: '#000',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                        }}
                      >
                        <Phone size={16} /> SEND DETAILS VIA WHATSAPP (+91 9014312221)
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  marginTop: '1rem', 
                  padding: '16px',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'SAVING TO DATABASE...' : 'REGISTER & CONFIRM WORKSHOP SEAT →'}
              </button>
            </form>
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  );
};

// 33. Footer
const Footer = ({ onOpenLogin }) => (
  <footer style={{ background: '#000', padding: '4rem 5%', textAlign: 'center', borderTop: '1px solid var(--panel-border)' }}>
    <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 900, marginBottom: '0.5rem' }}>Medsquire Technologies Pvt Ltd</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Dream • Code • Succeed</p>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
      <span style={{ color: 'white', fontWeight: 600 }}>Eluru, Andhra Pradesh</span>
      <a href="tel:9014312221" style={{ color: 'var(--neon-cyan)', fontWeight: 600, textDecoration: 'none' }}>90143 12221</a>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
      <button 
        onClick={onOpenLogin}
        style={{ 
          background: 'rgba(10,132,255,0.15)', 
          border: '1px solid rgba(10,132,255,0.4)', 
          color: '#0A84FF', 
          padding: '12px 30px', 
          borderRadius: '30px', 
          fontSize: '0.95rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <LogIn size={18} /> Student Login & View Pass
      </button>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Website</a>
      <a 
        href="https://www.instagram.com/medsquire" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: 'var(--accent-yellow)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
      >
        <InstagramIcon size={18} /> Instagram (@medsquire)
      </a>
      <a href="tel:9014312221" style={{ color: 'var(--neon-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
        <Phone size={18} /> WhatsApp: 90143 12221
      </a>
    </div>
    
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Medsquire Technologies Pvt Ltd. All rights reserved.</p>
  </footer>
);

export default function UI() {
  const [activeStudent, setActiveStudent] = useState(null);
  const [isLoadingSeat, setIsLoadingSeat] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubmitRegistration = (studentRecord) => {
    setActiveStudent(studentRecord);
    setIsLoadingSeat(true);
  };

  const handleLoadingComplete = () => {
    setIsLoadingSeat(false);
    setIsIdModalOpen(true);
  };

  const handleUpdateTrack = (newTrack) => {
    if (!activeStudent) return;
    const updated = { ...activeStudent, missionTrack: newTrack };
    setActiveStudent(updated);

    try {
      const stored = localStorage.getItem('ai_sprint_registrations');
      if (stored) {
        const list = JSON.parse(stored);
        const idx = list.findIndex((s) => s.id === updated.id);
        if (idx !== -1) {
          list[idx] = updated;
          localStorage.setItem('ai_sprint_registrations', JSON.stringify(list));
        }
      }
    } catch (err) {}

    updateTrackApi(updated.id, newTrack);
  };

  return (
    <>
      <Navigation 
        onOpenLogin={() => setIsLoginModalOpen(true)} 
      />

      <Hero />
      <BenefitsSection />
      <ConceptSection />
      <Missions />
      <LocationSection />
      <Timeline />
      
      {/* 13. Project Wall Preview */}
      <section className="section-container darker">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>PROJECT <span className="text-gradient">WALL</span></h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>What could you build next in the workshop?</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '1rem' }}><strong>AI HEALTH ASSISTANT</strong><br/><span style={{fontSize:'0.8rem', color:'var(--neon-cyan)'}}>AI + RAG + Web</span></div>
            <div className="glass-card" style={{ padding: '1rem' }}><strong>SMART CAMERA</strong><br/><span style={{fontSize:'0.8rem', color:'var(--neon-cyan)'}}>Computer Vision</span></div>
            <div className="glass-card" style={{ padding: '1rem' }}><strong>AI AUTOMATION AGENT</strong><br/><span style={{fontSize:'0.8rem', color:'var(--neon-cyan)'}}>Agents + Automation</span></div>
          </div>
          
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>YOUR WORKSHOP PRODUCT COULD BE NEXT.</h3>
          <a href="#register" className="btn-secondary">BUILD MINE →</a>
        </div>
      </section>

      <Registration onSubmitRegistration={handleSubmitRegistration} />
      
      <Footer 
        onOpenLogin={() => setIsLoginModalOpen(true)} 
      />
      
      {/* Registration Seat Allocation Loading Screen */}
      <RegistrationLoadingModal
        isOpen={isLoadingSeat}
        studentData={activeStudent}
        onComplete={handleLoadingComplete}
      />

      {/* Student ID Card Modal */}
      <IdCardModal 
        isOpen={isIdModalOpen} 
        onClose={() => setIsIdModalOpen(false)} 
        studentData={activeStudent}
        onUpdateTrack={handleUpdateTrack}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(student) => {
          setActiveStudent(student);
          setIsIdModalOpen(true);
        }}
      />

      {/* Mobile Sticky Action Bar for all iPhone & Android models */}
      <div 
        className="mobile-bottom-bar"
        style={{ 
          display: window.innerWidth < 768 ? 'flex' : 'none', 
          gap: '8px', 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          padding: '0.8rem 1rem', 
          background: 'rgba(2,2,5,0.96)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)', 
          zIndex: 100, 
          borderTop: '1px solid var(--panel-border)' 
        }}
      >
        <button onClick={() => setIsLoginModalOpen(true)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '12px' }}>
          🔑 LOGIN / PASS
        </button>
        <a href="#register" className="btn-primary" style={{ flex: 1.5, justifyContent: 'center', fontSize: '0.85rem', padding: '12px' }}>
          🚀 REGISTER FREE
        </a>
      </div>
    </>
  );
}
