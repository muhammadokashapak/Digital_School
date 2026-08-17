import React, { useEffect } from 'react';
import { Download, ShieldCheck, X } from 'lucide-react';
import { openPdfDocument } from '../utils/pdfPrinter';

export default function ReportCardModal({ schoolData, student, onClose, onTriggerNotification }) {
  const { examResults, schoolName = 'Apex Digital School System', academicYear = '2026-2027' } = schoolData;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const studentName = student?.name || examResults?.studentName || 'Student';
  const studentRollNo = student?.rollNo || '09042';
  const studentGrade = student?.grade || examResults?.grade || 'Class 9-A';
  const studentGpa = student?.gpa ? `${student.gpa} / 4.0` : examResults?.gpa || '3.8 / 4.0';
  const overallGrade = student?.overallGrade || examResults?.gradeLetter || 'A';
  const rank = examResults?.rankInClass || '#4 of 38';

  const subjects = examResults?.subjects || [
    { name: 'Mathematics', marks: 92, total: 100, grade: 'A+', remarks: 'Outstanding analytical and algebraic skills.' },
    { name: 'Physics', marks: 88, total: 100, grade: 'A', remarks: 'Strong theoretical grasp; focus on numerical speed.' },
    { name: 'Computer Science', marks: 95, total: 100, grade: 'A+', remarks: 'Exemplary programming and computational thinking.' },
    { name: 'English Literature', marks: 84, total: 100, grade: 'A', remarks: 'Good critical writing and vocabulary skills.' },
    { name: 'General Science', marks: 90, total: 100, grade: 'A+', remarks: 'High curiosity in scientific method.' }
  ];

  const handleDownloadPdfTranscript = () => {
    openPdfDocument({
      title: `Official Academic Transcript — ${studentName}`,
      subtitle: `Session: ${academicYear} • Class: ${studentGrade} • Roll #${studentRollNo}`,
      documentType: 'OFFICIAL REPORT CARD',
      author: 'Office of the Examination Controller',
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: 'Student Academic Credentials',
          bullets: [
            `Student Name: ${studentName}`,
            `Roll Number: #${studentRollNo}`,
            `Class & Section: ${studentGrade}`,
            `Cumulative GPA: ${studentGpa} (Grade ${overallGrade})`,
            `Class Standing: ${rank}`
          ]
        }
      ],
      tables: [
        {
          title: 'Mid-Term Examination Result Matrix',
          headers: ['Subject Name', 'Marks Obtained', 'Max Marks', 'Grade', 'Teacher Evaluation'],
          rows: subjects.map(s => [
            s.name,
            `${s.marks}`,
            `${s.total}`,
            s.grade,
            s.remarks
          ])
        }
      ],
      footerNote: 'Apex Digital School System • Officially Verified Academic Document'
    });
    onTriggerNotification(`📄 Official PDF Report Card generated for ${studentName}!`);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: '780px', padding: '2.5rem' }}>
        
        {/* Report Card Header */}
        <div style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>OFFICIAL ACADEMIC TRANSCRIPT</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{schoolName}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Academic Session: {academicYear} | Board Examination Assessment</p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>{studentGpa.split(' ')[0]}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUMULATIVE GPA</span>
            </div>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.5rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Student Profile Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-card-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Student Name:</span> <br/><strong>{studentName}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Roll Number:</span> <br/><strong>#{studentRollNo}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Class & Section:</span> <br/><strong>{studentGrade}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Class Position:</span> <br/><strong>{rank}</strong>
          </div>
        </div>

        {/* Marks Table */}
        <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{sub.name}</td>
                  <td style={{ fontWeight: 800, color: sub.marks >= 90 ? 'var(--accent-emerald)' : 'var(--accent-primary)' }}>{sub.marks}</td>
                  <td>{sub.total}</td>
                  <td><span className="badge badge-emerald">{sub.grade}</span></td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
              <ShieldCheck size={18} /> Verified Digital Signature
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued by Examination Controller & Principal</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPdfTranscript}
            >
              <Download size={16} /> Download PDF Transcript
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
