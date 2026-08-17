import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  UserPlus, 
  TrendingUp,
  UserCheck,
  Search,
  Trash2,
  Key,
  ExternalLink,
  Bot,
  Video,
  Library,
  Bus,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  X,
  Plus
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
  onNavigateTab, 
  onChangeRole, 
  onOpenStudent360, 
  onTriggerNotification 
}) {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('STUDENT');
  const [userGrade, setUserGrade] = useState('Class 9-A');
  const [userGuardianName, setUserGuardianName] = useState('');
  const [userGuardianEmail, setUserGuardianEmail] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAddUserModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Universal Portals Directory for 1-Click Launch
  const allPortals = [
    { id: 'lms', label: 'LMS & Courses', desc: 'Curriculum & Lectures', icon: BookOpen, color: '#3b82f6', targetTab: 'lms', targetRole: 'TEACHER' },
    { id: 'classes', label: 'Attendance Roll Call', desc: 'Daily Student Records', icon: UserCheck, color: '#10b981', targetTab: 'classes', targetRole: 'TEACHER' },
    { id: 'gradebook', label: 'Gradebook & Marksheets', desc: 'Exams & PDF Exports', icon: FileSpreadsheet, color: '#f59e0b', targetTab: 'gradebook', targetRole: 'TEACHER' },
    { id: 'assessments', label: 'Assessments & Submissions', desc: 'Grading & Homework', icon: GraduationCap, color: '#6366f1', targetTab: 'assessments', targetRole: 'TEACHER' },
    { id: 'student-view', label: 'Student Portal View', desc: 'Gamification & Quizzes', icon: Users, color: '#8b5cf6', targetTab: 'dashboard', targetRole: 'STUDENT' },
    { id: 'parent-view', label: 'Parent & GPS Tracking', desc: 'Child 360 & Payments', icon: Users, color: '#ec4899', targetTab: 'fees', targetRole: 'PARENT' },
    { id: 'ai-hub', label: 'AI Education Engine 🤖', desc: 'AI Tutor & Quiz Gen', icon: Bot, color: '#a855f7', targetTab: 'ai-hub', targetRole: 'SUPER_ADMIN' },
    { id: 'live-class', label: 'Live Virtual Studio 🎥', desc: 'Broadcast & Whiteboard', icon: Video, color: '#ef4444', targetTab: 'live-class', targetRole: 'SUPER_ADMIN' },
    { id: 'fees', label: 'Fees & Accounts', desc: 'Finance & Invoices', icon: DollarSign, color: '#14b8a6', targetTab: 'fees', targetRole: 'ACCOUNTANT' },
    { id: 'library', label: 'Digital Library', desc: 'Books & Resources', icon: Library, color: '#0ea5e9', targetTab: 'library', targetRole: 'LIBRARY' },
    { id: 'transport', label: 'Transport & Fleet', desc: 'Buses & Routes', icon: Bus, color: '#f97316', targetTab: 'transport', targetRole: 'TRANSPORT' },
    { id: 'communication', label: 'Communication Hub', desc: 'Notices & Chat', icon: MessageSquare, color: '#3b82f6', targetTab: 'communication', targetRole: 'SUPER_ADMIN' }
  ];

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      onTriggerNotification('⚠️ Please provide Name, Email, and Password.');
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
      avatar: userRole === 'STUDENT' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      guardianName: userGuardianName || `${userName.split(' ')[0]}'s Guardian`,
      guardianEmail: userGuardianEmail || `${userEmail.split('@')[0]}.parent@gmail.com`
    };

    // 1. Add to user accounts
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

    setShowAddUserModal(false);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    onTriggerNotification(`✅ User "${userName}" (${userRole}) created successfully!`);
  };

  const handleDeleteUser = (id, name) => {
    setUserAccounts(prev => prev.filter(u => u.id !== id));
    setStudents360List(prev => prev.filter(s => s.id !== id));
    if (setAttendanceList) setAttendanceList(prev => prev.filter(a => a.id !== id));
    if (setFeeInvoices) setFeeInvoices(prev => prev.filter(f => f.studentId !== id));
    onTriggerNotification(`🗑️ Account for "${name}" has been deleted.`);
  };

  const handleResetPassword = (name) => {
    onTriggerNotification(`🔑 Password reset link dispatched to ${name}'s email.`);
  };

  const handleLaunchPortal = (portal) => {
    if (onChangeRole) onChangeRole(portal.targetRole);
    if (onNavigateTab) onNavigateTab(portal.targetTab);
    onTriggerNotification(`🚀 Switched to ${portal.label}`);
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
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
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
            <ShieldCheck size={26} className="text-emerald-400" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Super Administrator Control Hub</h2>
            <span className="badge badge-emerald">Executive Root</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Direct centralized access to all school portals, user credential management, and role enrollments.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }} 
          onClick={() => setShowAddUserModal(true)}
        >
          <UserPlus size={18} />
          Add & Manage Users
        </button>
      </div>

      {/* Clean Quick Stats Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{userAccounts.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Accounts</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{students360List.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enrolled Students</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{allPortals.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Integrated Portals</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>Active & Secure</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Status</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Universal Portals Quick Access Grid */}
      <div className="glass-card">
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <Sparkles size={20} className="text-amber-400" />
            <span>Universal School Portals Launchpad</span>
          </div>
          <span className="badge badge-indigo">Unrestricted Admin Access</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {allPortals.map(portal => {
            const Icon = portal.icon;
            return (
              <div 
                key={portal.id}
                onClick={() => handleLaunchPortal(portal)}
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = portal.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${portal.color}20`, color: portal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{portal.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{portal.desc}</div>
                </div>
                <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: User Accounts Directory & Management Table */}
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="card-title">
            <Users size={20} className="text-emerald-400" />
            <span>All System User Accounts & Roles</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search user name or email..." 
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
                  minWidth: '220px'
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
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="TEACHER">Teachers</option>
              <option value="STUDENT">Students</option>
              <option value="PARENT">Parents</option>
              <option value="PRINCIPAL">Principal</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="EXAMINATION">Examinations</option>
              <option value="LIBRARY">Library</option>
              <option value="TRANSPORT">Transport</option>
              <option value="HR">HR Staff</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Assigned Role</th>
                <th>Grade / Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No user accounts found matching your filter. Click <strong>"Add & Manage Users"</strong> to create a new user.
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
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }} 
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
                      {u.grade || 'Staff Department'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {u.role === 'STUDENT' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              const found = students360List.find(s => s.id === u.id || s.name === u.name) || {
                                id: u.id,
                                name: u.name,
                                grade: u.grade || 'Class 9-A',
                                attendancePct: 100,
                                gpa: 3.8,
                                overallGrade: 'A',
                                badges: ['Active Student'],
                                weakTopics: []
                              };
                              onOpenStudent360(found);
                            }}
                          >
                            <UserCheck size={13} /> 360° Profile
                          </button>
                        )}
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleResetPassword(u.name)}
                          title="Reset Password"
                        >
                          <Key size={13} /> Reset
                        </button>
                        {u.role !== 'SUPER_ADMIN' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Delete User"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddUserModal(false)}>
          <div className="modal-container" style={{ maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} className="text-emerald-400" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enroll New User / Student</h3>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setShowAddUserModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ali Ahmed or Prof. Sarah"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. ali.ahmed@school.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Security Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Assigned Role</label>
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="PARENT">Parent</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="SCHOOL_ADMIN">School Admin</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="EXAMINATION">Examinations</option>
                    <option value="LIBRARY">Library</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="HR">HR Staff</option>
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Guardian / Parent Information</span>
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
                Confirm & Create Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
