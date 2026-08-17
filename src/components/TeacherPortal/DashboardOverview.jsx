import React from 'react';
import { Users, FileCheck, CheckCircle2, Clock, MessageSquare, AlertCircle, Calendar, BookOpen, Video } from 'lucide-react';

export default function DashboardOverview({ teacherProfile, schoolData, onChangeTab, onTriggerNotification }) {
  if (!teacherProfile) return null;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  const profileAvatar = teacherProfile.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";

  // Clean Name Extraction
  const cleanName = (teacherProfile.name || '').replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').split(' ')[0] || teacherProfile.name;

  const totalStudents = teacherProfile.assignedStudents?.length || schoolData.students360?.length || 93;
  const activeAssignmentsCount = schoolData.lms?.length ? schoolData.lms.length * 2 : 6;
  const pendingGradingCount = Array.isArray(schoolData.attendance) 
    ? (schoolData.attendance.filter(a => a.status === 'ABSENT').length + 3) 
    : 5;

  const academicYear = schoolData.academicYear || 'Academic Year 2026-2027';

  // Teacher Daily Timetable
  const teacherTimetable = [
    { period: 'Period 1', time: '08:30 AM - 09:15 AM', subject: `${teacherProfile.primarySubject}`, classRoom: 'Class 9-A (Room 102)', status: 'COMPLETED' },
    { period: 'Period 2', time: '09:20 AM - 10:05 AM', subject: `${teacherProfile.primarySubject} Lab`, classRoom: 'Class 9-B (Digital Lab)', status: 'IN_PROGRESS' },
    { period: 'Period 4', time: '11:15 AM - 12:00 PM', subject: 'Advanced Problem Solving', classRoom: 'Class 10-A (Room 204)', status: 'UPCOMING' },
    { period: 'Period 6', time: '01:30 PM - 02:15 PM', subject: 'Live Interactive Studio', classRoom: 'Virtual Studio 1', status: 'UPCOMING' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Teacher Header Bar */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.5rem 2rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <img 
            src={profileAvatar} 
            alt="Profile" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
          />
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{greeting}, {cleanName} 👋</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">{teacherProfile.department || 'Academic'} Department</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {teacherProfile.primarySubject || 'Mathematics'} Faculty
              </span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>{academicYear}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Assigned Students</div>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeAssignmentsCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Assignments</div>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingGradingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Submissions to Grade</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Actionable Tasks */}
        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title">
              <AlertCircle size={20} className="text-rose-400" />
              <span>Pending Teacher Actions</span>
            </div>
            <span className="badge badge-rose">Action Needed</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={16} className="text-amber-400" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Grade {teacherProfile.primarySubject} Submissions</span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onChangeTab('assessments')}>Grade Now</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={16} className="text-emerald-400" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Mark Daily Attendance Roll Call</span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onChangeTab('classes')}>Roll Call</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={16} className="text-blue-400" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Parent Consultations & Messages</span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onChangeTab('communication')}>View</button>
            </div>
          </div>
        </div>

        {/* Today's Teaching Schedule Timetable */}
        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title">
              <Calendar size={20} className="text-indigo-400" />
              <span>Today's Teaching Schedule</span>
            </div>
            <span className="badge badge-indigo">{teacherTimetable.length} Sessions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {teacherTimetable.map((slot, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'var(--bg-surface)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{slot.period}: {slot.subject}</span>
                    {slot.status === 'IN_PROGRESS' && <span className="badge badge-rose" style={{ animation: 'pulse 2s infinite' }}>LIVE</span>}
                    {slot.status === 'COMPLETED' && <span className="badge badge-emerald">DONE</span>}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{slot.time} • {slot.classRoom}</span>
                </div>

                {slot.status === 'IN_PROGRESS' || slot.classRoom.includes('Virtual') ? (
                  <button className="btn btn-primary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => onChangeTab('live-class')}>
                    <Video size={13} /> Open Studio
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }} onClick={() => onChangeTab('classes')}>
                    <BookOpen size={13} /> Class
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
