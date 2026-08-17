import React, { useState } from 'react';
import { Users, Search, CheckCircle2, XCircle, Clock, Bell, UserCheck } from 'lucide-react';

export default function MyClasses({ teacherProfile, attendanceList, setAttendanceList, onOpenStudent360, onTriggerNotification }) {
  const [selectedClass, setSelectedClass] = useState(teacherProfile?.assignedClasses?.[0] || 'Class 9-A');
  const [searchQuery, setSearchQuery] = useState('');

  if (!teacherProfile || !teacherProfile.assignedClasses || teacherProfile.assignedClasses.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No classes currently assigned to this teacher profile.</p>
      </div>
    );
  }

  // Toggle student attendance status with boundary protections
  const handleToggleAttendance = (id, newStatus) => {
    setAttendanceList(prev => prev.map(item => {
      if (item.id === id) {
        if (item.status === newStatus) return item; // No change
        
        const totalDays = Math.max(1, item.totalDays || 20);
        let newPresentDays = item.presentDays !== undefined ? item.presentDays : 18;
        
        // Adjust present days strictly between 0 and totalDays
        if ((item.status === 'PRESENT' || item.status === 'LATE') && newStatus === 'ABSENT') {
          newPresentDays = Math.max(0, newPresentDays - 1);
        } else if (item.status === 'ABSENT' && (newStatus === 'PRESENT' || newStatus === 'LATE')) {
          newPresentDays = Math.min(totalDays, newPresentDays + 1);
        }
        
        const newPercentage = Number(((newPresentDays / totalDays) * 100).toFixed(1));
        
        if (newPercentage < 75) {
          if (newStatus === 'ABSENT') {
            onTriggerNotification(`🚨 URGENT: ${item.name} marked absent today and attendance is currently below 75% (${newPercentage}%). Alert dispatched.`);
          } else {
            onTriggerNotification(`⚠️ ${item.name} was marked present today, but overall attendance remains below 75% (${newPercentage}%).`);
          }
        } else if (newStatus === 'ABSENT') {
          onTriggerNotification(`🔔 Alert sent to parent of ${item.name}: "Child was marked ABSENT for daily roll call."`);
        } else {
          onTriggerNotification(`✅ Marked ${item.name} as ${newStatus} (${newPercentage}% attendance).`);
        }
        
        return { 
          ...item, 
          status: newStatus, 
          presentDays: newPresentDays,
          totalDays: totalDays,
          percentage: newPercentage
        };
      }
      return item;
    }));
  };

  const filteredAttendance = (attendanceList || []).filter(st => {
    const matchesSearch = (st.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (st.rollNo || '').includes(searchQuery);
    const matchesClass = !selectedClass || !st.class || st.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="card-title">
            <Users size={20} className="text-emerald-400" />
            <span>Digital Daily Attendance Roll Call</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search student or roll no..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  minWidth: '200px'
                }}
              />
            </div>
            
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.8rem',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            >
              {teacherProfile.assignedClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Monthly %</th>
                <th>Attendance Action</th>
                <th>Parent Notification Status</th>
                <th>360° Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No students found matching your filter in {selectedClass}.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(st => (
                  <tr key={st.id}>
                    <td><strong>#{st.rollNo}</strong></td>
                    <td style={{ fontWeight: 700 }}>{st.name}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 800, 
                        color: st.percentage >= 75 ? (st.percentage > 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)') : 'var(--accent-rose)',
                        background: st.percentage < 75 ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                        padding: st.percentage < 75 ? '0.2rem 0.5rem' : '0',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {st.percentage}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleToggleAttendance(st.id, 'PRESENT')}
                          className={`btn ${st.status === 'PRESENT' ? 'btn-success' : 'btn-secondary'}`}
                          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                        >
                          <CheckCircle2 size={13} /> Present
                        </button>
                        <button 
                          onClick={() => handleToggleAttendance(st.id, 'ABSENT')}
                          className={`btn ${st.status === 'ABSENT' ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                        >
                          <XCircle size={13} /> Absent
                        </button>
                        <button 
                          onClick={() => handleToggleAttendance(st.id, 'LATE')}
                          className={`btn ${st.status === 'LATE' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                        >
                          <Clock size={13} /> Late
                        </button>
                      </div>
                    </td>
                    <td>
                      {st.percentage < 75 && st.status === 'ABSENT' ? (
                        <span className="badge badge-rose" style={{ animation: 'pulse 2s infinite' }}>
                          <Bell size={12} /> URGENT Alert Active
                        </span>
                      ) : st.percentage < 75 ? (
                        <span className="badge badge-amber">
                          <Bell size={12} /> Warning: Low Attendance
                        </span>
                      ) : st.status === 'ABSENT' ? (
                        <span className="badge badge-rose">
                          <Bell size={12} /> Standard Alert Sent
                        </span>
                      ) : (
                        <span className="badge badge-emerald">Normal</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', gap: '0.25rem' }}
                        onClick={() => onOpenStudent360 && onOpenStudent360(st)}
                      >
                        <UserCheck size={13} /> View 360°
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
