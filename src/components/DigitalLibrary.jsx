import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  FileText, 
  Download, 
  BookOpen, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function DigitalLibrary({ schoolData, onTriggerNotification }) {
  const { libraryResources } = schoolData;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = libraryResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Library Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Digital Resource & E-Library 📚</h2>
            <span className="badge badge-emerald">{libraryResources.length} E-Books Available</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Access Class 8-10 Textbooks, Past Solved Papers, Lab Manuals & Reference Material.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search e-books, past papers (e.g. Class 9 Physics)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Textbook', 'Lab Guide', 'E-Book', 'Past Papers'].map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredResources.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Library size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Resources Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try adjusting your search term or category filter.</p>
          </div>
        ) : (
          filteredResources.map(res => (
          <div key={res.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-emerald">{res.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.format} • {res.size}</span>
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '1.05rem', margin: '0.4rem 0' }}>{res.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Subject: <strong>{res.subject}</strong> | Pages: <strong>{res.pages}</strong></p>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                onClick={() => onTriggerNotification(`📖 Opened digital reader for "${res.title}"`)}
              >
                <BookOpen size={16} /> Read E-Book
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem' }}
                onClick={() => onTriggerNotification(`📄 Downloading ${res.title}`)}
                title="Download PDF"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
          ))
        )}
      </div>

    </div>
  );
}
