import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Download, 
  ShieldCheck, 
  TrendingUp,
  Receipt,
  UserCheck
} from 'lucide-react';

import PaymentModal from './PaymentModal';

export default function ParentPortal({ 
  schoolData, 
  currentUserAccount,
  feeInvoices, 
  setFeeInvoices, 
  onTriggerNotification,
  onOpenReportCard,
  onOpenStudent360
}) {
  const { students360 } = schoolData;
  const [showReceipt, setShowReceipt] = useState(null);
  const [activePayInvoice, setActivePayInvoice] = useState(null);

  // Strictly filter children for the logged-in parent account
  const parentChildren = students360.filter(s => {
    if (!currentUserAccount) return true;
    if (currentUserAccount.linkedStudentId && s.id === currentUserAccount.linkedStudentId) return true;
    if (s.guardianEmail && currentUserAccount.email && s.guardianEmail.toLowerCase() === currentUserAccount.email.toLowerCase()) return true;
    if (s.guardian && currentUserAccount.name && s.guardian.toLowerCase().includes(currentUserAccount.name.toLowerCase())) return true;
    return false;
  });

  const displayChildren = parentChildren.length > 0 ? parentChildren : [students360[0]];

  const [selectedChildId, setSelectedChildId] = useState(displayChildren[0].id);

  const activeChild = displayChildren.find(s => s.id === selectedChildId) || displayChildren[0];
  const activeInvoice = feeInvoices.find(inv => inv.status === 'UNPAID') || feeInvoices[0];

  const handleCompletePayment = (invId, methodDetails) => {
    let paidAmount = '$180';
    let updatedInv = null;
    setFeeInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        paidAmount = inv.amount;
        updatedInv = {
          ...inv,
          status: 'PAID',
          paidOn: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          transactionRef: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          paymentMethod: methodDetails
        };
        return updatedInv;
      }
      return inv;
    }));

    setActivePayInvoice(null);
    if (updatedInv) setShowReceipt(updatedInv);
    onTriggerNotification(`✅ Payment of ${paidAmount} authorized via ${methodDetails}. Official receipt generated!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Parent Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Parent Portal 👨‍👩‍👦</h2>
            
            {/* Child Selector */}
            {displayChildren.length > 1 ? (
              <select 
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.4rem 0.75rem',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {displayChildren.map(s => (
                  <option key={s.id} value={s.id}>
                    Child: {s.name} ({s.grade} - {s.riskLevel === 'HIGH' ? '⚠️ At-Risk' : 'Normal'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="badge badge-indigo" style={{ fontSize: '0.85rem' }}>
                Student: {activeChild.name} ({activeChild.grade})
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Monitoring: <strong>{activeChild.name}</strong> | Roll #{activeChild.rollNo} | Attendance: <strong className={activeChild.attendancePct < 70 ? 'text-rose-400' : 'text-emerald-400'}>{activeChild.attendancePct}%</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onOpenStudent360(activeChild)}>
            <UserCheck size={18} />
            Child 360° Profile
          </button>
          <button className="btn btn-secondary" onClick={() => onOpenReportCard && onOpenReportCard(activeChild)}>
            <Award size={18} />
            Report Card
          </button>
        </div>
      </div>

      {/* Early Warning At-Risk Alert Banner for Parent */}
      {activeChild.riskLevel === 'HIGH' && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={22} />
            <span>EARLY WARNING NOTIFICATION FOR GUARDIAN</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Your child <strong>{activeChild.name}</strong> has been flagged by the School Intelligence System for academic & attendance support:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {activeChild.riskReasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => onTriggerNotification(`📅 Meeting request submitted for ${activeChild.name}'s Class Teacher.`)}>
              Schedule Parent-Teacher Meeting
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => onTriggerNotification(`📱 AI Guidance & Revision plan dispatched to parent phone.`)}>
              Request AI Remedial Homework
            </button>
          </div>
        </div>
      )}

      {/* Child Summary Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: activeChild.attendancePct < 70 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: activeChild.attendancePct < 70 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{activeChild.attendancePct}%</div>
            <div className="stat-lbl">Attendance Rate</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-val">{activeChild.gpa} / 4.0</div>
            <div className="stat-lbl">Mid-Term GPA (Grade {activeChild.overallGrade})</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: activeInvoice?.status === 'UNPAID' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: activeInvoice?.status === 'UNPAID' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-val">{activeInvoice?.status === 'UNPAID' ? activeInvoice.amount : 'Paid'}</div>
            <div className="stat-lbl">{activeInvoice?.status === 'UNPAID' ? `Fee Due (${activeInvoice.month})` : 'Fees Cleared'}</div>
          </div>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <CreditCard size={20} className="text-purple-400" />
            <span>Digital Fee Invoices & Receipts</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Billing Month</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Action</th>
              </tr>
            </thead>
            <tbody>
              {feeInvoices.filter(inv => !inv.studentId || inv.studentId === activeChild.id).length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No fee invoices found for {activeChild.name}.
                  </td>
                </tr>
              ) : (
                feeInvoices.filter(inv => !inv.studentId || inv.studentId === activeChild.id).map(inv => (
                  <tr key={inv.id}>
                    <td><strong>{inv.id}</strong></td>
                    <td>{inv.month}</td>
                    <td>{inv.dueDate}</td>
                    <td style={{ fontWeight: 800 }}>{inv.amount}</td>
                    <td>
                      {inv.status === 'UNPAID' ? (
                        <span className="badge badge-rose">UNPAID</span>
                      ) : (
                        <span className="badge badge-emerald">PAID ({inv.paidOn})</span>
                      )}
                    </td>
                    <td>
                      {inv.status === 'UNPAID' ? (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={() => setActivePayInvoice(inv)}
                        >
                          💳 Pay Online
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={() => setShowReceipt(inv)}
                        >
                          <Receipt size={14} /> View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {activePayInvoice && (
        <PaymentModal
          invoice={activePayInvoice}
          studentName={activeChild.name}
          onClose={() => setActivePayInvoice(null)}
          onCompletePayment={handleCompletePayment}
        />
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '2rem', maxWidth: '540px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>
                <ShieldCheck size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>OFFICIAL DIGITAL FEE RECEIPT</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apex International Digital Academy</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Receipt Ref:</span>
                <strong>{showReceipt.transactionRef || 'TXN-9981241'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                <strong>{activeChild.name} (#{activeChild.id})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Billing Month:</span>
                <strong>{showReceipt.month}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Date:</span>
                <strong>{showReceipt.paidOn || 'Today'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Channel:</span>
                <strong className="text-indigo-400">{showReceipt.paymentMethod || 'Online Gateway SSL'}</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Fee Breakdown:</span>
                {showReceipt.breakdown.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                    <span>{b.item}</span>
                    <span>{b.cost}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Total Amount Paid:</span>
                <span style={{ color: 'var(--accent-emerald)' }}>{showReceipt.amount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowReceipt(null)}>
                Close
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { onTriggerNotification('📄 Official PDF Fee Receipt Downloaded'); setShowReceipt(null); }}>
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
