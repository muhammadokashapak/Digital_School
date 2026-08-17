import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_SCHOOL_DATA } from './mockData';
import { loadState, saveState } from './utils/storage';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentPortal from './components/StudentPortal';
import DashboardOverview from './components/TeacherPortal/DashboardOverview';
import MyClasses from './components/TeacherPortal/MyClasses';
import CourseManager from './components/TeacherPortal/CourseManager';
import AssessmentManager from './components/TeacherPortal/AssessmentManager';
import GradebookAnalytics from './components/TeacherPortal/GradebookAnalytics';
import AdminPortal from './components/AdminPortal';
import ParentPortal from './components/ParentPortal';
import AccountantPortal from './components/AccountantPortal';
import LmsPortal from './components/LmsPortal';
import ExamPortal from './components/ExamPortal';
import AiHub from './components/AiHub';
import LiveClassroom from './components/LiveClassroom';
import DigitalLibrary from './components/DigitalLibrary';
import TransportPortal from './components/TransportPortal';
import HrPortal from './components/HrPortal';
import CommunicationHub from './components/CommunicationHub';
import ReportCardModal from './components/ReportCardModal';
import QuizModal from './components/QuizModal';
import Student360Modal from './components/Student360Modal';
import NotificationModal from './components/NotificationModal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const INITIAL_ACCOUNTS = [
  { 
    id: 'USR-ADMIN-1', 
    name: 'Muhammad Okasha', 
    email: 'muhammad.okasha2146@gmail.com', 
    role: 'SUPER_ADMIN', 
    grade: 'Director & Super Administrator', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 
    password: 'greenpakistan2' 
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'N1', title: 'System Initialized Successfully', text: 'Welcome Director Muhammad Okasha. You can now configure school settings and enroll students.', category: 'ACADEMIC', priority: 'HIGH', read: false, time: 'Just now' }
];

// Strict Role-Based Access Control Mapping for Tabs
const TAB_PERMISSIONS = {
  dashboard: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'EXAMINATION', 'LIBRARY', 'TRANSPORT', 'HR'],
  classes: ['TEACHER', 'SUPER_ADMIN'],
  courses: ['TEACHER', 'SUPER_ADMIN'],
  assessments: ['TEACHER', 'SUPER_ADMIN'],
  gradebook: ['TEACHER', 'SUPER_ADMIN'],
  lms: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'TEACHER'],
  attendance: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'],
  exams: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'EXAMINATION'],
  fees: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PARENT'],
  'ai-hub': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT'],
  'live-class': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'],
  library: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'STUDENT', 'TEACHER', 'LIBRARY'],
  transport: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT', 'TRANSPORT'],
  hr: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'HR'],
  communication: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'EXAMINATION', 'LIBRARY', 'TRANSPORT', 'HR'],
  management: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Persisted Core State
  const [userAccounts, setUserAccounts] = useState(() => loadState('userAccounts', INITIAL_ACCOUNTS));
  const [students360, setStudents360] = useState(() => loadState('students360', INITIAL_SCHOOL_DATA.students360));
  const [attendanceList, setAttendanceList] = useState(() => loadState('attendanceList', INITIAL_SCHOOL_DATA.attendance));
  const [feeInvoices, setFeeInvoices] = useState(() => loadState('feeInvoices', INITIAL_SCHOOL_DATA.feeInvoices));
  const [notifications, setNotifications] = useState(() => loadState('notifications', INITIAL_NOTIFICATIONS));

  // Sync to storage on state changes
  useEffect(() => { saveState('userAccounts', userAccounts); }, [userAccounts]);
  useEffect(() => { saveState('students360', students360); }, [students360]);
  useEffect(() => { saveState('attendanceList', attendanceList); }, [attendanceList]);
  useEffect(() => { saveState('feeInvoices', feeInvoices); }, [feeInvoices]);
  useEffect(() => { saveState('notifications', notifications); }, [notifications]);

  // Auth & Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserAccount, setCurrentUserAccount] = useState(null);
  const [currentRole, setCurrentRole] = useState('SUPER_ADMIN');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiHubSubTab, setAiHubSubTab] = useState('tutor');

  // School Data State with Live Sync
  const [schoolData, setSchoolData] = useState(() => ({
    ...INITIAL_SCHOOL_DATA,
    students360: INITIAL_SCHOOL_DATA.students360
  }));

  useEffect(() => {
    setSchoolData(prev => ({
      ...prev,
      students360,
      attendance: attendanceList,
      feeInvoices,
      activeUser: currentUserAccount || prev.activeUser
    }));
  }, [students360, attendanceList, feeInvoices, currentUserAccount]);

  const handleNavigateTab = (tab, subTab = null) => {
    setActiveTab(tab);
    if (subTab && tab === 'ai-hub') {
      setAiHubSubTab(subTab);
    }
  };
  
  // Modals & Toast State
  const [showReportCard, setShowReportCard] = useState(false);
  const [activeReportStudent, setActiveReportStudent] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeStudent360, setActiveStudent360] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Apply Theme Data Attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handle Login Event
  const handleLogin = (account) => {
    setCurrentUserAccount(account);
    setCurrentRole(account.role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    triggerToast(`🎉 Welcome back, ${account.name}! Logged in as ${account.role}.`);
  };

  // Handle New Account Self-Registration Event
  const handleRegisterAccount = (newAccount) => {
    let parentAccountCreated = null;
    let studentId = newAccount.id;

    if (newAccount.role === 'STUDENT') {
      const parentName = newAccount.guardianName || `${newAccount.name.split(' ')[0]}'s Parent`;
      const parentEmail = newAccount.guardianEmail || `${newAccount.email.split('@')[0]}.parent@gmail.com`;

      const newStudent360 = {
        id: studentId,
        name: newAccount.name,
        rollNo: `${Math.floor(10000 + Math.random() * 90000)}`,
        grade: newAccount.grade || 'Class 9-A',
        avatar: newAccount.avatar,
        guardian: parentName,
        guardianEmail: parentEmail,
        guardianPhone: '+92 300 0000000',
        attendancePct: 100.0,
        gpa: 4.0,
        overallGrade: 'A+',
        riskLevel: 'LOW',
        riskReasons: [],
        learningStreak: 1,
        xpPoints: 100,
        badges: ['New Student 🎓'],
        strongSubjects: ['General Science'],
        weakTopics: [],
        teacherRemarks: 'Newly registered student.',
        portfolioProjects: ['Introductory Science Project'],
        skills: ['Eager Learner'],
        behaviorRating: 'Good'
      };

      parentAccountCreated = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: parentName,
        email: parentEmail,
        password: newAccount.password || 'password123',
        role: 'PARENT',
        grade: `Guardian of ${newAccount.name}`,
        linkedStudentId: studentId,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };

      // Add student to students360
      setStudents360(prev => [newStudent360, ...(prev || [])]);

      // Add student to attendance list with 100%
      setAttendanceList(prev => [
        {
          id: studentId,
          name: newAccount.name,
          rollNo: newStudent360.rollNo,
          class: newAccount.grade || 'Class 9-A',
          status: 'PRESENT',
          presentDays: 20,
          totalDays: 20,
          percentage: 100.0
        },
        ...(prev || [])
      ]);

      // Add initial fee invoice for the student
      setFeeInvoices(prev => [
        {
          id: `INV-${Date.now().toString().slice(-4)}`,
          studentId: studentId,
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

    setUserAccounts(prev => {
      const list = [newAccount, ...prev];
      if (parentAccountCreated) list.unshift(parentAccountCreated);
      return list;
    });

    setCurrentUserAccount(newAccount);
    setCurrentRole(newAccount.role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');

    if (parentAccountCreated) {
      triggerToast(`✨ Registered ${newAccount.name}! Linked Parent account created (${parentAccountCreated.email}).`);
    } else {
      triggerToast(`✨ Account created successfully for ${newAccount.name} (${newAccount.role})! Logged in.`);
    }
  };

  // Handle AdminPortal student account registration
  const handleAdminAddStudent = (newStudentObj, parentName, parentEmail) => {
    const studentUserAcc = {
      id: `USR-${newStudentObj.id}`,
      name: newStudentObj.name,
      email: `${newStudentObj.name.toLowerCase().replace(/\s+/g, '')}@apexdigital.edu`,
      password: 'password123',
      role: 'STUDENT',
      grade: newStudentObj.grade,
      guardianName: parentName,
      guardianEmail: parentEmail,
      avatar: newStudentObj.avatar
    };

    const parentUserAcc = {
      id: `USR-P-${newStudentObj.id}`,
      name: parentName,
      email: parentEmail,
      password: 'password123',
      role: 'PARENT',
      grade: `Guardian of ${newStudentObj.name}`,
      linkedStudentId: newStudentObj.id,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };

    setUserAccounts(prev => [studentUserAcc, parentUserAcc, ...prev]);

    // Also add to attendance
    setAttendanceList(prev => [
      {
        id: newStudentObj.id,
        name: newStudentObj.name,
        rollNo: newStudentObj.rollNo,
        class: newStudentObj.grade,
        status: 'PRESENT',
        presentDays: 20,
        totalDays: 20,
        percentage: 100.0
      },
      ...(prev || [])
    ]);

    // Add fee invoice
    setFeeInvoices(prev => [
      {
        id: `INV-${Date.now().toString().slice(-4)}`,
        studentId: newStudentObj.id,
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
  };

  // Handle Logout Event
  const handleLogout = () => {
    setIsAuthenticated(false);
    triggerToast('Logged out of Digital School System.');
  };

  // Handle Role Change -> Reset Active Tab to 'dashboard'
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    setActiveTab('dashboard');
    triggerToast(`Active Role switched to ${newRole}.`);
  };

  const triggerToast = (msg) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Resolve Student Profile for Student 360° Modal
  const resolveCurrentStudentProfile = () => {
    if (!currentUserAccount) return students360[0];
    if (currentRole === 'STUDENT') {
      return students360.find(s => s.id === currentUserAccount.id || s.name === currentUserAccount.name) || students360[0];
    }
    if (currentRole === 'PARENT') {
      return students360.find(s => s.id === currentUserAccount.linkedStudentId || s.guardianEmail === currentUserAccount.email) || students360[0];
    }
    return students360[0];
  };

  // Render Portal View based on activeTab & currentRole with strict RBAC enforcement
  const renderContent = () => {
    // Shared Teacher Profile Setup
    const teacherProfile = currentRole === 'TEACHER' ? 
      (schoolData.teachersProfile?.find(t => t.id === currentUserAccount?.id) || schoolData.teachersProfile?.[0]) : null;

    // RBAC Security Check
    const allowedRoles = TAB_PERMISSIONS[activeTab] || [];
    if (activeTab !== 'dashboard' && !allowedRoles.includes(currentRole)) {
      return (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            color: 'var(--accent-rose)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Your active role (<strong>{currentRole}</strong>) is not authorized to access the <strong>{activeTab}</strong> workspace.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')} style={{ margin: '0 auto' }}>
            <ArrowLeft size={16} /> Return to My Portal Dashboard
          </button>
        </div>
      );
    }

    if (currentRole === 'TEACHER') {
      if (activeTab === 'dashboard') return <DashboardOverview teacherProfile={teacherProfile} schoolData={schoolData} onChangeTab={handleNavigateTab} onTriggerNotification={triggerToast} />;
      if (activeTab === 'classes') return <MyClasses teacherProfile={teacherProfile} attendanceList={attendanceList} setAttendanceList={setAttendanceList} onOpenStudent360={(st) => setActiveStudent360(st)} onTriggerNotification={triggerToast} />;
      if (activeTab === 'courses') return <CourseManager teacherProfile={teacherProfile} schoolData={schoolData} onTriggerNotification={triggerToast} />;
      if (activeTab === 'assessments') return <AssessmentManager teacherProfile={teacherProfile} onTriggerNotification={triggerToast} onChangeTab={handleNavigateTab} />;
      if (activeTab === 'gradebook') return <GradebookAnalytics teacherProfile={teacherProfile} onTriggerNotification={triggerToast} />;
    }

    if (activeTab === 'lms') {
      return <LmsPortal schoolData={schoolData} currentRole={currentRole} onStartQuiz={(qId) => setActiveQuizId(qId)} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'attendance') {
      return (
        <AdminPortal 
          schoolData={schoolData} 
          userAccounts={userAccounts} 
          setUserAccounts={setUserAccounts} 
          students360List={students360} 
          setStudents360List={setStudents360} 
          attendanceList={attendanceList}
          setAttendanceList={setAttendanceList}
          feeInvoices={feeInvoices}
          setFeeInvoices={setFeeInvoices}
          onNavigateTab={(tab) => setActiveTab(tab)} 
          onChangeRole={(role) => setCurrentRole(role)} 
          onOpenStudent360={(st) => setActiveStudent360(st)} 
          onTriggerNotification={triggerToast} 
        />
      );
    }
    if (activeTab === 'exams') {
      return <ExamPortal schoolData={schoolData} onOpenReportCard={(st) => { setActiveReportStudent(st || resolveCurrentStudentProfile()); setShowReportCard(true); }} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'fees') {
      return <ParentPortal schoolData={schoolData} currentUserAccount={currentUserAccount} feeInvoices={feeInvoices} setFeeInvoices={setFeeInvoices} onTriggerNotification={triggerToast} onOpenReportCard={() => { setActiveReportStudent(resolveCurrentStudentProfile()); setShowReportCard(true); }} onOpenStudent360={(st) => setActiveStudent360(st || resolveCurrentStudentProfile())} />;
    }
    if (activeTab === 'ai-hub') {
      return <AiHub schoolData={schoolData} teacherProfile={teacherProfile} currentRole={currentRole} initialTab={aiHubSubTab} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'live-class') {
      return <LiveClassroom schoolData={schoolData} currentUserAccount={currentUserAccount} teacherProfile={teacherProfile} onLeaveStudio={() => setActiveTab('dashboard')} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'library') {
      return <DigitalLibrary schoolData={schoolData} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'transport') {
      return <TransportPortal schoolData={schoolData} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'hr') {
      return <HrPortal schoolData={schoolData} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'communication') {
      return <CommunicationHub schoolData={schoolData} currentRole={currentRole} onTriggerNotification={triggerToast} />;
    }
    if (activeTab === 'management') {
      return (
        <AdminPortal 
          schoolData={schoolData} 
          userAccounts={userAccounts} 
          setUserAccounts={setUserAccounts} 
          students360List={students360} 
          setStudents360List={setStudents360} 
          attendanceList={attendanceList}
          setAttendanceList={setAttendanceList}
          feeInvoices={feeInvoices}
          setFeeInvoices={setFeeInvoices}
          onNavigateTab={(tab) => setActiveTab(tab)} 
          onChangeRole={(role) => setCurrentRole(role)} 
          onOpenStudent360={(st) => setActiveStudent360(st)} 
          onTriggerNotification={triggerToast} 
        />
      );
    }

    // Default 'dashboard' view per Role
    switch (currentRole) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
      case 'PRINCIPAL':
        return (
          <AdminPortal 
            schoolData={schoolData} 
            userAccounts={userAccounts} 
            setUserAccounts={setUserAccounts} 
            students360List={students360} 
            setStudents360List={setStudents360} 
            attendanceList={attendanceList}
            setAttendanceList={setAttendanceList}
            feeInvoices={feeInvoices}
            setFeeInvoices={setFeeInvoices}
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onChangeRole={(role) => setCurrentRole(role)} 
            onOpenStudent360={(st) => setActiveStudent360(st)} 
            onTriggerNotification={triggerToast} 
          />
        );
      case 'TEACHER':
        return <DashboardOverview teacherProfile={teacherProfile} schoolData={schoolData} onChangeTab={setActiveTab} onTriggerNotification={triggerToast} />;
      case 'PARENT':
        return <ParentPortal schoolData={schoolData} currentUserAccount={currentUserAccount} feeInvoices={feeInvoices} setFeeInvoices={setFeeInvoices} onTriggerNotification={triggerToast} onOpenReportCard={() => { setActiveReportStudent(resolveCurrentStudentProfile()); setShowReportCard(true); }} onOpenStudent360={(st) => setActiveStudent360(st || resolveCurrentStudentProfile())} />;
      case 'ACCOUNTANT':
        return <AccountantPortal feeInvoices={feeInvoices} setFeeInvoices={setFeeInvoices} onTriggerNotification={triggerToast} />;
      case 'EXAMINATION':
        return <ExamPortal schoolData={schoolData} onOpenReportCard={(st) => { setActiveReportStudent(st || resolveCurrentStudentProfile()); setShowReportCard(true); }} onTriggerNotification={triggerToast} />;
      case 'LIBRARY':
        return <DigitalLibrary schoolData={schoolData} onTriggerNotification={triggerToast} />;
      case 'TRANSPORT':
        return <TransportPortal schoolData={schoolData} onTriggerNotification={triggerToast} />;
      case 'HR':
        return <HrPortal schoolData={schoolData} onTriggerNotification={triggerToast} />;
      case 'STUDENT':
      default:
        return <StudentPortal schoolData={schoolData} currentUserAccount={currentUserAccount} feeInvoices={feeInvoices} attendanceList={attendanceList} onNavigate={(tab) => setActiveTab(tab)} onStartQuiz={(qId) => setActiveQuizId(qId)} onOpenReportCard={() => { setActiveReportStudent(resolveCurrentStudentProfile()); setShowReportCard(true); }} onOpenStudent360={() => setActiveStudent360(resolveCurrentStudentProfile())} />;
    }
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        schoolData={schoolData}
        userAccounts={userAccounts}
        onLogin={handleLogin}
        onRegisterAccount={handleRegisterAccount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onTriggerNotification={triggerToast}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <Header 
        schoolData={schoolData}
        currentUserAccount={currentUserAccount}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        notificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout with Sidebar & Content Area */}
      <div className="main-layout">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
        />

        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {/* Toast Notification Alert Overlay */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-primary)',
          color: 'var(--text-main)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Student 360° Profile Modal */}
      {activeStudent360 && (
        <Student360Modal 
          student={activeStudent360} 
          currentRole={currentRole}
          onClose={() => setActiveStudent360(null)} 
          onTriggerNotification={triggerToast} 
        />
      )}

      {/* Report Card Modal */}
      {showReportCard && (
        <ReportCardModal 
          schoolData={schoolData} 
          student={activeReportStudent || resolveCurrentStudentProfile()}
          onClose={() => { setShowReportCard(false); setActiveReportStudent(null); }} 
          onTriggerNotification={triggerToast} 
        />
      )}

      {/* Quiz Taker Modal */}
      {activeQuizId && (
        <QuizModal 
          quizId={activeQuizId}
          schoolData={schoolData}
          currentUserAccount={currentUserAccount}
          onClose={() => setActiveQuizId(null)}
          onTriggerNotification={triggerToast}
        />
      )}

      {/* Professional Notification Bar Drawer */}
      <NotificationModal 
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        onTriggerNotification={triggerToast}
      />
    </div>
  );
}
