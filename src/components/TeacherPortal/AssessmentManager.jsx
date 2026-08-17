import React, { useState } from 'react';
import { FileCheck, Sparkles, Plus, Clock, FileText, CheckCircle2, Eye, Download, AlertCircle, MessageSquare, Check, X, Award, Upload } from 'lucide-react';
import { escapeHtml } from '../../utils/sanitize';

export default function AssessmentManager({ teacherProfile, onTriggerNotification, onChangeTab }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(null); // assignment object
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('2026-08-20');
  const [selectedClass, setSelectedClass] = useState(teacherProfile?.assignedClasses[0] || 'Class 9-A');
  const [newAssignmentFile, setNewAssignmentFile] = useState(null);
  const [newAssignmentPoints, setNewAssignmentPoints] = useState('20');
  const [newAssignmentInstructions, setNewAssignmentInstructions] = useState('');

  // Interactive PDF Preview Modal state
  const [previewPdfModal, setPreviewPdfModal] = useState(null); // pdf object or page
  const [pdfActivePage, setPdfActivePage] = useState(0);

  // Submissions State for Assignments
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([
    {
      id: 'sub-1',
      studentName: 'Ali Ahmed',
      rollNo: '09042',
      status: 'SUBMITTED',
      submittedAt: 'Aug 10, 2026 09:30 AM',
      fileName: 'Ali_Ahmed_Physics_Assignment.pdf',
      fileSize: '2.4 MB',
      pdfPages: [
        { pageNo: 1, title: 'Page 1: Problem 1 & 2 Solutions', content: 'Problem 1: Distance vs Displacement\nSolution:\nInitial Position A = 0m, Final Position B = 10m.\nDisplacement vector Δx = x_final - x_initial = 10m - 0m = +10m.\nTotal Distance Traveled = 10m.\n\nProblem 2: Cramer\'s Rule Application\nMatrix A = [[2, 3], [1, 4]], Det|A| = (2*4) - (3*1) = 5.' },
        { pageNo: 2, title: 'Page 2: Numerical Proof & Diagram', content: 'Equation 2: S = ut + ½at²\nGiven u = 0 m/s, a = 2 m/s², t = 5 sec\nS = (0)(5) + ½(2)(5)² = 25 meters.\n\nGraph Sketch:\n[Velocity-Time Graph showing linear slope representing uniform acceleration a = 2m/s²]' }
      ],
      score: '9',
      maxScore: '10',
      teacherFeedback: 'Excellent step-by-step working and clean graph diagram!'
    },
    {
      id: 'sub-2',
      studentName: 'Ahmed Raza',
      rollNo: '09043',
      status: 'SUBMITTED',
      submittedAt: 'Aug 10, 2026 10:15 AM',
      fileName: 'Ahmed_Raza_Midterm_Paper.pdf',
      fileSize: '1.8 MB',
      pdfPages: [
        { pageNo: 1, title: 'Page 1: Numericals', content: 'v = u + at -> v = 0 + (3)(4) = 12 m/s.\nDeterminant calculated correctly.' }
      ],
      score: '8',
      maxScore: '10',
      teacherFeedback: 'Very good calculations. Check SI units on final velocity answer.'
    },
    {
      id: 'sub-3',
      studentName: 'Usman Tariq',
      rollNo: '09044',
      status: 'PENDING',
      submittedAt: null,
      fileName: null,
      pdfPages: [],
      score: '',
      maxScore: '10',
      teacherFeedback: ''
    }
  ]);

  // Submissions State for Quizzes
  const [quizSubmissions, setQuizSubmissions] = useState([
    {
      id: 'qsub-1',
      studentName: 'Ali Ahmed',
      rollNo: '09042',
      status: 'COMPLETED',
      timeTaken: '6 mins 40 secs',
      autoScore: 3,
      maxScore: 3,
      answers: [
        { qNo: 1, question: 'What represents initial velocity in v = u + at?', selected: 'u', correct: 'u', isCorrect: true },
        { qNo: 2, question: 'Slope of Distance-Time graph gives what quantity?', selected: 'Speed / Velocity', correct: 'Speed / Velocity', isCorrect: true },
        { qNo: 3, question: 'Which equation is used for distance S under acceleration?', selected: 'S = ut + ½at²', correct: 'S = ut + ½at²', isCorrect: true }
      ],
      teacherComments: 'Perfect score on MCQs!'
    },
    {
      id: 'qsub-2',
      studentName: 'Usman Tariq',
      rollNo: '09044',
      status: 'COMPLETED',
      timeTaken: '8 mins 10 secs',
      autoScore: 2,
      maxScore: 3,
      answers: [
        { qNo: 1, question: 'What represents initial velocity in v = u + at?', selected: 'u', correct: 'u', isCorrect: true },
        { qNo: 2, question: 'Slope of Distance-Time graph gives what quantity?', selected: 'Acceleration', correct: 'Speed / Velocity', isCorrect: false },
        { qNo: 3, question: 'Which equation is used for distance S under acceleration?', selected: 'S = ut + ½at²', correct: 'S = ut + ½at²', isCorrect: true }
      ],
      teacherComments: 'Review slope definition for distance vs velocity graphs.'
    }
  ]);

  const [activeStudentIdx, setActiveStudentIdx] = useState(0);
  const [currentScoreInput, setCurrentScoreInput] = useState('');
  const [currentFeedbackInput, setCurrentFeedbackInput] = useState('');

  const [assignments, setAssignments] = useState([
    { id: 'A1', title: `${teacherProfile?.primarySubject} Mid-Term Revision Set`, classTarget: teacherProfile?.assignedClasses[0] || 'Class 9-A', deadline: 'Aug 18, 2026', submitted: 2, total: 3, type: 'Assignment' },
    { id: 'Q1', title: `${teacherProfile?.primarySubject} Chapter 2 Quiz`, classTarget: teacherProfile?.assignedClasses[0] || 'Class 9-A', deadline: 'Aug 22, 2026', submitted: 2, total: 3, type: 'Quiz' }
  ]);

  const openPdfInNewTab = (studentSubmission) => {
    if (!studentSubmission || !studentSubmission.fileName) return;
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      onTriggerNotification('⚠️ Popup blocked. Please allow popups to view the PDF submission.');
      return;
    }

    const safeStudentName = escapeHtml(studentSubmission.studentName || 'Student');
    const safeRollNo = escapeHtml(studentSubmission.rollNo || '00');
    const safeFileName = escapeHtml(studentSubmission.fileName || 'Submission.pdf');
    const safeSubmittedAt = escapeHtml(studentSubmission.submittedAt || 'Recently');

    const pageContentHtml = (studentSubmission.pdfPages || []).map((p, idx) => `
      <div style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 8px; padding: 30px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; font-size: 1.2rem; color: #0f172a;">${safeStudentName} — Roll #${safeRollNo}</h2>
            <span style="font-size: 0.85rem; color: #64748b;">File: ${safeFileName} | Submitted: ${safeSubmittedAt}</span>
          </div>
          <span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">
            PAGE ${escapeHtml(p.pageNo || idx + 1)} OF ${studentSubmission.pdfPages.length}
          </span>
        </div>
        <h3 style="color: #2563eb; font-size: 1rem; margin-top: 0;">${escapeHtml(p.title || `Page ${idx + 1}`)}</h3>
        <div style="font-size: 0.95rem; line-height: 1.7; white-space: pre-line; color: #1e293b;">
          ${escapeHtml(p.content || '')}
        </div>
      </div>
    `).join('') || '<p>No document content available.</p>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${safeFileName} — Digital School PDF Viewer</title>
        <style>
          body { background-color: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 30px; margin: 0; }
          .container { max-width: 850px; margin: 0 auto; }
          .top-bar { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 15px 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #334155; }
          .btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
          .btn:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="top-bar">
            <div>
              <h3 style="margin:0; font-size: 1.1rem; color: #fff;">📄 ${safeFileName}</h3>
              <span style="font-size: 0.8rem; color: #94a3b8;">Digital School Student PDF Assignment Reader</span>
            </div>
            <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
          </div>
          ${pageContentHtml}
        </div>
      </body>
      </html>
    `;

    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    onTriggerNotification(`↗ Opened ${safeFileName} in a new tab!`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAssignModal(false);
        setShowGradingModal(null);
        setPreviewPdfModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!teacherProfile) return null;

  // Current selected assessment type
  const isQuizModal = showGradingModal?.type === 'Quiz';

  const currentGradingStudent = isQuizModal 
    ? quizSubmissions[activeStudentIdx] 
    : assignmentSubmissions[activeStudentIdx];

  const handleSaveGrade = () => {
    if (!currentGradingStudent) return;
    const maxScore = currentGradingStudent.maxScore || 10;
    const cleanScore = Math.max(0, Math.min(maxScore, Number(currentScoreInput) || 0));

    let updatedList = [];
    if (isQuizModal) {
      updatedList = quizSubmissions.map((s, idx) => idx === activeStudentIdx ? { ...s, autoScore: cleanScore, teacherComments: currentFeedbackInput } : s);
      setQuizSubmissions(updatedList);
    } else {
      updatedList = assignmentSubmissions.map((s, idx) => idx === activeStudentIdx ? { ...s, score: cleanScore, teacherFeedback: currentFeedbackInput } : s);
      setAssignmentSubmissions(updatedList);
    }

    onTriggerNotification(`✅ Saved grade & feedback for ${currentGradingStudent.studentName}!`);

    if (activeStudentIdx < updatedList.length - 1) {
      const nextIdx = activeStudentIdx + 1;
      setActiveStudentIdx(nextIdx);
      setPdfActivePage(0); // BUG-005 fix
      const nextSt = updatedList[nextIdx]; // BUG-004 fix
      setCurrentScoreInput(isQuizModal ? nextSt.autoScore : nextSt.score);
      setCurrentFeedbackInput(isQuizModal ? (nextSt.teacherComments || '') : (nextSt.teacherFeedback || ''));
    } else {
      setShowGradingModal(null);
      setPdfActivePage(0);
      onTriggerNotification(`🎉 All submissions evaluated for ${showGradingModal.title}!`);
    }
  };

  const handleDeleteAssignment = (id, title) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    onTriggerNotification(`🗑️ Deleted assessment: "${title}"`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Assessments & Submissions ({teacherProfile.primarySubject})</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAssignModal(true)}>
            <Plus size={18} />
            Create Assignment
          </button>
          <button className="btn btn-secondary" onClick={() => { if (onChangeTab) onChangeTab('ai-hub', 'quiz-gen'); onTriggerNotification(`✨ Opening AI Quiz Generator...`); }}>
            <Sparkles size={18} className="text-amber-400" />
            AI Quiz Gen
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <FileCheck size={20} className="text-blue-400" />
            <span>Active Assessments & Submissions</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {assignments.map(a => (
            <div key={a.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className={`badge ${a.type === 'Quiz' ? 'badge-amber' : 'badge-indigo'}`}>{a.type}</span>
                <span className="badge badge-blue">{a.classTarget}</span>
              </div>
              <h4 style={{ fontWeight: 700, margin: '0.5rem 0 0.25rem 0' }}>{a.title}</h4>
              {a.pdfFileName && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  📄 Attached PDF: {a.pdfFileName}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Clock size={14} /> Deadline: {a.deadline} {a.points ? `• ${a.points} Points` : ''}
              </div>
              <div style={{ margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>Submissions Received</span>
                  <strong>{a.submitted} / {a.total}</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface)', borderRadius: '3px' }}>
                  <div style={{ width: `${(a.submitted/a.total)*100}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }} 
                  onClick={() => { 
                    setShowGradingModal(a); 
                    setActiveStudentIdx(0); 
                    setPdfActivePage(0);
                    if (a.type === 'Quiz') {
                      setCurrentScoreInput(quizSubmissions[0]?.autoScore || 0);
                      setCurrentFeedbackInput(quizSubmissions[0]?.teacherComments || '');
                    } else {
                      setCurrentScoreInput(assignmentSubmissions[0]?.score || '');
                      setCurrentFeedbackInput(assignmentSubmissions[0]?.teacherFeedback || '');
                    }
                  }}
                >
                  <FileText size={15} /> Evaluate {a.type}
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', color: 'var(--accent-rose)' }}
                  onClick={() => handleDeleteAssignment(a.id, a.title)}
                  title="Delete Assessment"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create {teacherProfile.primarySubject} Assignment</h3>
              <button onClick={() => setShowAssignModal(false)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Assignment Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chapter 3 Problem Set" 
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
                />
              </div>

              {/* Upload PDF Document Field */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Upload PDF Worksheet / Reference Document
                </label>
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
                        setNewAssignmentFile(e.target.files[0]);
                        if (!newAssignmentTitle) {
                          setNewAssignmentTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                  />
                  <Upload size={22} style={{ margin: '0 auto 0.35rem', color: 'var(--accent-primary)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {newAssignmentFile ? `📄 ${newAssignmentFile.name} (${(newAssignmentFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Click or Drag PDF file here to attach'}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Supports PDF assignment sheets up to 50 MB</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Target Class</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                  >
                    {teacherProfile.assignedClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: '1 1 140px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Deadline</label>
                  <input 
                    type="date" 
                    value={newAssignmentDeadline}
                    onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)' }} 
                  />
                </div>

                <div style={{ flex: '1 1 100px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Total Points</label>
                  <input 
                    type="number" 
                    value={newAssignmentPoints}
                    onChange={(e) => setNewAssignmentPoints(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Instructions for Students (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Solve all questions on paper and upload scanned PDF answers."
                  value={newAssignmentInstructions}
                  onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => {
                  if (newAssignmentTitle) {
                    const newAssign = {
                      id: `A-${Date.now()}`,
                      title: newAssignmentTitle,
                      classTarget: selectedClass,
                      deadline: newAssignmentDeadline || '2026-08-25',
                      submitted: 0,
                      total: assignmentSubmissions.length,
                      type: 'Assignment',
                      pdfFileName: newAssignmentFile ? newAssignmentFile.name : null,
                      points: newAssignmentPoints,
                      instructions: newAssignmentInstructions
                    };
                    setAssignments(prev => [newAssign, ...prev]);
                    onTriggerNotification(`✅ Assignment "${newAssignmentTitle}" ${newAssignmentFile ? `with ${newAssignmentFile.name}` : ''} published to ${selectedClass}!`);
                    setNewAssignmentTitle('');
                    setNewAssignmentFile(null);
                    setNewAssignmentInstructions('');
                    setShowAssignModal(false);
                  }
                }}
              >
                Publish Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Submissions Evaluation Modal — Split Screen PDF Viewer & Grading Workspace */}
      {showGradingModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '1000px', width: '95%', maxHeight: '92vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <span className={`badge ${showGradingModal.type === 'Quiz' ? 'badge-amber' : 'badge-indigo'}`}>{showGradingModal.type} Evaluation Workspace</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem' }}>{showGradingModal.title}</h3>
              </div>
              <button onClick={() => setShowGradingModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            
            {/* Student Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
              {(isQuizModal ? quizSubmissions : assignmentSubmissions).map((st, idx) => (
                <button 
                  key={st.id} 
                  className={`btn ${activeStudentIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                  onClick={() => {
                    setActiveStudentIdx(idx);
                    setPdfActivePage(0);
                    setCurrentScoreInput(isQuizModal ? st.autoScore : st.score);
                    setCurrentFeedbackInput(isQuizModal ? (st.teacherComments || '') : (st.teacherFeedback || ''));
                  }}
                >
                  {st.studentName} {st.status === 'SUBMITTED' || st.status === 'COMPLETED' ? (st.score || st.autoScore !== undefined ? '✓' : '📄') : '⏳'}
                </button>
              ))}
            </div>

            {currentGradingStudent && (
              currentGradingStudent.status === 'PENDING' ? (
                <div style={{ background: 'var(--bg-card-hover)', padding: '3rem 2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                  <AlertCircle size={36} className="text-amber-400" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Submission Pending</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                    <strong>{currentGradingStudent.studentName}</strong> (Roll #{currentGradingStudent.rollNo}) has not uploaded their PDF assignment yet. Deadline: {showGradingModal.deadline}.
                  </p>
                  <button className="btn btn-primary" onClick={() => onTriggerNotification(`🔔 SMS & App Reminder sent to ${currentGradingStudent.studentName}!`)}>
                    Send Submission Reminder
                  </button>
                </div>
              ) : (
                /* Split Screen Layout: Left PDF Reader, Right Grading Panel */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  
                  {/* LEFT COLUMN: Authentic PDF Document Page Canvas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: '1 1 500px' }}>
                    {/* PDF Toolbar */}
                    <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700 }}>
                        <FileText size={16} className="text-rose-400" />
                        <span>{isQuizModal ? 'Quiz MCQs Answer Log' : currentGradingStudent.fileName}</span>
                      </div>
                      
                      {!isQuizModal && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                            onClick={() => openPdfInNewTab(currentGradingStudent)}
                          >
                            <Eye size={14} /> Open PDF in New Tab ↗
                          </button>
                          
                          {currentGradingStudent.pdfPages && (
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', marginRight: '0.25rem' }}>
                                Page {pdfActivePage + 1}/{currentGradingStudent.pdfPages.length}
                              </span>
                              <button 
                                className="btn btn-secondary" 
                                disabled={pdfActivePage === 0} 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => setPdfActivePage(prev => Math.max(0, prev - 1))}
                              >
                                ◄
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                disabled={pdfActivePage === currentGradingStudent.pdfPages.length - 1} 
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => setPdfActivePage(prev => Math.min(currentGradingStudent.pdfPages.length - 1, prev + 1))}
                              >
                                ►
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PDF Paper Sheet */}
                    {!isQuizModal ? (
                      <div 
                        style={{ background: '#ffffff', color: '#0f172a', padding: '1.75rem', borderRadius: 'var(--radius-md)', minHeight: '380px', maxHeight: '450px', overflowY: 'auto', border: '1px solid #cbd5e1', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', fontFamily: 'Arial, sans-serif' }}
                      >
                        {/* PDF Document Page Header */}
                        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: '1rem' }}>{currentGradingStudent.studentName} • Roll #{currentGradingStudent.rollNo}</h4>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted: {currentGradingStudent.submittedAt} • {currentGradingStudent.fileName}</span>
                          </div>
                          <button 
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={() => openPdfInNewTab(currentGradingStudent)}
                          >
                            <span>Open Full Screen in New Browser Tab ↗</span>
                          </button>
                        </div>

                        {/* PDF Page Title */}
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.75rem' }}>
                          {currentGradingStudent.pdfPages?.[pdfActivePage]?.title || `Page ${pdfActivePage + 1}`}
                        </div>

                        {/* PDF Written Solutions Content */}
                        <div style={{ fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line', color: '#1e293b' }}>
                          {currentGradingStudent.pdfPages?.[pdfActivePage]?.content || 'Page content loaded.'}
                        </div>
                      </div>
                    ) : (
                      /* Quiz MCQ Answer Inspection Sheet */
                      <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.95rem' }}>Student MCQ Answer Log</strong>
                          <span className="badge badge-blue">Time Taken: {currentGradingStudent.timeTaken}</span>
                        </div>

                        {currentGradingStudent.answers?.map((ans, i) => (
                          <div key={i} style={{ background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              <span>{ans.question}</span>
                              {ans.isCorrect ? (
                                <span className="badge badge-emerald"><Check size={12} /> Correct (+1)</span>
                              ) : (
                                <span className="badge badge-rose"><X size={12} /> Incorrect (0)</span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span>Selected Answer: <strong style={{ color: ans.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{ans.selected}</strong></span>
                              {!ans.isCorrect && <span>Correct Answer: <strong style={{ color: 'var(--accent-emerald)' }}>{ans.correct}</strong></span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Dedicated Evaluation & Marking Panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flex: '1 1 300px' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Teacher Evaluation Panel</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Review the student's submission on the left and enter score & feedback below.
                      </p>
                    </div>

                    {/* Score Input */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                        Awarded Score (Out of {currentGradingStudent.maxScore || 10})
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max={currentGradingStudent.maxScore || 10}
                        placeholder="Enter score..."
                        value={currentScoreInput}
                        onChange={(e) => {
                          const max = currentGradingStudent.maxScore || 10;
                          const val = Math.max(0, Math.min(max, Number(e.target.value) || 0));
                          setCurrentScoreInput(val);
                        }}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 800, outline: 'none' }}
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Quick Score Presets</label>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => setCurrentScoreInput(currentGradingStudent.maxScore || 10)}>
                          Full Marks ({currentGradingStudent.maxScore || 10})
                        </button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => setCurrentScoreInput(Math.round((currentGradingStudent.maxScore || 10) * 0.8))}>
                          80%
                        </button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => setCurrentScoreInput(Math.round((currentGradingStudent.maxScore || 10) * 0.6))}>
                          60%
                        </button>
                      </div>
                    </div>

                    {/* Teacher Feedback Textarea */}
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                        Teacher Feedback / Guidance
                      </label>
                      <textarea 
                        rows={4}
                        placeholder="Write student feedback, corrections, or improvement notes here..."
                        value={currentFeedbackInput}
                        onChange={(e) => setCurrentFeedbackInput(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                      />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', padding: '0.75rem' }} onClick={handleSaveGrade}>
                      <Award size={18} /> Save Score & Next Student
                    </button>
                  </div>

                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Full Screen PDF Document Preview Modal */}
      {previewPdfModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '700px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} className="text-rose-400" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>PDF Submission: {previewPdfModal.fileName}</h3>
              </div>
              <button onClick={() => setPreviewPdfModal(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.82rem' }}>
              <span>Student: <strong>{previewPdfModal.studentName}</strong> (Roll: #{previewPdfModal.rollNo})</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {previewPdfModal.pdfPages?.map((p, idx) => (
                  <button key={idx} className={`btn ${pdfActivePage === idx ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setPdfActivePage(idx)}>
                    Page {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Full PDF Page Container */}
            <div style={{ background: '#fff', color: '#1e293b', padding: '2rem', borderRadius: 'var(--radius-md)', minHeight: '320px', fontFamily: 'Courier New, monospace', fontSize: '0.9rem', lineHeight: 1.6, border: '1px solid #cbd5e1', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflowY: 'auto', maxHeight: '380px' }}>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{previewPdfModal.studentName}</strong><br />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Submitted PDF Document Page {pdfActivePage + 1} of {previewPdfModal.pdfPages?.length || 1}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 'bold' }}>VERIFIED DIGITAL SUBMISSION</span>
              </div>

              <div style={{ whiteSpace: 'pre-line' }}>
                {previewPdfModal.pdfPages?.[pdfActivePage]?.content || 'Page content rendering...'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Digital School Document Viewer v2.4</span>
              <button className="btn btn-primary" onClick={() => setPreviewPdfModal(null)}>Done Viewing</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
