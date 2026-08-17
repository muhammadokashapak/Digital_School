import React, { useState } from 'react';
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Upload, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';

export default function LmsPortal({ schoolData, onStartQuiz, onTriggerNotification }) {
  const { lms } = schoolData;
  const [selectedCourseId, setSelectedCourseId] = useState(lms[0].id);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [fileInputName, setFileInputName] = useState('');

  const currentCourse = lms.find(c => c.id === selectedCourseId) || lms[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* LMS Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Digital Learning Management System (LMS) 📚</h2>
            <span className="badge badge-emerald">Class 9 Courses</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Structured Learning Pipeline: Class → Subject → Chapter → Video → PDF Notes → Quiz → Assignment
          </p>
        </div>
      </div>

      {/* Course Switcher Tabs */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {lms.map(course => (
          <div
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            style={{
              flex: '1',
              minWidth: '220px',
              background: course.id === selectedCourseId ? 'var(--accent-gradient)' : 'var(--bg-card)',
              color: course.id === selectedCourseId ? '#ffffff' : 'var(--text-main)',
              border: 'var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: course.id === selectedCourseId ? 'var(--shadow-lg)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>{course.code}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{course.progress}%</span>
            </div>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{course.subject}</h4>
            <span style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginTop: '0.2rem' }}>{course.teacher}</span>
          </div>
        ))}
      </div>

      {/* Selected Course Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chapters & Lessons Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
          {currentCourse.chapters.map(chapter => (
            <div key={chapter.id} className="glass-card">
              <div className="card-header" style={{ marginBottom: '1rem' }}>
                <div className="card-title" style={{ fontSize: '1.05rem' }}>
                  <BookOpen size={18} className="text-blue-400" />
                  <span>{chapter.title}</span>
                </div>
              </div>

              {/* Lessons List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {chapter.lessons.map(lesson => (
                  <div 
                    key={lesson.id}
                    style={{
                      background: 'var(--bg-card-hover)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {lesson.type === 'video' ? (
                        <PlayCircle size={20} className="text-emerald-400" />
                      ) : (
                        <FileText size={20} className="text-indigo-400" />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lesson.title}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lesson.type === 'video' ? `Video Lecture • ${lesson.duration}` : `PDF Notes • ${lesson.fileSize}`}
                        </span>
                      </div>
                    </div>

                    <div>
                      {lesson.type === 'video' ? (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={() => setActiveVideoModal(lesson)}
                        >
                          Watch Video
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={() => setActivePdfModal(lesson)}
                        >
                          Open PDF Notes
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Chapter Quiz if available */}
                {chapter.quiz && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpCircle size={20} className="text-amber-400" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{chapter.quiz.title}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {chapter.quiz.questionsCount} Questions • Time Limit: {chapter.quiz.timeLimit}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', background: 'var(--accent-amber)' }}
                      onClick={() => onStartQuiz(chapter.quiz.id)}
                    >
                      Attempt Quiz
                    </button>
                  </div>
                )}

                {/* Chapter Assignment if available */}
                {chapter.assignment && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Upload size={20} className="text-indigo-400" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{chapter.assignment.title}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Deadline: {chapter.assignment.deadline} • Status: <strong className="text-amber-400">{chapter.assignment.status}</strong>
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => setShowSubmitModal(chapter.assignment)}
                    >
                      Submit Homework
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Subject Stats & Teacher Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <div className="card-title" style={{ marginBottom: '1rem' }}>
              <span>Course Metadata</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Instructor:</span>
                <strong>{currentCourse.teacher}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Class Code:</span>
                <strong>{currentCourse.code}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Exam:</span>
                <strong>Board Assessment 2026</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '800px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🎥 Video Lecture: {activeVideoModal.title}</h3>
              <button onClick={() => setActiveVideoModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ width: '100%', height: '400px', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={activeVideoModal.videoUrl} 
                title={activeVideoModal.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {activePdfModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '720px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📄 PDF Notes: {activePdfModal.title}</h3>
              <button onClick={() => setActivePdfModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ background: 'var(--bg-card-hover)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <FileText size={48} className="text-indigo-400" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: 800 }}>{activePdfModal.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem 0' }}>
                File Size: {activePdfModal.fileSize} • High Resolution Digital Study Notes
              </p>
              <button className="btn btn-primary" onClick={() => onTriggerNotification(`📄 Started download of "${activePdfModal.title}"`)}>
                Download PDF File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Upload Assignment Submission</h3>
              <button onClick={() => setShowSubmitModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Target: <strong>{showSubmitModal.title}</strong>
              </p>
              <input 
                type="text" 
                placeholder="Enter submission notes or attachment name (e.g. Ali_Ahmed_Math_Ch2.pdf)..."
                value={fileInputName}
                onChange={(e) => setFileInputName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onTriggerNotification(`🎉 Assignment "${showSubmitModal.title}" submitted successfully for grading!`);
                  setFileInputName('');
                  setShowSubmitModal(null);
                }}
              >
                Submit Answer Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
