import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Presentation
} from 'lucide-react';
import { generatePptxFile } from '../utils/pptxGenerator';
import { openPdfDocument } from '../utils/pdfPrinter';

export default function PresentationViewerModal({ 
  isOpen, 
  onClose, 
  presentationData, 
  subjectName, 
  teacherProfile, 
  onTriggerNotification 
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !presentationData) return null;

  const slides = presentationData.slides || [];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleDownloadPptx = () => {
    try {
      generatePptxFile({
        title: presentationData.title || `Lecture Presentation Deck: ${subjectName}`,
        subject: subjectName || 'Physics & Mathematics',
        teacherName: teacherProfile?.name || 'Prof. Sarah Khan',
        targetClass: teacherProfile?.assignedClasses?.[0] || 'Class 9-A',
        slides: slides
      });
      onTriggerNotification('📥 Downloaded PowerPoint (.pptx) file successfully!');
    } catch (err) {
      console.error('PPTX Generation Error:', err);
      onTriggerNotification('⚠️ Failed to generate PPTX file.');
    }
  };

  const handleOpenPdfDeck = () => {
    openPdfDocument({
      title: presentationData.title || `Slide Deck Presentation: ${subjectName}`,
      subtitle: `Target Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} • Widescreen Slide Deck`,
      documentType: 'PPT PRESENTATION SLIDE DECK',
      author: teacherProfile?.name || 'Prof. Sarah Khan',
      date: new Date().toLocaleDateString(),
      sections: slides.map((s, i) => ({
        title: `[SLIDE ${i + 1}] ${s.title}`,
        content: s.content,
        bullets: s.bullets
      })),
      footerNote: 'Generated via AI Slide Deck Engine • Apex Digital School System'
    });
    onTriggerNotification('📄 Opened Presentation Deck as PDF in new tab.');
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(5, 7, 15, 0.88)', zIndex: 9999 }}>
      <div 
        className="glass-card" 
        style={{ 
          width: isFullscreen ? '98vw' : '92vw', 
          maxWidth: isFullscreen ? 'none' : '1100px', 
          height: isFullscreen ? '95vh' : 'auto',
          maxHeight: '94vh',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#0f172a',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
              <Presentation size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                {presentationData.title || 'AI Interactive Slide Presentation'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                PowerPoint Slide Deck • {totalSlides} Widescreen Slides • {subjectName}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '0.8rem', gap: '0.35rem', padding: '0.45rem 0.85rem' }}
              onClick={handleDownloadPptx}
              title="Download Microsoft PowerPoint .pptx File"
            >
              <Download size={15} /> Download PowerPoint (.pptx)
            </button>

            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', gap: '0.35rem', padding: '0.45rem 0.85rem' }}
              onClick={handleOpenPdfDeck}
              title="Open Printable Slide Deck as PDF"
            >
              <ExternalLink size={15} className="text-indigo-400" /> Open PDF Deck
            </button>

            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem' }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presenter Mode'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem', borderRadius: '50%' }}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 16:9 Presentation Canvas Display */}
        <div style={{ 
          flex: 1, 
          minHeight: '380px',
          aspectRatio: '16 / 9',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem 2.5rem',
          position: 'relative',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          {/* Decorative Slide Background Accents */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', filter: 'blur(50px)' }} />

          {/* Slide Top Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {subjectName} • Class 9-A
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
              APEX DIGITAL SCHOOL PPT
            </span>
          </div>

          {/* Slide Main Body Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem 0', position: 'relative', zIndex: 1 }}>
            <h2 style={{ 
              fontSize: currentSlideIndex === 0 ? '2rem' : '1.6rem', 
              fontWeight: 800, 
              color: '#ffffff', 
              marginBottom: '1.25rem',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {currentSlide?.title || 'Slide Title'}
            </h2>

            {/* Bullets or Paragraph */}
            {currentSlide?.bullets ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentSlide.bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', marginTop: '6px', shrink: 0 }} />
                    <span style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                fontSize: '1.05rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                background: 'rgba(255,255,255,0.03)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                {currentSlide?.content}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Instructor: <strong>{teacherProfile?.name || 'Prof. Sarah Khan'}</strong>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Apex Interactive Slide Deck Engine
            </span>
          </div>
        </div>

        {/* Slide Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            style={{ opacity: currentSlideIndex === 0 ? 0.5 : 1, padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            <ChevronLeft size={16} /> Previous Slide
          </button>

          {/* Slide Dots Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: idx === currentSlideIndex ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: idx === currentSlideIndex ? 'var(--accent-primary)' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            style={{ opacity: currentSlideIndex === totalSlides - 1 ? 0.5 : 1, padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            Next Slide <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
