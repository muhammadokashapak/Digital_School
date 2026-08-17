import React from 'react';
import { 
  GraduationCap, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  ShieldAlert, 
  TrendingUp, 
  User, 
  Users, 
  CreditCard,
  Settings,
  FileSpreadsheet,
  Library,
  Bus,
  UserCheck,
  LogOut
} from 'lucide-react';

export default function Header({ 
  schoolData, 
  currentUserAccount,
  currentRole, 
  setCurrentRole, 
  isDarkMode, 
  setIsDarkMode, 
  notificationsCount, 
  onOpenNotifications,
  onLogout 
}) {
  const roleIcons = {
    SUPER_ADMIN: <ShieldAlert size={18} className="text-rose-400" />,
    SCHOOL_ADMIN: <Settings size={18} className="text-blue-400" />,
    PRINCIPAL: <TrendingUp size={18} className="text-amber-400" />,
    TEACHER: <GraduationCap size={18} className="text-emerald-400" />,
    STUDENT: <User size={18} className="text-indigo-400" />,
    PARENT: <Users size={18} className="text-purple-400" />,
    ACCOUNTANT: <CreditCard size={18} className="text-emerald-400" />,
    EXAMINATION: <FileSpreadsheet size={18} className="text-amber-400" />,
    LIBRARY: <Library size={18} className="text-blue-400" />,
    TRANSPORT: <Bus size={18} className="text-rose-400" />,
    HR: <UserCheck size={18} className="text-indigo-400" />
  };

  const activeUser = currentUserAccount || schoolData.activeUser;

  return (
    <header className="top-navbar">
      {/* Brand Title */}
      <div className="brand-logo">
        <div className="logo-icon-box">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', lineHeight: 1 }}>{schoolData.schoolName}</h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {schoolData.tagline}
          </span>
        </div>
      </div>

      {/* Control Actions & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Role Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card-hover)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role:</span>
          {roleIcons[currentRole]}
          {['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(activeUser.role) ? (
            <select 
              value={currentRole} 
              onChange={(e) => setCurrentRole(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {schoolData.roles.map(r => (
                <option key={r.id} value={r.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                  {r.name} ({r.badge})
                </option>
              ))}
            </select>
          ) : (
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {schoolData.roles.find(r => r.id === currentRole)?.name || currentRole}
            </span>
          )}
          {['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(activeUser.role) && <ChevronDown size={14} className="text-muted" />}
        </div>

        {/* Notifications Button */}
        <button 
          onClick={onOpenNotifications}
          className="btn btn-secondary" 
          style={{ padding: '0.5rem', position: 'relative', borderRadius: '50%' }}
          title="Smart Notifications"
        >
          <Bell size={18} />
          {notificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-rose)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Dark/Light Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="btn btn-secondary" 
          style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.4rem', alignItems: 'center', fontWeight: 700, fontSize: '0.8rem' }}
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? (
            <>
              <Sun size={16} className="text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-indigo-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Active User Avatar & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <img 
            src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
            alt={activeUser.name} 
            style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{activeUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentRole}</span>
          </div>

          {/* Logout Action Button */}
          <button 
            onClick={onLogout}
            className="btn btn-secondary" 
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)' }}
            title="Log Out"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
