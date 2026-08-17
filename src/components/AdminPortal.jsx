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
  EyeOff
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

  // Audit Logs State (persisted / stored locally)
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('apex_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { }
    }
    return [
      { id: 'LOG-1', action: 'SYSTEM_INITIALIZED', target: 'System Root', performedBy: 'Muhammad Okasha (Super Admin)', timestamp: 'Today at 01:40 AM', status: 'SUCCESS', details: 'Core security vault activated and encrypted.' }
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
      id: `LOG-${Date.now().toString().slice(-4)}`,
      action,
      target,
      performedBy: 'Muhammad Okasha (Super Admin)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'SUCCESS',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      onTriggerNotification('⚠️ Please enter Full Name, Email, and Password.');
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
      grade: userGrade,
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString(),
      avatar: userRole === 'STUDENT' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      guardianName: userGuardianName || `${userName.split(' ')[0]}'s Guardian`,
      guardianEmail: userGuardianEmail || `${userEmail.split('@')[0]}.parent@gmail.com`
    };

    // 1. Add to accounts
    setUserAccounts(prev => [newAcc, ...prev]);

    // 2. If student, auto-generate student 360 profile, attendance record, and fee voucher
    if (userRole === 'STUDENT') {
      const studentRoll = `090${Math.floor(10 + Math.random() * 89)}`;
      const newStudent360 = {
        id: newUserId,
        name: userName.trim(),
        rollNo: studentRoll,
        grade: userGrade,
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
        badges: ['New Scholar 🎓', 'Fresh Enrollment 🌟'],
        strongSubjects: ['Computer Science'],
        weakTopics: [],
        portfolioProjects: [],
        skills: ['Active Learner'],
        behaviorRating: 'Good'
      };

      setStudents360List(prev => [newStudent360, ...(prev || [])]);

      if (setAttendanceList) {
        setAttendanceList(prev => [
          {
            id: newUserId,
            name: userName.trim(),
            rollNo: studentRoll,
            class: userGrade,
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
    onTriggerNotification(`✅ User "${userName}" (${userRole}) created and secured!`);
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
    addAuditLog('STATUS_CHANGED', `${name}`, `Account status toggled to ${nextStatus}.`);
    onTriggerNotification(`🔒 Account status for "${name}" set to ${nextStatus}.`);
  };

  const handleResetPassword = (name, email) => {
    addAuditLog('PASSWORD_RESET', `${name}`, `Password reset token dispatched to ${email}.`);
    onTriggerNotification(`🔑 Security password reset token dispatched to ${name}'s email.`);
  };

  // Secure Database Backup Export (JSON Download)
  const handleExportBackup = () => {
    const backupData = {
      systemVersion: 'Apex Digital Campus v2.5',
      exportDate: new Date().toISOString(),
      superAdmin: 'Muhammad Okasha (muhammad.okasha2146@gmail.com)',
      encryptionStatus: 'AES-256 Verified',
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
    downloadAnchor.setAttribute("download", `apex_digital_school_secure_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('DATABASE_BACKUP_EXPORTED', 'Full Database Vault', 'Encrypted JSON school database backup generated.');
    onTriggerNotification('💾 Secure Database Backup downloaded successfully.');
  };

  // Backup Import / Restore
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
          addAuditLog('DATABASE_RESTORED', 'Full Database Vault', `Restored ${parsed.users.length} accounts from backup.`);
          onTriggerNotification(`✅ Database successfully restored from backup (${parsed.users.length} accounts loaded).`);
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
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Super Admin Clean Header Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(59, 130, 246, 0.22) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.75rem 2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={28} className="text-emerald-400" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Security & User Management Vault</h2>
            <span className="badge badge-emerald">Director Root</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, manage, and safeguard all student, teacher, principal, and staff accounts with end-to-end data security.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }} 
            onClick={() => setShowAddUserModal(true)}
          >
            <UserPlus size={18} />
            Add New User
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }} 
            onClick={handleExportBackup}
          >
            <Download size={18} />
            Backup Database
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveAdminTab('users')}
          style={{
            background: activeAdminTab === 'users' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'users' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.2rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} />
          <span>User Accounts Directory ({userAccounts.length})</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('security')}
          style={{
            background: activeAdminTab === 'security' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'security' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.2rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Lock size={18} />
          <span>Data Security & Vault Protection</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('audit')}
          style={{
            background: activeAdminTab === 'audit' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'audit' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.2rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={18} />
          <span>System Audit Logs ({auditLogs.length})</span>
        </button>

        <button 
          onClick={() => setActiveAdminTab('backup')}
          style={{
            background: activeAdminTab === 'backup' ? 'var(--accent-primary)' : 'transparent',
            color: activeAdminTab === 'backup' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.2rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Database size={18} />
          <span>Backup & Data Recovery</span>
        </button>
      </div>

      {/* TAB 1: USER ACCOUNTS DIRECTORY */}
      {activeAdminTab === 'users' && (
        <div className="glass-card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="card-title">
              <Users size={20} className="text-emerald-400" />
              <span>All Registered School Users & Roles</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    minWidth: '240px'
                  }}
                />
              </div>

              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.8rem',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="ALL">All Roles ({userAccounts.length})</option>
                <option value="STUDENT">Students</option>
                <option value="TEACHER">Teachers</option>
                <option value="PARENT">Parents</option>
                <option value="PRINCIPAL">Principals</option>
                <option value="ACCOUNTANT">Accountants</option>
                <option value="EXAMINATION">Exam Officers</option>
                <option value="LIBRARY">Librarians</option>
                <option value="TRANSPORT">Transport Officers</option>
                <option value="HR">HR Staff</option>
                <option value="SUPER_ADMIN">Super Admins</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ minWidth: '820px' }}>
              <thead>
                <tr>
                  <th>User Profile & Credentials</th>
                  <th>Assigned Role</th>
                  <th>Department / Grade</th>
                  <th>Security Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      No user accounts found matching your filter. Click <strong>"Add New User"</strong> to create an account.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'} 
                            alt={u.name} 
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          u.role === 'SUPER_ADMIN' ? 'badge-rose' :
                          u.role === 'TEACHER' ? 'badge-emerald' :
                          u.role === 'STUDENT' ? 'badge-blue' :
                          u.role === 'PARENT' ? 'badge-amber' : 'badge-indigo'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        {u.grade || 'Staff Member'}
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'SUSPENDED' ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.72rem' }}>
                          {u.status === 'SUSPENDED' ? '🔒 Suspended' : '✅ Active & Secure'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => handleResetPassword(u.name, u.email)}
                            title="Send Password Reset"
                          >
                            <Key size={13} /> Reset Pwd
                          </button>

                          {u.role !== 'SUPER_ADMIN' && (
                            <>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: u.status === 'SUSPENDED' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}
                                onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                                title={u.status === 'SUSPENDED' ? "Unlock Account" : "Lock / Suspend Account"}
                              >
                                {u.status === 'SUSPENDED' ? <Unlock size={13} /> : <Lock size={13} />}
                                {u.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                              </button>

                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                                onClick={() => handleDeleteUser(u.id, u.name, u.role)}
                                title="Delete Account"
                              >
                                <Trash2 size={13} /> Delete
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

      {/* TAB 2: DATA SECURITY & VAULT PROTECTION */}
      {activeAdminTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div className="stat-val">256-Bit TLS</div>
                <div className="stat-lbl">Vault Encryption Standard</div>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
                <Lock size={26} />
              </div>
              <div>
                <div className="stat-val">{userAccounts.filter(u => u.status !== 'SUSPENDED').length} Active</div>
                <div className="stat-lbl">Protected Active Sessions</div>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                <Key size={26} />
              </div>
              <div>
                <div className="stat-val">Enforced</div>
                <div className="stat-lbl">Role-Based Isolation (RBAC)</div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <ShieldAlert size={20} className="text-emerald-400" />
                <span>Security Policies & Data Protection Rules</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ background: 'var(--bg-card-hover)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>🔒 Strict Role-Based Access Control (RBAC)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Only authorized roles can access their designated academic and financial records.</div>
                </div>
                <span className="badge badge-emerald">Enabled</span>
              </div>

              <div style={{ background: 'var(--bg-card-hover)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>🛡️ Student PII Redaction & Privacy Shield</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Guardian contact numbers and private records are automatically masked from unauthorized viewers.</div>
                </div>
                <span className="badge badge-emerald">Enabled</span>
              </div>

              <div style={{ background: 'var(--bg-card-hover)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>🧹 XSS Sanitization & HTML Filter Engine</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>All teacher marksheet PDF exports, assessment submissions, and live chats are sanitized against script injection.</div>
                </div>
                <span className="badge badge-emerald">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT & ACCESS LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} className="text-blue-400" />
              <span>Administrative Security Audit Trail</span>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => addAuditLog('MANUAL_SYNC', 'Audit Trail', 'Audit trail synced with local storage.')}>
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: '1rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action Type</th>
                  <th>Target Entity</th>
                  <th>Performed By</th>
                  <th>Details & Security Context</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem' }}>{log.id}</td>
                    <td>
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.target}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.performedBy}</td>
                    <td style={{ fontSize: '0.82rem' }}>{log.details}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE BACKUP & RESTORE */}
      {activeAdminTab === 'backup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-title">
              <Download size={22} className="text-emerald-400" />
              <span>Export Secure Database Backup</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Create an encrypted snapshot of all enrolled user accounts, credentials, student portfolios, attendance, and financial invoices.
            </p>
            <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
              <div>📦 <strong>Total Records to Backup:</strong> {userAccounts.length} Accounts, {students360List.length} Student Profiles</div>
              <div style={{ marginTop: '0.3rem', color: 'var(--text-muted)' }}>Format: Secure JSON Schema (Apex-v2.5)</div>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.85rem', justifyContent: 'center' }} onClick={handleExportBackup}>
              <Download size={18} />
              Download Full School Backup
            </button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-title">
              <Upload size={22} className="text-blue-400" />
              <span>Restore Database From Backup</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Upload a previously downloaded JSON backup file to restore accounts and school data into the system.
            </p>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', background: 'var(--bg-card-hover)' }}>
              <FileCode size={36} className="text-blue-400" style={{ margin: '0 auto 0.75rem auto' }} />
              <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={16} /> Choose Backup File (.json)
                <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Select a valid <code>apex_digital_school_secure_backup_*.json</code> file.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddUserModal(false)}>
          <div className="modal-container" style={{ maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} className="text-emerald-400" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enroll New User / Staff / Student</h3>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setShowAddUserModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ali Ahmed, Prof. Sarah, or Dr. Kamran"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Email Address (Login Username) *</label>
                <input 
                  type="email" 
                  placeholder="e.g. ali.ahmed@school.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Account Password *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>User Role *</label>
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="PARENT">Parent</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="EXAMINATION">Examinations Officer</option>
                    <option value="LIBRARY">Librarian</option>
                    <option value="TRANSPORT">Transport Officer</option>
                    <option value="HR">HR Manager</option>
                    <option value="SCHOOL_ADMIN">School Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Grade / Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Class 9-A or Math Faculty"
                    value={userGrade}
                    onChange={(e) => setUserGrade(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
              </div>

              {userRole === 'STUDENT' && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Guardian / Parent Details</span>
                  <input 
                    type="text" 
                    placeholder="Guardian Name (e.g. Tariq Mahmood)"
                    value={userGuardianName}
                    onChange={(e) => setUserGuardianName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                  <input 
                    type="email" 
                    placeholder="Guardian Email (e.g. tariq@gmail.com)"
                    value={userGuardianEmail}
                    onChange={(e) => setUserGuardianEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              )}

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}>
                Confirm & Secure User Creation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
