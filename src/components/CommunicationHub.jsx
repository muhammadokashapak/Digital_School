import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Megaphone
} from 'lucide-react';

export default function CommunicationHub({ schoolData, currentRole, onTriggerNotification }) {
  const { messages, activeUser } = schoolData;
  const [announcements, setAnnouncements] = useState([...schoolData.announcements]);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  const canBroadcast = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(currentRole);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Official School Communication Hub 📢</h2>
            <span className="badge badge-indigo">Unified Messenger</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Broadcasting circulars, emergency holiday notices, and direct parent-teacher communications.
          </p>
        </div>

        {canBroadcast && (
          <button className="btn btn-primary" onClick={() => setShowAnnounceModal(true)}>
            <Plus size={18} />
            Broadcast Announcement
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Official Announcements */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div className="card-title">
              <Megaphone size={20} className="text-amber-400" />
              <span>Official Circulars & Announcements</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(ann => (
              <div key={ann.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span className="badge badge-amber">{ann.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ann.date} • By {ann.author}</span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.35rem 0' }}>{ann.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <MessageSquare size={20} className="text-blue-400" />
              <span>Direct Parent-Teacher Messages</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map(m => (
              <div key={m.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <strong>{m.sender}</strong>
                  <span>{m.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem' }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Announcement Modal */}
      {showAnnounceModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Broadcast Official Circular</h3>
              <button onClick={() => setShowAnnounceModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Science Fair Registration Open" 
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Notice Details</label>
                <textarea 
                  rows={4}
                  placeholder="Type official notice details..." 
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                />
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  if (annTitle) {
                    const newAnn = {
                      id: `ANN-${Date.now()}`,
                      title: `📢 ${annTitle}`,
                      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
                      category: 'Official',
                      author: 'Administration',
                      content: annBody || 'No additional details provided.'
                    };
                    setAnnouncements(prev => [newAnn, ...prev]);
                    onTriggerNotification(`📢 Announcement "${annTitle}" broadcasted to all Students & Parents!`);
                    setAnnTitle('');
                    setAnnBody('');
                    setShowAnnounceModal(false);
                  }
                }}
              >
                Send Notification to Everyone
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
