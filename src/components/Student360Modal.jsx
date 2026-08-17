import React, { useEffect } from 'react';
import { 
  Award, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Code, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function Student360Modal({ student, currentRole, onClose, onTriggerNotification }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const isStudent = currentRole === 'STUDENT';
  const displayedPhone = isStudent ? '+92 300 ••••••• (Protected)' : (student.guardianPhone || 'N/A');

  const badges = student.badges || [];
  const strongSubjects = student.strongSubjects || [];
  const weakTopics = student.weakTopics || [];
  const portfolioProjects = student.portfolioProjects || [];
  const skills = student.skills || [];
  const riskReasons = student.riskReasons || [];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: '820px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={student.name} 
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{student.name}</h2>
                <span className="badge badge-indigo">Roll #{student.rollNo}</span>
                <span className={`badge ${student.riskLevel === 'HIGH' ? 'badge-risk-high' : 'badge-risk-low'}`}>
                  {student.riskLevel === 'HIGH' ? '⚠️ AT-RISK' : 'NORMAL LEARNING TRAJECTORY'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {student.grade} | Guardian: <strong>{student.guardian}</strong> ({displayedPhone})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* 360 Overview Cards */}
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="glass-card stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-val">{student.attendancePct}%</div>
              <div className="stat-lbl">Attendance Rate</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
              <Award size={22} />
            </div>
            <div>
              <div className="stat-val">{student.gpa} / 4.0</div>
              <div className="stat-lbl">GPA (Grade {student.overallGrade || 'A'})</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Flame size={22} />
            </div>
            <div>
              <div className="stat-val">{student.learningStreak || 1} Days 🔥</div>
              <div className="stat-lbl">{student.xpPoints || 100} XP Points</div>
            </div>
          </div>
        </div>

        {/* Early Warning Risk Banner if HIGH */}
        {student.riskLevel === 'HIGH' && (
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid #f43f5e', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 800, marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} />
              <span>EARLY WARNING DETECTED — ACADEMIC INTERVENTION RECOMMENDED</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              {riskReasons.map((r, i) => (
                <li key={i} style={{ marginBottom: '0.2rem' }}>{r}</li>
              ))}
            </ul>
            {!isStudent ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => onTriggerNotification(`🎯 Remedial Math & Attendance plan assigned to ${student.name}!`)}>
                  Assign Remedial Plan
                </button>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => onTriggerNotification(`💬 SMS Sent to ${student.guardian} (${student.guardianPhone})`)}>
                  Notify Parent via SMS
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Tip: Focus on your revision schedule and attend all daily live classes to improve your attendance and score!</span>
              </div>
            )}
          </div>
        )}

        {/* Learning Strengths & Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} className="text-amber-400" /> Earned Achievements & Badges
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {badges.length > 0 ? (
                badges.map((b, i) => (
                  <span key={i} className="badge badge-amber" style={{ textTransform: 'none', fontSize: '0.8rem' }}>{b}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No badges unlocked yet. Keep studying!</span>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} className="text-emerald-400" /> Subject Strengths vs Focus Topics
            </h4>
            <div style={{ fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong className="text-emerald-400">Strong:</strong> {strongSubjects.length > 0 ? strongSubjects.join(', ') : 'All Foundation Subjects'}</div>
              <div><strong className="text-rose-400">Needs Focus:</strong> {weakTopics.length > 0 ? weakTopics.join(', ') : 'None! Great learning progress 🎉'}</div>
            </div>
          </div>

        </div>

        {/* Portfolio & Behavior */}
        <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Code size={16} className="text-indigo-400" /> Digital Student Portfolio & Skills
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>Projects: <strong>{portfolioProjects.length > 0 ? portfolioProjects.join(', ') : 'Introductory Science Lab'}</strong></div>
            <div>Skills: <strong>{skills.length > 0 ? skills.join(', ') : 'Active Learner'}</strong></div>
            <div>Behavior Rating: <strong className="text-emerald-400">{student.behaviorRating || 'Good'}</strong></div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close 360° Profile
          </button>
        </div>

      </div>
    </div>
  );
}
