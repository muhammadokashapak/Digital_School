import React from 'react';
import { 
  Award, 
  BarChart2, 
  Printer
} from 'lucide-react';

export default function ExamPortal({ schoolData, onOpenReportCard, onTriggerNotification }) {
  const { examResults } = schoolData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Exam Header */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Examination & Grading Management 📝</h2>
            <span className="badge badge-amber">Assessment Dept</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Automated MCQ checking, manual subjective marks entry, GPA calculation & digital report card publishing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenReportCard}>
            <Award size={18} />
            View Student Report Card
          </button>
          <button className="btn btn-secondary" onClick={() => onTriggerNotification('📄 Official Class 9-A Marksheet exported to PDF.')}>
            <Printer size={18} />
            Print Class Marksheet
          </button>
        </div>
      </div>

      {/* Mid-Term Assessment Preview Card */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <BarChart2 size={20} className="text-amber-400" />
            <span>Class 9-A — Mid-Term Examination Result Card Breakdown</span>
          </div>
          <span className="badge badge-emerald">GPA: {examResults.gpa}</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Grade</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {examResults.subjects.map((sub, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 700 }}>{sub.name}</td>
                  <td style={{ fontWeight: 800, color: sub.marks >= 90 ? 'var(--accent-emerald)' : 'var(--accent-primary)' }}>{sub.marks}</td>
                  <td>{sub.total}</td>
                  <td>
                    <span className={`badge ${sub.grade.includes('+') ? 'badge-emerald' : 'badge-blue'}`}>
                      {sub.grade}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
