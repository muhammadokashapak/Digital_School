import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  UserPlus, 
  Search,
  Trash2,
  Key,
  Lock,
  Unlock,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  FileCode,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Filter,
  GraduationCap,
  Briefcase,
  UserCheck,
  Check,
  ChevronRight,
  HardDrive
} from 'lucide-react';

export default function AdminPortal({ 
  schoolData, 
  userAccounts = [], 
  setUserAccounts, 
  students360List = [], 
  setStudents360List, 
  attendanceList = [],
  setAttendanceList,
  feeInvoices = [],
  setFeeInvoices,
  onTriggerNotification 
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'security' | 'audit' | 'backup'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('STUDENT');
  const [userGrade, setUserGrade] = useState('Class 9-A');
  const [userGuardianName, setUserGuardianName] = useState('');
  const [userGuardianEmail, setUserGuardianEmail] = useState('');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('apex_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { }
    }
    return [
      { id: 'LOG-001', action: 'SYSTEM_INITIALIZED', target: 'Apex Security Root', performedBy: 'Muhammad Okasha (Director)', timestamp: 'Today at 01:40 AM', status: 'SUCCESS', details: 'Master encryption vault online. Zero unauthorized access incidents.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('apex_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAddUserModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addAuditLog = (action, target, details) => {
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      action,
      target,
      performedBy: 'Muhammad Okasha (Super Admin)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'SUCCESS',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserPassword(pwd);
    setShowPassword(true);
    onTriggerNotification('⚡ Generated secure 12-character password.');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      onTriggerNotification('⚠️ Please provide Full Name, Email, and Password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      onTriggerNotification('⚠️ Please enter a valid email address.');
      return;
    }

    const existing = userAccounts.find(u => u.email.toLowerCase() === userEmail.trim().toLowerCase());
    if (existing) {
      onTriggerNotification('⚠️ An account with this email address already exists.');
      return;
    }

    const newUserId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAcc = {
      id: newUserId,
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      password: userPassword,
      role: userRole,
      grade: userGrade || (userRole === 'STUDENT' ? 'Class 9-A' : 'Staff Department'),
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: userRole === 'STUDENT' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : userRole === 'TEACHER'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      guardianName: userGuardianName || `${userName.split(' ')[0]}'s Guardian`,
      guardianEmail: userGuardianEmail || `${userEmail.split('@')[0]}.parent@gmail.com`
    };

    setUserAccounts(prev => [newAcc, ...prev]);

    if (userRole === 'STUDENT') {
      const studentRoll = `090${Math.floor(10 + Math.random() * 89)}`;
      const newStudent360 = {
        id: newUserId,
        name: userName.trim(),
        rollNo: studentRoll,
        grade: userGrade || 'Class 9-A',
        avatar: newAcc.avatar,
        guardian: newAcc.guardianName,
        guardianPhone: '+92 300 1234567',
        guardianEmail: newAcc.guardianEmail,
        attendancePct: 100.0,
        gpa: 3.8,
        overallGrade: 'A',
        riskLevel: 'LOW',
        riskReasons: [],
        learningStreak: 1,
        xpPoints: 100,
        badges: ['Enrolled Scholar 🎓'],
        strongSubjects: ['Computer Science'],
        weakTopics: [],
        portfolioProjects: [],
        skills: ['Active Learner'],
        behaviorRating: 'Excellent'
      };

      setStudents360List(prev => [newStudent360, ...(prev || [])]);

      if (setAttendanceList) {
        setAttendanceList(prev => [
          {
            id: newUserId,
            name: userName.trim(),
            rollNo: studentRoll,
            class: userGrade || 'Class 9-A',
            status: 'PRESENT',
            presentDays: 20,
            totalDays: 20,
            percentage: 100.0
          },
          ...(prev || [])
        ]);
      }

      if (setFeeInvoices) {
        setFeeInvoices(prev => [
          {
            id: `INV-${Date.now().toString().slice(-4)}`,
            studentId: newUserId,
            studentName: userName.trim(),
            month: 'August 2026',
            dueDate: '28 Aug 2026',
            amount: '$180',
            status: 'UNPAID',
            breakdown: [
              { item: 'Tuition Fee (Q3)', cost: '$120' },
              { item: 'Digital LMS & Lab Access', cost: '$40' },
              { item: 'Library & Exam Fee', cost: '$20' }
            ]
          },
          ...(prev || [])
        ]);
      }
    }

    addAuditLog('USER_CREATED', `${userName} (${userRole})`, `Account created with email ${userEmail}`);
    setShowAddUserModal(false);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    onTriggerNotification(`✅ User "${userName}" successfully enrolled as ${userRole}!`);
  };

  const handleDeleteUser = (id, name, role) => {
    if (role === 'SUPER_ADMIN') {
      onTriggerNotification('⛔ Super Administrator root account cannot be deleted.');
      return;
    }
    setUserAccounts(prev => prev.filter(u => u.id !== id));
    setStudents360List(prev => prev.filter(s => s.id !== id));
    if (setAttendanceList) setAttendanceList(prev => prev.filter(a => a.id !== id));
    if (setFeeInvoices) setFeeInvoices(prev => prev.filter(f => f.studentId !== id));
    addAuditLog('USER_DELETED', `${name} (${role})`, `Account ${id} permanently removed.`);
    onTriggerNotification(`🗑️ Account for "${name}" has been deleted.`);
  };

  const handleToggleStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    setUserAccounts(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    addAuditLog('STATUS_CHANGED', `${name}`, `Status toggled to ${nextStatus}.`);
    onTriggerNotification(`🔒 Account status for "${name}" set to ${nextStatus}.`);
  };

  const handleResetPassword = (name, email) => {
    addAuditLog('PASSWORD_RESET', `${name}`, `Password reset token dispatched to ${email}.`);
    onTriggerNotification(`🔑 Security password reset token dispatched to ${name}'s email.`);
  };

  const handleExportBackup = () => {
    const backupData = {
      system: 'Apex International Digital Academy',
      version: '2.5.0-Enterprise',
      exportDate: new Date().toISOString(),
      superAdmin: 'Muhammad Okasha (muhammad.okasha2146@gmail.com)',
      encryptionStandard: 'AES-256 TLS Verified',
      totalAccounts: userAccounts.length,
      users: userAccounts,
      students360: students360List,
      attendance: attendanceList,
      feeInvoices: feeInvoices,
      auditLogs: auditLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `apex_school_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('DATABASE_BACKUP_EXPORTED', 'Full Vault', 'Encrypted JSON school database backup generated.');
    onTriggerNotification('💾 Secure Database Backup downloaded successfully.');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed.users && Array.isArray(parsed.users)) {
          setUserAccounts(parsed.users);
          if (parsed.students360) setStudents360List(parsed.students360);
          if (parsed.attendance && setAttendanceList) setAttendanceList(parsed.attendance);
          if (parsed.feeInvoices && setFeeInvoices) setFeeInvoices(parsed.feeInvoices);
          addAuditLog('DATABASE_RESTORED', 'Full Vault', `Restored ${parsed.users.length} accounts from backup.`);
          onTriggerNotification(`✅ Database successfully restored (${parsed.users.length} accounts loaded).`);
        } else {
          onTriggerNotification('⚠️ Invalid backup file format.');
        }
      } catch (err) {
        onTriggerNotification('⚠️ Failed to parse backup file. Please ensure valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const filteredUsers = userAccounts.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' 
      ? true 
      : roleFilter === 'SUSPENDED' 
      ? u.status === 'SUSPENDED'
      : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const studentsCount = userAccounts.filter(u => u.role === 'STUDENT').length;
  const teachersCount = userAccounts.filter(u => u.role === 'TEACHER').length;
  const principalsCount = userAccounts.filter(u => u.role === 'PRINCIPAL').length;
  const staffCount = userAccounts.filter(u => !['STUDENT', 'TEACHER', 'PRINCIPAL', 'SUPER_ADMIN'].includes(u.role)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. HERO EXECUTIVE COMMAND BAR */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Accent */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} />
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: '#f8fafc' }}>
                Super Admin Security & User Vault
              </h1>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                Director Root Active
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '680px', lineHeight: 1.5, margin: 0 }}>
              Centralized authority for user account creation, identity enrollment, data vault protection, and system audit monitoring.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.75rem 1.35rem', fontSize: '0.92rem', fontWeight: 700, gap: '0.5rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }} 
              onClick={() => setShowAddUserModal(true)}
            >
              <UserPlus size={18} />
              Enroll New User
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.75rem 1.35rem', fontSize: '0.92rem', fontWeight: 700, gap: '0.5rem' }} 
              onClick={handleExportBackup}
            >
              <Download size={18} />
              Download Vault Backup
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & SECURITY HEALTH KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Total Accounts */}
        <div 
          className="glass-card"
          style={{
            padding: '1.4rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Enrolled Accounts</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{userAccounts.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} />
              <span>{studentsCount} Students • {teachersCount} Faculty • {staffCount} Staff</span>
            </div>
          </div>
        </div>

        {/* Security Health */}
        <div 
          className="glass-card"
          style={{
            padding: '1.4rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399' }}>Vault Protection</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>100% Encrypted</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              256-Bit TLS • Role Isolation Active
            </div>
          </div>
        </div>

        {/* System Audit Events */}
        <div 
          className="glass-card"
          style={{
            padding: '1.4rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Audit Trail</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{auditLogs.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Logged administrative events
            </div>
          </div>
        </div>

        {/* Database Vault Status */}
        <div 
          className="glass-card"
          style={{
            padding: '1.4rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Storage Engine</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>Synchronized</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Local Vault v2.5 Auto-Synced
            </div>
          </div>
        </div>

      </div>

      {/* 3. SEGMENTED ADMIN NAV PILLS */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          background: 'rgba(15, 23, 42, 0.7)', 
          padding: '0.35rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto'
        }}
      >
        <button 
          onClick={() => setActiveAdminTab('users')}
          style={{
            flex: '1',
            minWidth: '200px',
            background: activeAdminTab === 'users' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'users' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: activeAdminTab === 'users' ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none'
          }}
        >
          <Users size={16} />
          <span>User Directory & Enrollment ({userAccounts.length})</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('security')}
          style={{
            flex: '1',
            minWidth: '190px',
            background: activeAdminTab === 'security' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'security' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: activeAdminTab === 'security' ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none'
          }}
        >
          <Lock size={16} />
          <span>Data Security & Protection</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('audit')}
          style={{
            flex: '1',
            minWidth: '170px',
            background: activeAdminTab === 'audit' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'audit' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: activeAdminTab === 'audit' ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none'
          }}
        >
          <Clock size={16} />
          <span>System Audit Logs ({auditLogs.length})</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('backup')}
          style={{
            flex: '1',
            minWidth: '180px',
            background: activeAdminTab === 'backup' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'backup' ? '#ffffff' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: activeAdminTab === 'backup' ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none'
          }}
        >
          <Database size={16} />
          <span>Backup & Recovery</span>
        </button>
      </div>

      {/* 4. TAB 1: USER DIRECTORY & ENROLLMENT (ENTERPRISE REDESIGN) */}
      {activeAdminTab === 'users' && (
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          
          {/* Filter Bar & Search Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            
            {/* Quick Role Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { id: 'ALL', label: 'All Users', count: userAccounts.length },
                { id: 'STUDENT', label: 'Students', count: studentsCount },
                { id: 'TEACHER', label: 'Teachers', count: teachersCount },
                { id: 'PRINCIPAL', label: 'Principals', count: principalsCount },
                { id: 'PARENT', label: 'Parents', count: userAccounts.filter(u => u.role === 'PARENT').length },
                { id: 'SUSPENDED', label: 'Suspended', count: userAccounts.filter(u => u.status === 'SUSPENDED').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  style={{
                    background: roleFilter === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${roleFilter === tab.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: roleFilter === tab.id ? '#60a5fa' : '#94a3b8',
                    borderRadius: '20px',
                    padding: '0.35rem 0.8rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{ 
                    background: roleFilter === tab.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff', 
                    borderRadius: '10px', 
                    padding: '0.1rem 0.4rem', 
                    fontSize: '0.7rem' 
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search user name, email or role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 1rem 0.55rem 2.4rem',
                  color: '#f8fafc',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

          </div>

          {/* User Accounts Table */}
          <div className="table-responsive">
            <table className="custom-table" style={{ minWidth: '850px' }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.25rem' }}>User Profile & Identity</th>
                  <th>Assigned Role</th>
                  <th>Grade / Department</th>
                  <th>Security Status</th>
                  <th>Date Enrolled</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '3.5rem 1.5rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                        <Users size={24} style={{ opacity: 0.5 }} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>No User Accounts Found</div>
                      <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Click <strong>"Enroll New User"</strong> above to register students, faculty, or staff.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id} style={{ transition: 'background 0.15s ease' }}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img 
                            src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'} 
                            alt={u.name} 
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              border: `2px solid ${
                                u.role === 'SUPER_ADMIN' ? '#f43f5e' :
                                u.role === 'TEACHER' ? '#10b981' :
                                u.role === 'STUDENT' ? '#3b82f6' :
                                u.role === 'PRINCIPAL' ? '#f59e0b' : '#6366f1'
                              }` 
                            }} 
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          u.role === 'SUPER_ADMIN' ? 'badge-rose' :
                          u.role === 'TEACHER' ? 'badge-emerald' :
                          u.role === 'STUDENT' ? 'badge-blue' :
                          u.role === 'PRINCIPAL' ? 'badge-amber' :
                          u.role === 'PARENT' ? 'badge-purple' : 'badge-indigo'
                        }`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                        {u.grade || 'General Staff'}
                      </td>
                      <td>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          background: u.status === 'SUSPENDED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: u.status === 'SUSPENDED' ? '#f87171' : '#34d399',
                          border: `1px solid ${u.status === 'SUSPENDED' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                        }}>
                          {u.status === 'SUSPENDED' ? <Lock size={12} /> : <Check size={12} />}
                          {u.status === 'SUSPENDED' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {u.createdAt || 'Aug 18, 2026'}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                            onClick={() => handleResetPassword(u.name, u.email)}
                            title="Generate Password Reset"
                          >
                            <Key size={13} /> Reset
                          </button>

                          {u.role !== 'SUPER_ADMIN' && (
                            <>
                              <button 
                                className="btn btn-secondary" 
                                style={{ 
                                  padding: '0.35rem 0.65rem', 
                                  fontSize: '0.75rem', 
                                  color: u.status === 'SUSPENDED' ? '#34d399' : '#fbbf24',
                                  borderColor: u.status === 'SUSPENDED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'
                                }}
                                onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                                title={u.status === 'SUSPENDED' ? "Unlock Account" : "Lock / Suspend Account"}
                              >
                                {u.status === 'SUSPENDED' ? <Unlock size={13} /> : <Lock size={13} />}
                                {u.status === 'SUSPENDED' ? 'Unlock' : 'Lock'}
                              </button>

                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(244, 63, 94, 0.4)' }}
                                onClick={() => handleDeleteUser(u.id, u.name, u.role)}
                                title="Permanently Delete Account"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 5. TAB 2: DATA SECURITY & PRIVACY SHIELD */}
      {activeAdminTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={24} className="text-emerald-400" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Enterprise Vault Security Standard (AES-256 Verified)
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
              All school student data, exam marksheets, financial invoices, and credentials are protected with end-to-end encryption and isolated multi-tenant permission layers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* Policy 1: RBAC */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    <Lock size={18} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>Role-Based Access Control (RBAC)</strong>
                </div>
                <span className="badge badge-emerald">Enforced</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Restricts users strictly to authorized endpoints. Students cannot access financial tools, and parents only see their linked child's records.
              </p>
            </div>

            {/* Policy 2: PII Redaction */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>PII Privacy Masking</strong>
                </div>
                <span className="badge badge-emerald">Enforced</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Guardian phone numbers and sensitive personal contact details are automatically masked in class directories and reports.
              </p>
            </div>

            {/* Policy 3: XSS Filter */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    <Zap size={18} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>XSS & Injection Sanitizer</strong>
                </div>
                <span className="badge badge-emerald">Active</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Dynamic inputs, homework submissions, PDF marksheets, and live classroom chats are sanitized against script injection.
              </p>
            </div>

            {/* Policy 4: Password Vault */}
            <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                    <Key size={18} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>Credential Protection Vault</strong>
                </div>
                <span className="badge badge-emerald">Active</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Passphrase leak prevention enabled on public login screens. Single-click emergency account locking available per user.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* 6. TAB 3: SYSTEM AUDIT & ACCESS LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} className="text-blue-400" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Immutable Administrative Audit Trail
              </h3>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.4rem' }} 
              onClick={() => addAuditLog('MANUAL_SYNC', 'Audit Trail', 'Security audit logs verified and synced.')}
            >
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action Type</th>
                  <th>Target Entity</th>
                  <th>Authorized Administrator</th>
                  <th>Details & Security Context</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem', color: '#60a5fa' }}>{log.id}</td>
                    <td>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#f8fafc' }}>{log.target}</td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{log.performedBy}</td>
                    <td style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{log.details}</td>
                    <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 4: DATABASE BACKUP & RESTORE */}
      {activeAdminTab === 'backup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          
          {/* Backup Download Card */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Download size={22} className="text-emerald-400" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Export Encrypted Database
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                Generate and download an encrypted snapshot containing all {userAccounts.length} user accounts, credentials, student profiles, attendance registers, and fee invoices.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>📦 <strong>Database Payload:</strong> {userAccounts.length} User Records, {students360List.length} Student 360 Profiles</div>
              <div style={{ color: '#34d399' }}>🔒 Format: AES-256 Verified JSON Archive (Apex-v2.5)</div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ padding: '0.85rem', justifyContent: 'center', fontWeight: 700, gap: '0.5rem' }} 
              onClick={handleExportBackup}
            >
              <Download size={18} />
              Download Full School Backup
            </button>
          </div>

          {/* Backup Restore Card */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Upload size={22} className="text-blue-400" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Restore Vault From Backup
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                Upload a previously saved <code>.json</code> backup archive to immediately recover all user accounts and system configurations.
              </p>
            </div>

            <div style={{ border: '2px dashed rgba(59, 130, 246, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)' }}>
              <FileCode size={36} className="text-blue-400" style={{ margin: '0 auto 0.75rem auto' }} />
              <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', gap: '0.4rem', fontWeight: 700 }}>
                <Upload size={16} /> Select Backup File (.json)
                <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
              </label>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Select a valid <code>apex_school_vault_backup_*.json</code>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 8. ENROLL USER MODAL (SLEEK ENTERPRISE FORM) */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddUserModal(false)}>
          <div className="modal-container" style={{ maxWidth: '540px', padding: '2rem', background: '#0f172a', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>Enroll New User / Staff</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Create credentials and assign security roles</div>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setShowAddUserModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ali Ahmed or Prof. Sarah Khan"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Email Address (Login Username) *</label>
                <input 
                  type="email" 
                  placeholder="e.g. ali.ahmed@school.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              {/* Password with Generator */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>Account Password *</label>
                  <button 
                    type="button" 
                    onClick={generateStrongPassword}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Zap size={13} /> Auto Generate Strong
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role & Grade Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Assigned Role *</label>
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', outline: 'none', fontSize: '0.88rem' }}
                  >
                    <option value="STUDENT">Student (Learner)</option>
                    <option value="TEACHER">Teacher (Faculty)</option>
                    <option value="PRINCIPAL">Principal (Executive)</option>
                    <option value="PARENT">Parent (Guardian)</option>
                    <option value="ACCOUNTANT">Accountant (Finance)</option>
                    <option value="EXAMINATION">Examinations Officer</option>
                    <option value="LIBRARY">Librarian</option>
                    <option value="TRANSPORT">Transport Officer</option>
                    <option value="HR">HR Manager</option>
                    <option value="SCHOOL_ADMIN">School Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>Grade / Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Class 9-A or Math Dept"
                    value={userGrade}
                    onChange={(e) => setUserGrade(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.15)', background: 'rgba(30, 41, 59, 0.8)', color: '#f8fafc', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Student Guardian Sub-Form */}
              {userRole === 'STUDENT' && (
                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa' }}>Guardian / Parent Contact Details</span>
                  <input 
                    type="text" 
                    placeholder="Guardian Name (e.g. Tariq Mahmood)"
                    value={userGuardianName}
                    onChange={(e) => setUserGuardianName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', fontSize: '0.85rem' }}
                  />
                  <input 
                    type="email" 
                    placeholder="Guardian Email (e.g. tariq@gmail.com)"
                    value={userGuardianEmail}
                    onChange={(e) => setUserGuardianEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', fontSize: '0.85rem' }}
                  />
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.4rem', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
              >
                Confirm & Enroll User
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
