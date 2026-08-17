import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus
} from 'lucide-react';

export default function AccountantPortal({ feeInvoices, setFeeInvoices, onTriggerNotification }) {
  const [searchFilter, setSearchFilter] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredInvoices = feeInvoices.filter(inv => 
    inv.studentName.toLowerCase().includes(searchFilter.toLowerCase()) || inv.id.includes(searchFilter)
  );

  const handleMarkPaid = (id) => {
    setFeeInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        onTriggerNotification(`✅ Invoice ${id} marked as PAID. System receipt generated.`);
        return {
          ...inv,
          status: 'PAID',
          paidOn: new Date().toLocaleDateString(),
          transactionRef: `ACC-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return inv;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Finance Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Accounts & Fee Management 💰</h2>
            <span className="badge badge-purple">Finance Dept</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Track monthly tuition fees, transport charges, lab fees & online payment gateways.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => onTriggerNotification('⚡ Bulk fee invoice generator executed for August 2026!')}>
            <Plus size={18} />
            Generate Monthly Invoices
          </button>
          <button className="btn btn-secondary" onClick={() => onTriggerNotification('📊 Financial Balance Sheet exported to Excel.')}>
            <Download size={18} />
            Export Statement
          </button>
        </div>
      </div>

      {/* Financial Summary — Computed from actual data */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">{feeInvoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + parseInt(i.amount.replace('$','')), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            <div className="stat-lbl">Total Collected</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="stat-val">{feeInvoices.filter(i => i.status === 'UNPAID').length} Pending</div>
            <div className="stat-lbl">{feeInvoices.filter(i => i.status === 'UNPAID').reduce((sum, i) => sum + parseInt(i.amount.replace('$','')), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Outstanding</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-val">{feeInvoices.length > 0 ? Math.round((feeInvoices.filter(i => i.status === 'PAID').length / feeInvoices.length) * 100) : 0}%</div>
            <div className="stat-lbl">Collection Recovery Rate</div>
          </div>
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={20} className="text-purple-400" />
            <span>Master Fee Invoice Directory</span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter by student or ref..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Accountant Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id}>
                  <td><strong>{inv.id}</strong></td>
                  <td style={{ fontWeight: 700 }}>{inv.studentName}</td>
                  <td>{inv.studentId}</td>
                  <td>{inv.month}</td>
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
                        className="btn btn-success" 
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => handleMarkPaid(inv.id)}
                      >
                        <CheckCircle2 size={14} /> Record Manual Payment
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ref: {inv.transactionRef}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
