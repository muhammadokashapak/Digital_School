import React, { useState } from 'react';
import { Bus, MapPin, Users, Navigation, Phone, ShieldCheck, RefreshCw } from 'lucide-react';

export default function TransportPortal({ schoolData, onTriggerNotification }) {
  const { transport } = schoolData;
  const [routesList, setRoutesList] = useState([...transport.routes]);
  const [selectedRoute, setSelectedRoute] = useState(transport.routes[0]);
  const [gpsMoving, setGpsMoving] = useState(false);

  const handleSimulateGps = () => {
    setGpsMoving(true);
    const newLat = (31.5204 + (Math.random() - 0.5) * 0.02).toFixed(4);
    const newLong = (74.3587 + (Math.random() - 0.5) * 0.02).toFixed(4);
    const newGps = `Lat: ${newLat}, Long: ${newLong}`;
    
    setTimeout(() => {
      setRoutesList(prev => prev.map(r => r.id === selectedRoute.id ? { ...r, currentGps: newGps } : r));
      setSelectedRoute(prev => ({ ...prev, currentGps: newGps }));
      setGpsMoving(false);
      onTriggerNotification(`📍 ${selectedRoute.busNo} GPS Location updated: "${newGps} — Approving Stop in 4 mins"`);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Transport & Fleet Management 🚌</h2>
            <span className="badge badge-rose">Live GPS Tracking</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Managing 12 Buses, 8 Active Routes & 410 Assigned Students with real-time GPS tracking.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSimulateGps} disabled={gpsMoving}>
          <RefreshCw size={16} className={gpsMoving ? 'spin' : ''} />
          {gpsMoving ? 'Updating GPS...' : 'Refresh Bus GPS Location'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)' }}>
            <Bus size={24} />
          </div>
          <div>
            <div className="stat-val">{transport.totalBuses}</div>
            <div className="stat-lbl">Total Buses in Fleet</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Navigation size={24} />
          </div>
          <div>
            <div className="stat-val">{transport.activeRoutes}</div>
            <div className="stat-lbl">Active Bus Routes</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{transport.assignedStudentsCount}</div>
            <div className="stat-lbl">Transport Subscribed Students</div>
          </div>
        </div>
      </div>

      {/* Routes Directory & Live Simulated GPS Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Bus Routes List */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Bus size={20} className="text-rose-400" />
              <span>Bus Routes Roster</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {routesList.map(rt => (
              <div 
                key={rt.id} 
                onClick={() => setSelectedRoute(rt)}
                style={{ 
                  background: rt.id === selectedRoute.id ? 'var(--bg-card-hover)' : 'var(--bg-surface)', 
                  border: rt.id === selectedRoute.id ? '1px solid var(--accent-rose)' : 'var(--glass-border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{rt.busNo}</strong>
                  <span className="badge badge-rose">{rt.status}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Driver: <strong>{rt.driver}</strong> | Capacity: <strong>{rt.capacity}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>
                  Route: {rt.routeName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live GPS Tracker Simulator Frame */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={20} className="text-emerald-400" />
              <span>Live GPS Bus Tracker Simulator — {selectedRoute.busNo}</span>
            </div>
            <span className="badge badge-emerald">Live Telemetry</span>
          </div>

          <div style={{ background: '#0b1329', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ padding: '1.25rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-rose)', marginBottom: '1rem' }}>
              <Bus size={48} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedRoute.busNo} — Active GPS Stream</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.4rem 0 1rem 0' }}>
              Current Coordinates: <strong>{selectedRoute.currentGps}</strong> | Driver: <strong>{selectedRoute.driver}</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={handleSimulateGps}>
                <Navigation size={16} /> Simulate Next Stop Arrival
              </button>
              <button className="btn btn-secondary" onClick={() => onTriggerNotification(`📞 Calling Driver ${selectedRoute.driver}...`)}>
                <Phone size={16} /> Contact Driver
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
