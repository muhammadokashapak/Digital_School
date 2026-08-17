import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  PhoneOff,
  Send
} from 'lucide-react';
import { filterContent } from '../utils/sanitize';

export default function LiveClassroom({ schoolData, currentUserAccount, teacherProfile, onLeaveStudio, onTriggerNotification }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [drawColor, setDrawColor] = useState('#3b82f6');
  const [chatInput, setChatInput] = useState('');
  const [liveMessages, setLiveMessages] = useState([
    { user: teacherProfile?.name || 'Prof. Sarah Khan', text: "Welcome to today's Live Class on Matrix Inverses & Cramer's Rule!", time: '09:01 AM' },
    { user: 'Ahmed Raza', text: "Good morning! Ready for today's session.", time: '09:02 AM' }
  ]);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, [drawColor]);

  const getClientPos = (e) => {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const startDrawing = (e) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const pos = getClientPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.clientX - rect.left, pos.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const pos = getClientPos(e);
    ctx.strokeStyle = drawColor;
    ctx.lineTo(pos.clientX - rect.left, pos.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onTriggerNotification('🧹 Whiteboard canvas cleared.');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    if (chatInput.length > 250) {
      onTriggerNotification('⚠️ Message is too long (max 250 characters).');
      return;
    }

    const { isSafe, cleanText } = filterContent(chatInput);
    if (!isSafe) {
      onTriggerNotification('⚠️ Inappropriate language was filtered.');
    }

    const userName = currentUserAccount?.name || schoolData.activeUser?.name || 'Student';
    setLiveMessages(prev => [...prev, { user: userName, text: cleanText, time: 'Now' }]);
    setChatInput('');
  };

  const handleLeave = () => {
    onTriggerNotification('🚪 Disconnected from Live Studio session.');
    if (onLeaveStudio) {
      onLeaveStudio();
    }
  };

  const presenterName = teacherProfile?.name || 'Prof. Sarah Khan';
  const subjectName = teacherProfile?.primarySubject || 'Mathematics';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🔴 LIVE STUDIO: Class 9-A {subjectName}</h2>
            <span className="badge badge-rose">LIVE BROADCAST</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Host: <strong>{presenterName}</strong> | Active Participants: <strong>36 Students</strong>
          </p>
        </div>

        {/* Call Controls */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <button 
            onClick={() => setIsMicOn(!isMicOn)} 
            className={`btn ${isMicOn ? 'btn-secondary' : 'btn-danger'}`}
            style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, justifyContent: 'center' }}
            title="Toggle Mic"
          >
            {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          <button 
            onClick={() => setIsVideoOn(!isVideoOn)} 
            className={`btn ${isVideoOn ? 'btn-secondary' : 'btn-danger'}`}
            style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, justifyContent: 'center' }}
            title="Toggle Camera"
          >
            {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
          </button>

          <button 
            onClick={() => {
              setIsHandRaised(!isHandRaised);
              if (!isHandRaised) onTriggerNotification('✋ Hand Raised! Instructor has been notified.');
            }} 
            className={`btn ${isHandRaised ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, justifyContent: 'center' }}
            title="Raise Hand"
          >
            <Hand size={18} />
          </button>

          <button 
            className="btn btn-danger" 
            style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem' }}
            onClick={handleLeave}
          >
            <PhoneOff size={18} /> Leave Studio
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Video Grid & Whiteboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left: Video Stream & Interactive Whiteboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
          
          {/* Main Video Stream Frame */}
          <div style={{ background: '#090d16', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isVideoOn ? (
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop&q=80" 
                alt="Teacher Live Feed" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                <VideoOff size={48} style={{ marginBottom: '0.5rem' }} />
                <p>Teacher Camera Turned Off</p>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0, 0, 0, 0.75)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
              <span>{presenterName} (Host)</span>
            </div>
          </div>

          {/* Interactive Collaborative Whiteboard Canvas */}
          <div className="glass-card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
              <div className="card-title">
                <Edit3 size={18} className="text-indigo-400" />
                <span>Collaborative Digital Whiteboard</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#ffffff'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setDrawColor(color)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: color,
                      border: drawColor === color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={clearCanvas}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>

            <canvas 
              ref={canvasRef}
              width={720}
              height={240}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: '100%',
                height: '240px',
                background: '#0f172a',
                borderRadius: 'var(--radius-md)',
                cursor: 'crosshair',
                border: '1px solid var(--border-color)',
                touchAction: 'none'
              }}
            />
          </div>

        </div>

        {/* Right: Live Interactive Classroom Chat */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div className="card-header">
            <div className="card-title">
              <MessageSquare size={18} className="text-blue-400" />
              <span>Live Class Chat</span>
            </div>
            <span className="badge badge-emerald">36 Online</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            {liveMessages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  background: msg.user.includes('Prof') || msg.user.includes('Dr') ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface)',
                  border: msg.user.includes('Prof') || msg.user.includes('Dr') ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border-color)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: msg.user.includes('Prof') ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                    {msg.user}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input 
              type="text" 
              placeholder="Ask a question in live class (max 250 chars)..." 
              maxLength={250}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card-hover)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
