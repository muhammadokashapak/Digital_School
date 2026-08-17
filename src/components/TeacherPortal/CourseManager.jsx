import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Upload, Plus, Layers, Trash2, Sparkles, Send, Eye, FileCheck, HelpCircle } from 'lucide-react';
import { openPdfDocument } from '../../utils/pdfPrinter';

export default function CourseManager({ teacherProfile, schoolData, onTriggerNotification }) {
  // Filter courses based on teacher's assigned courses
  const myCourses = schoolData.lms.filter(course => teacherProfile.assignedCourses.includes(course.id));
  const [localCourses, setLocalCourses] = useState(myCourses);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(null);
  const [showAddChapterModal, setShowAddChapterModal] = useState(null); // courseId
  const [manageCourse, setManageCourse] = useState(null); // course object
  
  // Active Detailed Chapter Workspace Modal
  const [activeChapterDetails, setActiveChapterDetails] = useState(null); // { courseId, chapter }
  
  // Add Item to Chapter Modal
  const [showAddItemModal, setShowAddItemModal] = useState(false); // boolean
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('pdf'); // 'pdf', 'video', 'exercise', 'quiz', 'test'
  const [newItemDetail, setNewItemDetail] = useState('');
  const [newItemFile, setNewItemFile] = useState(null); // uploaded file name
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemDuration, setNewItemDuration] = useState('15 mins');
  const [newItemVideoUrl, setNewItemVideoUrl] = useState('');

  // Assign Item to Students Modal
  const [assigningItem, setAssigningItem] = useState(null); // item object
  const [assignTargetClass, setAssignTargetClass] = useState(teacherProfile?.assignedClasses[0] || 'Class 9-A');
  const [assignDeadline, setAssignDeadline] = useState('2026-08-25');
  const [assignPoints, setAssignPoints] = useState('20');
  const [assignInstructions, setAssignInstructions] = useState('');

  const [newCourseName, setNewCourseName] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddChapter = (courseId) => {
    if (!newChapterTitle.trim()) return;
    const newChap = { 
      id: `chap-${Date.now()}`, 
      title: newChapterTitle, 
      items: [
        { id: `item-${Date.now()}-1`, title: 'Introductory Concept Overview', type: 'video', detail: '15 mins', isPublished: true },
        { id: `item-${Date.now()}-2`, title: 'Chapter Worksheet & Problem Set', type: 'exercise', detail: '5 Questions', isPublished: true }
      ]
    };
    
    setLocalCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedCourse = { ...c, chapters: [...(c.chapters || []), newChap] };
        if (manageCourse && manageCourse.id === courseId) setManageCourse(updatedCourse);
        return updatedCourse;
      }
      return c;
    }));
    onTriggerNotification(`✅ Chapter "${newChapterTitle}" added successfully!`);
    setNewChapterTitle('');
    setShowAddChapterModal(null);
  };

  // Toggle item published checkmark in active chapter
  const handleToggleItemPublished = (itemId) => {
    if (!activeChapterDetails) return;
    const { courseId, chapter } = activeChapterDetails;

    const updatedItems = (chapter.items || []).map(it => {
      if (it.id === itemId) {
        const newStatus = !it.isPublished;
        onTriggerNotification(newStatus ? `✅ "${it.title}" published to students.` : `⏸️ "${it.title}" marked as draft.`);
        return { ...it, isPublished: newStatus };
      }
      return it;
    });

    const updatedChapter = { ...chapter, items: updatedItems };

    setLocalCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedChapters = c.chapters.map(ch => ch.id === chapter.id ? updatedChapter : ch);
        return { ...c, chapters: updatedChapters };
      }
      return c;
    }));

    setActiveChapterDetails({ courseId, chapter: updatedChapter });
  };

  // Delete item from active chapter
  const handleDeleteItem = (itemId) => {
    if (!activeChapterDetails) return;
    const { courseId, chapter } = activeChapterDetails;

    const updatedItems = (chapter.items || []).filter(it => it.id !== itemId);
    const updatedChapter = { ...chapter, items: updatedItems };

    setLocalCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedChapters = c.chapters.map(ch => ch.id === chapter.id ? updatedChapter : ch);
        return { ...c, chapters: updatedChapters };
      }
      return c;
    }));

    setActiveChapterDetails({ courseId, chapter: updatedChapter });
    onTriggerNotification(`🗑️ Item removed from chapter.`);
  };

  // View PDF Item in separate tab using pdfPrinter helper
  const handleViewPdfItem = (item) => {
    openPdfDocument({
      title: item.title,
      subtitle: item.desc || `Study Notes Document attached to ${activeChapterDetails?.chapter?.title || 'Chapter'}`,
      documentType: 'PDF STUDY NOTES',
      author: teacherProfile.name,
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: 'Document Overview',
          content: item.desc || `Official curriculum study notes for ${teacherProfile.primarySubject}. Includes core concepts, diagrams, and numerical practice questions.`
        },
        {
          title: 'Key Concepts & Formula Sheet',
          bullets: [
            'Foundational Principles & Standard Definitions',
            'Derivations and Mathematical Formulas',
            'Worked Examples with Step-by-Step Solutions',
            'Chapter End Self-Assessment Exercises'
          ]
        }
      ],
      footerNote: `Attached File: ${item.fileName || 'Document.pdf'} (${item.detail || '2.4 MB'})`
    });
    onTriggerNotification(`📄 Opened "${item.title}" as PDF Document in new tab.`);
  };

  // Add new item (lecture, exercise, test, quiz) to active chapter
  const handleAddItemToChapter = () => {
    if (!newItemTitle.trim() || !activeChapterDetails) return;
    const { courseId, chapter } = activeChapterDetails;

    let computedDetail = newItemDetail;
    if (newItemType === 'pdf') {
      computedDetail = `${newItemFile ? newItemFile.name : 'Study_Notes.pdf'} • ${newItemDuration || '15 Mins Read'}`;
    } else if (newItemType === 'video') {
      computedDetail = `${newItemDuration || '20 mins'} video • HD Lecture`;
    } else if (!computedDetail) {
      computedDetail = newItemType === 'exercise' ? '10 Questions • 20 Marks' : '15 Mins • 10 Questions';
    }

    const newItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      type: newItemType,
      detail: computedDetail,
      fileName: newItemFile ? newItemFile.name : (newItemType === 'pdf' ? `${newItemTitle.replace(/\s+/g, '_')}_Notes.pdf` : null),
      desc: newItemDesc,
      videoUrl: newItemVideoUrl,
      isPublished: true,
      isAssigned: false
    };

    const updatedItems = [...(chapter.items || []), newItem];
    const updatedChapter = { ...chapter, items: updatedItems };

    setLocalCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedChapters = c.chapters.map(ch => ch.id === chapter.id ? updatedChapter : ch);
        return { ...c, chapters: updatedChapters };
      }
      return c;
    }));

    setActiveChapterDetails({ courseId, chapter: updatedChapter });
    setShowAddItemModal(false);
    setNewItemTitle('');
    setNewItemDetail('');
    setNewItemFile(null);
    setNewItemDesc('');
    setNewItemDuration('15 mins');
    setNewItemVideoUrl('');
    onTriggerNotification(`✨ Added new ${newItemType.toUpperCase()}: "${newItemTitle}"`);
  };

  // Assign exercise / test / quiz to students
  const handleConfirmAssignment = () => {
    if (!assigningItem) return;
    onTriggerNotification(`📢 Assigned "${assigningItem.title}" to ${assignTargetClass}! Due: ${assignDeadline} (${assignPoints} Points)`);
    
    // Mark item as assigned in active chapter
    if (activeChapterDetails) {
      const { courseId, chapter } = activeChapterDetails;
      const updatedItems = (chapter.items || []).map(it => it.id === assigningItem.id ? { ...it, isAssigned: true } : it);
      const updatedChapter = { ...chapter, items: updatedItems };

      setLocalCourses(prev => prev.map(c => {
        if (c.id === courseId) {
          const updatedChapters = c.chapters.map(ch => ch.id === chapter.id ? updatedChapter : ch);
          return { ...c, chapters: updatedChapters };
        }
        return c;
      }));

      setActiveChapterDetails({ courseId, chapter: updatedChapter });
    }

    setAssigningItem(null);
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-blue-400" />;
      case 'pdf': return <FileText size={16} className="text-rose-400" />;
      case 'exercise': return <FileCheck size={16} className="text-emerald-400" />;
      case 'quiz': return <Sparkles size={16} className="text-amber-400" />;
      case 'test': return <HelpCircle size={16} className="text-purple-400" />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Courses ({teacherProfile.primarySubject})</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <BookOpen size={16} /> Create Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {localCourses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ 
              height: '120px', 
              backgroundImage: `url(${course.banner})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {course.code}
              </div>
            </div>
            
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-indigo">{course.class}</span>
                <span className="badge badge-emerald">{course.subject}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>{course.subject} - {course.class}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.chapters.length === 0 ? (
                  <div style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No chapters added yet.
                  </div>
                ) : (
                  course.chapters.map(chapter => {
                    // Populate default items if not present
                    const items = chapter.items || [
                      { id: `l-${chapter.id}-1`, title: `${chapter.title} Lecture & Notes`, type: 'video', detail: '20 mins', isPublished: true },
                      { id: `q-${chapter.id}-1`, title: `${chapter.title} Practice Quiz`, type: 'quiz', detail: '5 Questions', isPublished: true }
                    ];
                    const chapObj = { ...chapter, items };

                    return (
                      <div 
                        key={chapter.id} 
                        style={{ 
                          background: 'var(--bg-surface)', 
                          padding: '0.85rem', 
                          borderRadius: 'var(--radius-md)', 
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setActiveChapterDetails({ courseId: course.id, chapter: chapObj })}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{chapter.title}</div>
                          <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{items.length} Items</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span>Click to open workspace & assign exercises ➔</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }} onClick={() => setShowAddChapterModal(course.id)}>
                  <Plus size={14} /> Add Chapter
                </button>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={() => setManageCourse(course)}>
                <Layers size={16} /> Manage Course Content
              </button>
            </div>
          </div>
        ))}
        {localCourses.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No courses assigned. Contact the department head.
          </div>
        )}
      </div>

      {/* Chapter Workspace Modal */}
      {activeChapterDetails && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-indigo">Chapter Workspace</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>{activeChapterDetails.chapter.title}</h3>
              </div>
              <button onClick={() => setActiveChapterDetails(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total Items: <strong>{activeChapterDetails.chapter.items?.length || 0}</strong> | Active Student Target: <strong>{teacherProfile?.assignedClasses?.[0] || 'Class 9-A'}</strong>
              </div>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => setShowAddItemModal(true)}>
                <Plus size={14} /> Add Content Item
              </button>
            </div>

            {/* Chapter Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {(!activeChapterDetails.chapter.items || activeChapterDetails.chapter.items.length === 0) ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
                  No items in this chapter yet. Click "Add Content Item" to add lectures, tests, or exercises.
                </div>
              ) : (
                activeChapterDetails.chapter.items.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      justify: 'space-between', 
                      alignItems: 'center', 
                      background: 'var(--bg-surface)', 
                      padding: '0.85rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
                      {/* Checkmark Toggle */}
                      <input 
                        type="checkbox" 
                        checked={!!item.isPublished} 
                        onChange={() => handleToggleItemPublished(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-emerald)' }}
                        title="Toggle Published / Active Status"
                      />

                      {getItemIcon(item.type)}

                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, textDecoration: item.isPublished ? 'none' : 'line-through', opacity: item.isPublished ? 1 : 0.6 }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{item.type}</span>
                          <span>• {item.detail}</span>
                          {item.isAssigned && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Assigned</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {item.type === 'pdf' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', gap: '0.2rem' }}
                          onClick={() => handleViewPdfItem(item)}
                        >
                          <Eye size={12} /> View PDF
                        </button>
                      )}

                      {['exercise', 'quiz', 'test'].includes(item.type) && (
                        <button 
                          className={`btn ${item.isAssigned ? 'btn-secondary' : 'btn-primary'}`} 
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => setAssigningItem(item)}
                        >
                          <Send size={12} /> {item.isAssigned ? 'Re-Assign' : 'Assign to Students'}
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--accent-rose)' }} 
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setActiveChapterDetails(null)}>Close Workspace</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Content to Chapter</h3>
              <button onClick={() => setShowAddItemModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Item Type</label>
                <select 
                  value={newItemType} 
                  onChange={(e) => setNewItemType(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', fontWeight: 700 }}
                >
                  <option value="pdf">📄 PDF Study Notes & Documents</option>
                  <option value="video">🎥 Video Lecture</option>
                  <option value="exercise">📝 Practice Exercise / Worksheet</option>
                  <option value="quiz">⚡ Interactive Quiz</option>
                  <option value="test">📋 Chapter Test / Exam</option>
                </select>
              </div>

              {/* PDF Study Notes specific fields */}
              {newItemType === 'pdf' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Document Name / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chapter 3 Vector Addition Numerical Sheet" 
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Upload PDF Document</label>
                    <div style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      textAlign: 'center',
                      background: 'var(--bg-card-hover)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      <input 
                        type="file" 
                        accept=".pdf"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewItemFile(e.target.files[0]);
                            if (!newItemTitle) {
                              setNewItemTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                            }
                          }
                        }}
                      />
                      <Upload size={22} style={{ margin: '0 auto 0.35rem', color: 'var(--accent-primary)' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {newItemFile ? `📄 ${newItemFile.name} (${(newItemFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Click or Drag PDF file here'}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Supports PDF documents up to 50 MB</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Reading Duration / Page Count</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 12 Pages • 20 Mins" 
                        value={newItemDuration}
                        onChange={(e) => setNewItemDuration(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Notes Description (Optional)</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Solved numerical sheet with step-by-step solutions for Chapter 3." 
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', resize: 'vertical' }}
                    />
                  </div>
                </>
              )}

              {/* Video Lecture specific fields */}
              {newItemType === 'video' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Video Lecture Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lecture 3: Vector Addition Concept & Derivation" 
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Upload Video File / Video URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://youtube.com/watch?v=sample or select MP4 file" 
                      value={newItemVideoUrl}
                      onChange={(e) => setNewItemVideoUrl(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', marginBottom: '0.5rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Video Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 25 Mins" 
                      value={newItemDuration}
                      onChange={(e) => setNewItemDuration(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>
                </>
              )}

              {/* Practice Exercise / Quiz / Test fields */}
              {['exercise', 'quiz', 'test'].includes(newItemType) && (
                <>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      {newItemType === 'exercise' ? 'Worksheet Title' : newItemType === 'quiz' ? 'Quiz Title' : 'Exam Title'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={newItemType === 'exercise' ? "e.g. Chapter 3 Vector Practice Sheet" : "e.g. Weekly Concept Test"} 
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Questions / Points / Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10 Questions • 20 Marks or 30 Mins" 
                      value={newItemDetail}
                      onChange={(e) => setNewItemDetail(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                    />
                  </div>
                </>
              )}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAddItemToChapter}>
              Add Item to Chapter
            </button>
          </div>
        </div>
      )}

      {/* Assign Item to Students Modal */}
      {assigningItem && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Assign to Students</h3>
              <button onClick={() => setAssigningItem(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            
            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '0.95rem' }}>{assigningItem.title}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Type: {assigningItem.type.toUpperCase()} • {assigningItem.detail}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Target Class / Group</label>
                <select 
                  value={assignTargetClass}
                  onChange={(e) => setAssignTargetClass(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                >
                  {teacherProfile?.assignedClasses?.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={assignDeadline}
                    onChange={(e) => setAssignDeadline(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Max Points</label>
                  <input 
                    type="number" 
                    value={assignPoints}
                    onChange={(e) => setAssignPoints(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Instructions for Students (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Complete all 5 numerical problems and show working steps."
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleConfirmAssignment}>
              <Send size={16} /> Publish Assignment to {assignTargetClass}
            </button>
          </div>
        </div>
      )}

      {/* General Modals */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create New Course</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <input 
              type="text" 
              placeholder="e.g. Advanced Mathematics" 
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', marginBottom: '1rem' }}
            />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
              if (newCourseName) {
                setLocalCourses([...localCourses, {
                  id: `C-${Date.now()}`,
                  code: 'NEW-101',
                  subject: newCourseName,
                  class: teacherProfile.assignedClasses[0] || 'Class 9-A',
                  banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
                  chapters: [{ id: 'ch-1', title: 'Chapter 1: Introduction', items: [{ id: 'it-1', title: 'Introduction Video', type: 'video', detail: '10 mins', isPublished: true }] }]
                }]);
                setShowCreateModal(false);
                setNewCourseName('');
                onTriggerNotification(`✅ Course "${newCourseName}" created successfully!`);
              }
            }}>
              Save Course
            </button>
          </div>
        </div>
      )}

      {showAddChapterModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add New Chapter</h3>
              <button onClick={() => setShowAddChapterModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <input 
              type="text" 
              placeholder="e.g. Chapter 4: Vector Algebra" 
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', marginBottom: '1rem' }}
            />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleAddChapter(showAddChapterModal)}>
              Add Chapter
            </button>
          </div>
        </div>
      )}

      {manageCourse && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Course Manager: {manageCourse.subject}</h3>
              <button onClick={() => setManageCourse(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Class Target: <strong>{manageCourse.class}</strong> | Code: <strong>{manageCourse.code}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Syllabus & Chapters ({manageCourse.chapters?.length || 0})</h4>
              {manageCourse.chapters?.map((chap, i) => (
                <div key={chap.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{chap.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chap.items?.length || 2} Learning Items Attached</div>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => {
                      setManageCourse(null);
                      setActiveChapterDetails({ courseId: manageCourse.id, chapter: chap });
                    }}
                  >
                    Open Workspace ➔
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setShowAddChapterModal(manageCourse.id);
              }}>
                <Plus size={16} /> Add Chapter
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                setManageCourse(null);
                onTriggerNotification(`✅ Course syllabus updated for ${manageCourse.subject}.`);
              }}>
                Close & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Upload {showUploadModal.type === 'lecture' ? 'Lecture Video' : 'PDF Notes'}</h3>
              <button onClick={() => setShowUploadModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Uploading to: <strong>{showUploadModal.chapter}</strong>
            </p>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1rem', cursor: 'pointer', background: 'var(--bg-card-hover)' }}>
              <Upload size={24} style={{ margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
              <div style={{ fontSize: '0.85rem' }}>Click to browse or drag file here</div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
              setShowUploadModal(null);
              onTriggerNotification(`✅ Successfully uploaded ${showUploadModal.type} to ${showUploadModal.chapter}.`);
            }}>
              Upload File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
