import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  CreditCard, 
  Info, 
  CheckCircle 
} from 'lucide-react';

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  notifications, 
  setNotifications, 
  onTriggerNotification 
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'IMPORTANT', 'AI'

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onTriggerNotification('✅ All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    onTriggerNotification('🗑️ All notifications cleared.');
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDeleteOne = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'IMPORTANT') return n.priority === 'HIGH' || n.category === 'EXAM';
    if (filter === 'AI') return n.category === 'AI_ALERT';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI_ALERT':
        return <Sparkles size={16} className="text-indigo-400" />;
      case 'EXAM':
        return <AlertCircle size={16} className="text-rose-400" />;
      case 'ACADEMIC':
        return <BookOpen size={16} className="text-emerald-400" />;
      case 'FEE':
        return <CreditCard size={16} className="text-amber-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'AI_ALERT': return 'badge-indigo';
      case 'EXAM': return 'badge-rose';
      case 'ACADEMIC': return 'badge-emerald';
      case 'FEE': return 'badge-amber';
      default: return 'badge-blue';
    }
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="glass-card" 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          height: '100vh', 
          borderRadius: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          borderLeft: '1px solid var(--border-color)',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ 
              background: 'var(--accent-primary-light)', 
              padding: '0.45rem', 
              borderRadius: '50%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} className="text-primary" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Notification Bar</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {unreadCount > 0 ? `${unreadCount} Unread Notifications` : 'All caught up!'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.5rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Bar & Filter Tabs */}
        <div style={{ 
          padding: '0.85rem 1.25rem', 
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card-hover)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['ALL', 'UNREAD', 'IMPORTANT', 'AI'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: filter === tab ? 'var(--accent-primary)' : 'transparent',
                    color: filter === tab ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button 
                onClick={handleMarkAllRead} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', gap: '0.2rem' }}
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Read All
              </button>
              <button 
                onClick={handleClearAll} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', color: 'var(--accent-rose)', gap: '0.2rem' }}
                title="Clear all notifications"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Notification List Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1.5rem', 
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CheckCircle size={40} className="text-emerald-400" />
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>No notifications found</div>
              <p style={{ fontSize: '0.8rem' }}>You have read or cleared all alerts in this view.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: item.read ? 'var(--bg-surface)' : 'rgba(99, 102, 241, 0.08)',
                  border: item.read ? '1px solid var(--border-color)' : '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: item.read ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                {/* Unread indicator dot */}
                {!item.read && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-rose)'
                  }} />
                )}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    padding: '0.4rem', 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'var(--bg-card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getCategoryIcon(item.category)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${getCategoryBadgeClass(item.category)}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {item.category || 'NOTICE'}
                      </span>
                      {item.priority === 'HIGH' && (
                        <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          IMPORTANT
                        </span>
                      )}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {item.time || 'Just now'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.88rem', fontWeight: item.read ? 600 : 800, marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                      {item.title || 'Notification Alert'}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.6rem' }}>
                      {item.text}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleToggleRead(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {item.read ? 'Mark as Unread' : 'Mark as Read'}
                      </button>
                      <button
                        onClick={() => handleDeleteOne(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          paddingLeft: '0.4rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div style={{ 
          padding: '0.85rem 1.25rem', 
          borderTop: '1px solid var(--border-color)', 
          background: 'var(--bg-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Digital School Alert Center
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', marginLeft: 'auto' }}
            onClick={onClose}
          >
            Close Notification Bar
          </button>
        </div>
      </div>
    </div>
  );
}
