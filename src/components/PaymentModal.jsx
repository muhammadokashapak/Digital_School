import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

export default function PaymentModal({ invoice, studentName, onClose, onCompletePayment }) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'wallet', 'bank', 'qr'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Card form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Wallet form state
  const [walletProvider, setWalletProvider] = useState('EasyPaisa');
  const [mobileNumber, setMobileNumber] = useState('');

  // Bank form state
  const [selectedBank, setSelectedBank] = useState('Meezan Bank');
  const [accountNo, setAccountNo] = useState('PK36 MEZN 0001 0982 4410 01');

  const handleQuickDemoFill = () => {
    if (paymentMethod === 'card') {
      setCardName(studentName ? `${studentName.split(' ')[0]}'s Guardian` : 'Verified Parent');
      setCardNumber('4111 2222 3333 4444');
      setExpiry('12/29');
      setCvv('321');
    } else if (paymentMethod === 'wallet') {
      setMobileNumber('0333-9876543');
    } else if (paymentMethod === 'bank') {
      setAccountNo('PK92 HABB 0002 9918 2210 09');
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    let methodDetails = 'Credit Card (Visa ending 4444)';
    if (paymentMethod === 'wallet') methodDetails = `${walletProvider} (${mobileNumber || '0333-9876543'})`;
    if (paymentMethod === 'bank') methodDetails = `${selectedBank} (1IBFT Direct)`;
    if (paymentMethod === 'qr') methodDetails = 'Instant 1-Tap QR Checkout';

    setTimeout(() => {
      setIsProcessing(false);
      onCompletePayment(invoice.id, methodDetails);
    }, 1300);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-md)', color: '#fff' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Secure Online Fee Payment Gateway</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                256-bit Encrypted SSL Gateway | Ref: <strong>{invoice.id}</strong> ({invoice.month})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {/* Left Panel: Payment Method Selection & Inputs */}
          <div style={{ padding: '1.75rem', borderRight: '1px solid var(--border-color)' }}>
            
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
              Select Payment Method
            </span>

            {/* Method Tabs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  background: paymentMethod === 'card' ? 'var(--accent-gradient)' : 'var(--bg-card-hover)',
                  color: paymentMethod === 'card' ? '#ffffff' : 'var(--text-main)',
                  border: paymentMethod === 'card' ? 'none' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={18} /> Credit / Debit Card
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                style={{
                  background: paymentMethod === 'wallet' ? 'var(--accent-gradient)' : 'var(--bg-card-hover)',
                  color: paymentMethod === 'wallet' ? '#ffffff' : 'var(--text-main)',
                  border: paymentMethod === 'wallet' ? 'none' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Smartphone size={18} /> Mobile Wallet
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('bank')}
                style={{
                  background: paymentMethod === 'bank' ? 'var(--accent-gradient)' : 'var(--bg-card-hover)',
                  color: paymentMethod === 'bank' ? '#ffffff' : 'var(--text-main)',
                  border: paymentMethod === 'bank' ? 'none' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Building2 size={18} /> Bank Transfer (1IBFT)
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('qr')}
                style={{
                  background: paymentMethod === 'qr' ? 'var(--accent-gradient)' : 'var(--bg-card-hover)',
                  color: paymentMethod === 'qr' ? '#ffffff' : 'var(--text-main)',
                  border: paymentMethod === 'qr' ? 'none' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <QrCode size={18} /> Instant QR / 1-Tap
              </button>
            </div>

            {/* Form Fields according to selected method */}
            <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Option 1: Card Payment */}
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Cardholder Name</label>
                    <input 
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Card Number (Visa / Mastercard)</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Expiry Date</label>
                      <input 
                        type="text" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>CVV Code</label>
                      <input 
                        type="password" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        required
                        style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Option 2: Mobile Wallet */}
              {paymentMethod === 'wallet' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Select Mobile Wallet Provider</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {['EasyPaisa', 'JazzCash', 'NayaPay', 'SadaPay'].map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWalletProvider(w)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: walletProvider === w ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            background: walletProvider === w ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-card-hover)',
                            color: walletProvider === w ? 'var(--accent-primary)' : 'var(--text-main)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Registered Account Mobile Number</label>
                    <input 
                      type="text" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="0300-0000000"
                      required
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📲 You will receive an instant push notification on your {walletProvider} app to authorize this transaction of <strong>{invoice.amount}</strong>.
                  </p>
                </>
              )}

              {/* Option 3: Bank Transfer */}
              {paymentMethod === 'bank' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Select Bank</label>
                    <select 
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                    >
                      <option>Meezan Bank Limited</option>
                      <option>Habib Bank Limited (HBL)</option>
                      <option>United Bank Limited (UBL)</option>
                      <option>Allied Bank Limited (ABL)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>School Collection Account IBAN / Ref</label>
                    <input 
                      type="text" 
                      value={accountNo}
                      readOnly
                      style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    🏦 Pay using 1IBFT or Mobile Banking App. Direct reconciliation instantly marks invoice as PAID.
                  </p>
                </>
              )}

              {/* Option 4: Instant QR Pay */}
              {paymentMethod === 'qr' && (
                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                  <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-block', border: '2px solid var(--accent-primary)', marginBottom: '0.75rem' }}>
                    <QrCode size={130} style={{ color: '#0f172a' }} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Scan with Any Banking App / Raast</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Supports Raast Instant Pay, EasyPaisa, JazzCash & All Banking Apps.
                  </p>
                </div>
              )}

              {/* Quick Demo Fill button */}
              <button 
                type="button" 
                onClick={handleQuickDemoFill}
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}
              >
                <Sparkles size={14} className="text-amber-400" /> Auto-Fill Demo Payment Credentials
              </button>

              {/* Submit Payment Button */}
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '0.5rem'
                }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={18} className="spin" /> Processing SSL Payment...
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Confirm & Authorize Payment of {invoice.amount}
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Right Panel: Invoice Breakdown & Security Badges */}
          <div style={{ background: 'var(--bg-card-hover)', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                Invoice Summary & Fee Breakdown
              </span>

              <div style={{ background: 'var(--bg-surface)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                  <strong>{studentName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Billing Period:</span>
                  <strong>{invoice.month}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                  <strong className="text-amber-400">{invoice.dueDate}</strong>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Line Items:</span>
                  {invoice.breakdown.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      <span>{item.item}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.cost}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.75rem', fontSize: '1.15rem', fontWeight: 800 }}>
                  <span>Total Amount Due:</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>{invoice.amount}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontWeight: 800, marginBottom: '0.25rem' }}>
                <CheckCircle2 size={16} /> Verified School Guarantee
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                Funds are credited directly to Apex Digital Academy finance department. Instant official receipt generated with unique reference ID.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
