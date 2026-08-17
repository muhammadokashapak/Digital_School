import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  FileSpreadsheet, 
  DollarSign, 
  Bot, 
  Video, 
  Library, 
  MessageSquare, 
  Users,
  Bus,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentRole }) {
  const defaultMenuItems = [
    { id: 'dashboard', label: 'Main Portal', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'EXAMINATION', 'LIBRARY', 'TRANSPORT', 'HR'] },
    { id: 'lms', label: 'LMS & Courses', icon: BookOpen, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT'] },
    { id: 'attendance', label: 'Attendance Roll Call', icon: CheckSquare, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { id: 'exams', label: 'Exams & Results', icon: FileSpreadsheet, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'EXAMINATION'] },
    { id: 'fees', label: 'Fees & Finance', icon: DollarSign, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT'] },
    { id: 'ai-hub', label: 'AI Education Engine 🤖', icon: Bot, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT'] },
    { id: 'live-class', label: 'Live Studio 🎥', icon: Video, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'STUDENT'] },
    { id: 'library', label: 'Digital Library', icon: Library, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'STUDENT', 'LIBRARY'] },
    { id: 'transport', label: 'Transport & GPS 🚌', icon: Bus, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT', 'TRANSPORT'] },
    { id: 'hr', label: 'HR & Staff Workload 👥', icon: UserCheck, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'HR'] },
    { id: 'communication', label: 'Announcements & Chat', icon: MessageSquare, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'EXAMINATION', 'LIBRARY', 'TRANSPORT', 'HR'] },
    { id: 'management', label: 'Super Admin Control', icon: Users, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'] }
  ];

  const superAdminMenuItems = [
    { id: 'dashboard', label: 'User Directory & Enrollment', icon: Users, roles: ['SUPER_ADMIN'] },
    { id: 'communication', label: 'System Announcements', icon: MessageSquare, roles: ['SUPER_ADMIN'] }
  ];

  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['TEACHER'] },
    { id: 'classes', label: 'My Classes', icon: Users, roles: ['TEACHER'] },
    { id: 'courses', label: 'My Courses', icon: BookOpen, roles: ['TEACHER'] },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare, roles: ['TEACHER'] },
    { id: 'gradebook', label: 'Gradebook', icon: FileSpreadsheet, roles: ['TEACHER'] },
    { id: 'live-class', label: 'Live Studio 🎥', icon: Video, roles: ['TEACHER'] },
    { id: 'communication', label: 'Messages', icon: MessageSquare, roles: ['TEACHER'] },
    { id: 'ai-hub', label: 'AI Assistant', icon: Bot, roles: ['TEACHER'] }
  ];

  const menuItems = currentRole === 'TEACHER' 
    ? teacherMenuItems 
    : currentRole === 'SUPER_ADMIN' 
      ? superAdminMenuItems 
      : defaultMenuItems;

  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole));
  const showAiPromo = ['STUDENT', 'TEACHER', 'PRINCIPAL'].includes(currentRole);

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">{currentRole} NAVIGATION</div>
      {filteredItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </div>
        );
      })}

      {showAiPromo && (
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: 'var(--glass-border)' }}>
          <div 
            onClick={() => setActiveTab('ai-hub')}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Bot size={18} className="text-indigo-400" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#a5b4fc' }}>AI Education Engine</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              AI Tutor, Quiz Gen, Analytics & Lesson Planner
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
