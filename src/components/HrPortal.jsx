import React, { useState } from 'react';
import { UserCheck, Users, Clock, CheckCircle2, XCircle, AlertCircle, Plus, FileText } from 'lucide-react';

export default function HrPortal({ schoolData, onTriggerNotification }) {
  const { hrData, teacherWorkload } = schoolData;
  const [leaveRequests, setLeaveRequests] = useState(hrData.leaves);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  const handleApproveLeave = (id) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l));
    onTriggerNotification(`✅ Leave Request #${id} APPROVED by HR Department.`);
  };

  const handleRejectLeave = (id) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
    onTriggerNotification(`❌ Leave Request #${id} REJECTED by HR Department.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* HR Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>HR & Staff Workload Management 👥</h2>
            <span className="badge badge-indigo">Human Capital</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Managing 85 Faculty & Staff Members, Leave Approvals & Teacher Workload Distribution.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowPayrollModal(true)}>
          <FileText size={18} />
          Process Monthly Payroll
        </button>
      </div>

      {/* HR Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{hrData.totalStaff}</div>
            <div className="stat-lbl">Total Employed Staff</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{hrData.presentStaffToday} / 85</div>
            <div className="stat-lbl">Staff Present Today</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{leaveRequests.filter(l => l.status === 'PENDING').length}</div>
            <div className="stat-lbl">Pending Leave Requests</div>
          </div>
        </div>
      </div>

      {/* Teacher Workload Analytics Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={20} className="text-indigo-400" />
            <span>Teacher Workload Analytics & Hours Distribution</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty Member</th>
                <th>Subject</th>
                <th>Assigned Classes</th>
                <th>Total Students</th>
                <th>Weekly Hours</th>
                <th>Workload Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherWorkload.map((wk, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{wk.name}</td>
                  <td>{wk.subject}</td>
                  <td>{wk.assignedClasses} Classes</td>
                  <td>{wk.totalStudents} Students</td>
                  <td>{wk.weeklyHours} Hours/Week</td>
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

      {/* Staff Leave Applications */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} className="text-amber-400" />
            <span>Pending Staff Leave Applications</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {leaveRequests.map(lv => (
            <div key={lv.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{lv.staffName}</strong>
                  <span className="badge badge-indigo">{lv.role}</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Leave Type: <strong>{lv.type}</strong> | Date: <strong>{lv.date}</strong> | Reason: <em>"{lv.reason}"</em>
                </p>
              </div>

              <div>
                {lv.status === 'PENDING' ? (
                  <button className="btn btn-success" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }} onClick={() => handleApproveLeave(lv.id)}>
                    <CheckCircle2 size={14} /> Approve Leave
                  </button>
                ) : (
                  <span className="badge badge-emerald">APPROVED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Modal */}
      {showPayrollModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '2rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>💵 August 2026 Staff Payroll Disbursal</h3>
              <button onClick={() => setShowPayrollModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <span>Total Employed Staff:</span>
                <strong>85 Members</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <span>Total Gross Salaries:</span>
                <strong>$128,500.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <span>Tax & Insurance Deductions:</span>
                <strong className="text-rose-400">-$12,450.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '1.05rem' }}>
                <span>Net Disbursal Payable:</span>
                <span className="text-emerald-400">$116,050.00</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowPayrollModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                onTriggerNotification('✅ Payroll of $116,050 successfully processed & direct deposited into staff bank accounts!');
                setShowPayrollModal(false);
              }}>Execute Direct Deposit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
