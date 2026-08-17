import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  UserPlus, 
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Download
} from 'lucide-react';

export default function AdminPortal({ 
  schoolData, 
  students360List = schoolData.students360, 
  setStudents360List, 
  onAddStudentAccount, 
  onOpenStudent360, 
  onTriggerNotification 
}) {
  const { schoolIntelligence, teacherWorkload } = schoolData;
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Class 9-A');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');

  const atRiskStudents = (students360List || []).filter(s => s.riskLevel === 'HIGH');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Admin Title Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(245, 158, 11, 0.2) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Principal & School Intelligence Dashboard 📊</h2>
            <span className="badge badge-rose">Executive Control</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Real-time analytics, At-Risk Early Warning interventions & Teacher Workload distribution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setShowAddStudentModal(true)}>
            <UserPlus size={18} />
            Register Student / Staff
          </button>
          <button className="btn btn-secondary" onClick={() => onTriggerNotification('📊 School Intelligence Report exported.')}>
            <Download size={18} />
            Export Executive Report
          </button>
        </div>
      </div>

      {/* Executive Intelligence Metrics */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{students360List.length}</div>
            <div className="stat-lbl">Total Enrolled Students</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-val">{students360List.length > 0 ? (students360List.reduce((acc, curr) => acc + (curr.attendancePct || 95), 0) / students360List.length).toFixed(1) : 100}%</div>
            <div className="stat-lbl">Overall School Attendance</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-val">{atRiskStudents.length}</div>
            <div className="stat-lbl">At-Risk Students Flagged</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-val">{students360List.length > 0 ? 84.5 : 0}%</div>
            <div className="stat-lbl">Academic Exam Average</div>
          </div>
        </div>
      </div>

      {/* Early Warning At-Risk Student Directory */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <AlertTriangle size={20} className="text-rose-400" />
            <span>Student Intelligence Directory & Interventions</span>
          </div>
          <span className="badge badge-rose">{atRiskStudents.length} Action Needed</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Risk Status</th>
                <th>Triggered Risk Factors</th>
                <th>360° Action</th>
              </tr>
            </thead>
            <tbody>
              {students360List.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No students currently enrolled. Click <strong>"Register Student / Staff"</strong> above to add students.
                  </td>
                </tr>
              ) : (
                students360List.map(st => (
                  <tr key={st.id}>
                    <td style={{ fontWeight: 700 }}>{st.name}</td>
                    <td>{st.grade}</td>
                    <td style={{ color: st.attendancePct < 70 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 800 }}>{st.attendancePct}%</td>
                    <td>{st.gpa}</td>
                    <td>
                      <span className={`badge ${st.riskLevel === 'HIGH' ? 'badge-risk-high' : 'badge-risk-low'}`}>
                        {st.riskLevel}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {st.riskReasons && st.riskReasons.length > 0 ? st.riskReasons.join('; ') : 'Normal Learning Trajectory'}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }} onClick={() => onOpenStudent360(st)}>
                        <UserCheck size={14} /> Open 360° Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Workload Overview */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <GraduationCap size={20} className="text-indigo-400" />
            <span>Teacher Workload Distribution</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Subject</th>
                <th>Classes</th>
                <th>Total Students</th>
                <th>Pending Checking</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherWorkload.map((wk, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{wk.name}</td>
                  <td>{wk.subject}</td>
                  <td>{wk.assignedClasses}</td>
                  <td>{wk.totalStudents}</td>
                  <td>{wk.pendingAssignments} Submissions</td>
                  <td>
                    <span className={`badge ${wk.status.includes('High') ? 'badge-rose' : 'badge-emerald'}`}>
                      {wk.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Register New Student / Staff Account</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Student Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bilal Ahmed" 
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Parent / Guardian Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ahmed Raza" 
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Parent Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. ahmed.raza@gmail.com" 
                    value={newGuardianEmail}
                    onChange={(e) => setNewGuardianEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Assigned Grade</label>
                <select 
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                >
                  <option>Class 8-A</option>
                  <option>Class 9-A</option>
                  <option>Class 10-A</option>
                </select>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => {
                  if(newStudentName) {
                    const studentId = `S${Date.now().toString().slice(-3)}`;
                    const parentName = newGuardianName || `${newStudentName.split(' ')[0]}'s Parent`;
                    const parentEmail = newGuardianEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '')}.parent@gmail.com`;

                    const newStudentObj = {
                      id: studentId,
                      name: newStudentName,
                      rollNo: `${Math.floor(10000 + Math.random() * 90000)}`,
                      grade: newStudentGrade,
                      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                      guardian: parentName,
                      guardianEmail: parentEmail,
                      guardianPhone: "+92 300 0000000",
                      attendancePct: 100.0,
                      gpa: 4.0,
                      overallGrade: "A+",
                      riskLevel: "LOW",
                      riskReasons: [],
                      learningStreak: 1,
                      xpPoints: 100,
                      badges: ["New Student 🎓"],
                      strongSubjects: ["General Science"],
                      weakTopics: [],
                      teacherRemarks: "Newly admitted student.",
                      portfolioProjects: [],
                      skills: ["Eager Learner"],
                      behaviorRating: "Good"
                    };

                    if (setStudents360List) {
                      setStudents360List(prev => [newStudentObj, ...(prev || [])]);
                    }

                    if (onAddStudentAccount) {
                      onAddStudentAccount(newStudentObj, parentName, parentEmail);
                    }

                    onTriggerNotification(`🎉 Student "${newStudentName}" & Parent "${parentName}" accounts created! Parent login: ${parentEmail}`);
                    setNewStudentName('');
                    setNewGuardianName('');
                    setNewGuardianEmail('');
                    setShowAddStudentModal(false);
                  }
                }}
              >
                Create Linked Student & Parent Accounts
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
