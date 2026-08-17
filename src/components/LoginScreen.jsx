import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sun, 
  Moon, 
  Sparkles,
  UserPlus,
  CheckCircle2,
  Bot,
  Award,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function LoginScreen({ 
  schoolData, 
  userAccounts, 
  onLogin, 
  onRegisterAccount, 
  isDarkMode, 
  setIsDarkMode, 
  onTriggerNotification 
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('STUDENT');
  const [regGrade, setRegGrade] = useState('Class 9-A');
  const [regGuardianName, setRegGuardianName] = useState('');
  const [regGuardianEmail, setRegGuardianEmail] = useState('');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onTriggerNotification('⚠️ Please enter both Email/Username and Password.');
      return;
    }

    const matchedAccount = userAccounts.find(
      u => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
    );

    if (matchedAccount) {
      const storedPassword = matchedAccount.password || 'password123';
      if (password !== storedPassword) {
        onTriggerNotification('❌ Invalid credentials. Please check your password and try again.');
        return;
      }
      onLogin(matchedAccount);
    } else {
      onTriggerNotification('❌ Account not found. Please register a new account or use a demo account.');
    }
  };

  const handleCustomRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      onTriggerNotification('⚠️ Please fill in all registration fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      onTriggerNotification('⚠️ Please enter a valid email address (e.g. user@school.edu).');
      return;
    }

    if (regPassword.length < 6) {
      onTriggerNotification('⚠️ Password must be at least 6 characters long.');
      return;
    }

    const existing = userAccounts.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      onTriggerNotification('⚠️ An account with this email address already exists. Please log in.');
      return;
    }

    const newAcc = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      role: regRole,
      grade: regGrade,
      guardianName: regGuardianName || `${regName.split(' ')[0]}'s Parent`,
      guardianEmail: regGuardianEmail || `${regEmail.split('@')[0]}.parent@gmail.com`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    onRegisterAccount(newAcc);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDarkMode ? '#0f172a' : 'linear-gradient(135deg, #f0fdf4 0%, #e6f4ea 50%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem',
      transition: 'background 0.3s ease'
    }}>
      {/* Dynamic Ambient Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '550px',
        height: '550px',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0,0,0,0) 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(30px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-5%',
        width: '650px',
        height: '650px',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(0,0,0,0) 70%)'
          : 'radial-gradient(circle, rgba(13, 148, 136, 0.22) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(30px)'
      }} />

      {/* Main Login Hero Container */}
      <div style={{
        maxWidth: '1180px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        borderRadius: '24px',
        background: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: isDarkMode 
          ? '0 25px 60px -15px rgba(0, 0, 0, 0.7)' 
          : '0 25px 60px -15px rgba(6, 78, 59, 0.16)',
        overflow: 'hidden',
        zIndex: 10,
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Left Hero Panel (Vibrant Greenish Mesh Theme) */}
        <div style={{
          background: isDarkMode 
            ? 'linear-gradient(145deg, #022c22 0%, #064e3b 55%, #047857 100%)'
            : 'linear-gradient(145deg, #064e3b 0%, #047857 50%, #0d9488 100%)',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff'
        }}>
          {/* Subtle Decorative Background Wave Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(52, 211, 153, 0.25), transparent 60%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* School Brand Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.4rem 0.9rem', 
              borderRadius: '9999px', 
              background: 'rgba(52, 211, 153, 0.18)', 
              border: '1px solid rgba(52, 211, 153, 0.35)', 
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)'
            }}>
              <Zap size={15} style={{ color: '#34d399' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a7f3d0' }}>
                Next-Gen Intelligent Campus
              </span>
            </div>

            <h1 style={{ 
              fontSize: '2.1rem', 
              fontWeight: 800, 
              lineHeight: 1.2, 
              marginBottom: '0.85rem', 
              background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 60%, #67e8f9 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              {schoolData.schoolName}
            </h1>
            <p style={{ color: '#ecfdf5', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', opacity: 0.95 }}>
              A unified digital ecosystem uniting Students, Teachers, Parents, Administration, Fees, AI Tutors, and Live Telemetry into one intelligent platform.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.9rem', color: '#ffffff' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.25)', color: '#6ee7b7', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={17} />
                </div>
                <span style={{ fontWeight: 600 }}>Strict Role-Based Data Isolation & Portals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.9rem', color: '#ffffff' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.25)', color: '#6ee7b7', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={17} />
                </div>
                <span style={{ fontWeight: 600 }}>24/7 AI Personal Tutor & Student 360° Analytics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.9rem', color: '#ffffff' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.25)', color: '#6ee7b7', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={17} />
                </div>
                <span style={{ fontWeight: 600 }}>Early Warning At-Risk Student Interventions</span>
              </div>
            </div>
          </div>

          {/* 1-Click Quick Demo Personas Showcase */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.18)', paddingTop: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a7f3d0', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} style={{ color: '#fde047' }} />
              <span>Instant 1-Click Demo Accounts Selector</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
              {userAccounts.slice(0, 6).map(acc => (
                <div
                  key={acc.id}
                  onClick={() => onLogin(acc)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '12px',
                    padding: '0.6rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#34d399';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img src={acc.avatar} alt={acc.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #34d399' }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ffffff' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#a7f3d0', fontWeight: 500 }}>{acc.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel (Form Controls) */}
        <div style={{ padding: '3.5rem 2.5rem 2.5rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          
          {/* Light/Dark Mode Switcher Button (Inside Box) */}
          <div style={{ position: 'absolute', top: '18px', right: '20px', zIndex: 30 }}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                background: isDarkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(241, 245, 249, 0.9)',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
              title="Switch Theme Mode"
            >
              {isDarkMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sun size={13} className="text-amber-400" />
                  </div>
                  <span>Light Mode</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Moon size={13} className="text-indigo-600" />
                  </div>
                  <span>Dark Mode</span>
                </div>
              )}
            </button>
          </div>
          
          {/* Header Segment Control */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#f1f5f9', 
              padding: '0.35rem', 
              borderRadius: '12px', 
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0', 
              marginBottom: '1.25rem' 
            }}>
              <button 
                onClick={() => setActiveTab('login')}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === 'login' ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'transparent',
                  color: activeTab === 'login' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'login' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                Sign In to Account
              </button>
              <button 
                onClick={() => setActiveTab('register')}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === 'register' ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : 'transparent',
                  color: activeTab === 'register' ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'register' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                Self-Registration
              </button>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              {activeTab === 'login' ? 'Access Digital Campus Portal' : 'Register New Campus Account'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
              {activeTab === 'login' ? 'Enter your authorized email and security password' : 'Create your verified student, parent, or staff account'}
            </p>
          </div>

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.45rem' }}>
                  Email Address / Student ID
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. ali.ahmed@apexdigital.edu" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1',
                      background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      transition: 'border 0.2s ease'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
                    Password
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#059669', cursor: 'pointer', fontWeight: 700 }} onClick={() => onTriggerNotification('📧 Password reset link has been sent to your registered email address.')}>Forgot Password?</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1',
                      background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Sign In to Digital Portal <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCustomRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tariq Mahmood" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. tariq@gmail.com" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Target Role</label>
                  <select 
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="PARENT">Parent</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="SCHOOL_ADMIN">School Admin</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="LIBRARY">Library</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="HR">HR Staff</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Grade / Section</label>
                  <input 
                    type="text" 
                    placeholder="Class 9-A" 
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                  />
                </div>
              </div>

              {regRole === 'STUDENT' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Parent Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tariq Ahmed" 
                      value={regGuardianName}
                      onChange={(e) => setRegGuardianName(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Parent Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g. tariq@gmail.com" 
                      value={regGuardianEmail}
                      onChange={(e) => setRegGuardianEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', display: 'block', marginBottom: '0.35rem' }}>Create Security Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1', background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  width: '100%', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 700,
                  borderRadius: '12px', 
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  cursor: 'pointer',
                  marginTop: '0.25rem' 
                }}
              >
                <UserPlus size={18} /> Register & Launch Portal
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
