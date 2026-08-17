import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Award, 
  Flame,
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle, 
  FileText, 
  Sparkles,
  UserCheck,
  TrendingUp,
  CreditCard,
  Calendar
} from 'lucide-react';

export default function StudentPortal({ 
  schoolData, 
  currentUserAccount,
  feeInvoices = [],
  attendanceList = [],
  onNavigate, 
  onStartQuiz, 
  onOpenReportCard, 
  onOpenStudent360 
}) {
  const { activeUser, timetable = [], lms = [], examResults, students360 = [] } = schoolData;
  
  // Safe student profile resolution based on logged-in account
  const activeStudentId = currentUserAccount?.id || activeUser?.id;
  const studentProfile = students360.find(s => s.id === activeStudentId || s.name === currentUserAccount?.name) || {
    id: activeStudentId || 'S101',
    name: currentUserAccount?.name || activeUser?.name || 'Student',
    grade: currentUserAccount?.grade || 'Class 9-A',
    attendancePct: 94.5,
    gpa: 3.8,
    overallGrade: 'A',
    learningStreak: 5,
    xpPoints: 420,
    badges: ['Science Whiz 🔬', 'Quick Learner ⚡', 'Perfect Attendance 🎯'],
    weakTopics: ['Cramer\'s Rule Determinants'],
    portfolioProjects: ['Science Project'],
    skills: ['Active Learner']
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const badges = studentProfile.badges || [];
  const weakTopic = (studentProfile.weakTopics && studentProfile.weakTopics.length > 0) 
    ? studentProfile.weakTopics[0] 
    : 'None! Great progress across all subjects 🎉';

  const studentLevel = Math.max(1, Math.floor((studentProfile.xpPoints || 100) / 100));

  // Find attendance record for this student
  const studentAttendance = attendanceList.find(a => a.id === studentProfile.id || a.name === studentProfile.name);
  const attendancePct = studentAttendance ? studentAttendance.percentage : (studentProfile.attendancePct || 95);

  // Find fee invoice for this student
  const studentInvoice = feeInvoices.find(f => f.studentId === studentProfile.id) || feeInvoices[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Welcome Banner with Gamification XP & Streak */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{greeting}, {currentUserAccount?.name || activeUser?.name || 'Student'} 👋</h2>
            <span className="badge badge-emerald">{studentProfile.grade || 'Class 9-A'}</span>
            <span className="badge badge-amber">{studentProfile.learningStreak || 1} Days Streak 🔥</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Level {studentLevel} Student • <strong>{studentProfile.xpPoints || 100} XP Earned</strong> | {timetable.length} Classes Today
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenStudent360}>
            <UserCheck size={18} />
            My Student 360° Profile
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('live-class')}>
            <PlayCircle size={18} />
            Join Live Class
          </button>
        </div>
      </div>

      {/* Quick Overview Metrics: Attendance + Fees + Badges + Weakness Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        {/* Attendance Summary Card */}
        <div style={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: attendancePct >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: attendancePct >= 75 ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{attendancePct}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Attendance Rate</div>
          </div>
        </div>

        {/* Fee Status Card */}
        <div style={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: studentInvoice?.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: studentInvoice?.status === 'PAID' ? 'var(--accent-emerald)' : 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: studentInvoice?.status === 'PAID' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {studentInvoice?.status === 'PAID' ? 'Fee Cleared ✅' : `Fee Due (${studentInvoice?.amount || '$180'})`}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Billing: {studentInvoice?.month || 'August 2026'}</div>
          </div>
        </div>

        {/* Earned Badges Card */}
        <div style={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={16} className="text-amber-400" /> Badges & Medals
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badges.length} Unlocked</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {badges.map((b, i) => (
              <span key={i} className="badge badge-amber" style={{ textTransform: 'none', fontSize: '0.75rem' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* AI Learning Recommendation Card */}
        <div style={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={16} /> AI Focus Recommendation
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Target: <strong>{weakTopic}</strong>
          </p>
          <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} onClick={() => onNavigate('ai-hub')}>
            <Sparkles size={13} /> Launch AI Tutor
          </button>
        </div>

      </div>

      {/* Main Grid: Schedule + Academic Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Today's Schedule */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} className="text-blue-400" />
              <span>Today's Classes & Timetable</span>
            </div>
            <span className="badge badge-blue">{studentProfile.grade || 'Class 9-A'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {timetable.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>No classes scheduled for today.</p>
            ) : (
              timetable.map((slot, index) => (
                <div 
                  key={index} 
                  style={{
                    background: 'var(--bg-card-hover)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{slot.subject}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                      <span>{slot.time}</span>
                      <span>•</span>
                      <span>{slot.teacher}</span>
                    </div>
                  </div>
                  <span className="badge badge-indigo">{slot.room}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Standing */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={20} className="text-emerald-400" />
              <span>Academic Performance</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={onOpenReportCard}>
              Report Card
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>{studentProfile.gpa || examResults?.gpa?.split(' ')[0] || '3.8'}</span>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>GPA</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Grade {studentProfile.overallGrade || examResults?.gradeLetter || 'A'} ({examResults?.overallPercentage || 88}%)</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class Rank: <strong>{examResults?.rankInClass || '#4 of 38'}</strong></p>
              <span className="badge badge-emerald" style={{ marginTop: '0.25rem' }}>Mid-Terms Evaluated</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>Subject Progress:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {lms.map(course => (
              <div key={course.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <span>{course.subject}</span>
                  <span>{course.progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${course.progress}%`, 
                      background: course.progress > 85 ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                      borderRadius: '4px' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quizzes & Assignments */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={20} className="text-amber-400" />
            <span>Interactive Quizzes & Assignments</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-amber">Interactive Quiz</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 mins</span>
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Mathematics: Matrices Mastery Quiz</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem 0' }}>
              Test your knowledge on Cramer's rule & determinant inverses.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onStartQuiz('QZ-MATH1')}>
              Take Quiz Now
            </button>
          </div>

          <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-rose">Due Tomorrow</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{studentProfile.grade || 'Class 9-A'}</span>
            </div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Linear Equations Practice Set</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem 0' }}>
              Upload your PDF solution sheet for questions 1-15.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('lms')}>
              <FileText size={16} />
              Submit Homework
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
