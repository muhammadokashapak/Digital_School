import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  BarChart2, 
  FileText, 
  Lightbulb, 
  Zap,
  Upload,
  ExternalLink,
  Presentation,
  FileCheck,
  Download
} from 'lucide-react';
import { openPdfDocument } from '../utils/pdfPrinter';
import { generatePptxFile } from '../utils/pptxGenerator';
import { filterContent } from '../utils/sanitize';
import PresentationViewerModal from './PresentationViewerModal';

export default function AiHub({ schoolData, teacherProfile, currentRole, initialTab = 'tutor', onTriggerNotification }) {
  const isStudent = currentRole === 'STUDENT';
  const [activeTab, setActiveTab] = useState(isStudent && initialTab === 'teacher-asst' ? 'tutor' : (initialTab || 'tutor'));
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI Tutor', text: `Hello! I am your 24/7 AI Academic Engine. Ask me any step-by-step questions in ${teacherProfile?.primarySubject || 'Mathematics, Physics, or Computer Science'}!` }
  ]);
  const [quizTopic, setQuizTopic] = useState(`${teacherProfile?.primarySubject || 'Physics'} Chapter 3 Concept Check`);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [teacherAssistantOutputs, setTeacherAssistantOutputs] = useState({});
  const [remedialModalRec, setRemedialModalRec] = useState(null);

  // AI Notes & Presentation Generator State
  const [selectedLectures, setSelectedLectures] = useState('Lecture 1: Fundamental Laws, Lecture 2: Work & Kinetic Energy');
  const [uploadedLectureFile, setUploadedLectureFile] = useState(null);
  const [generatedNotes, setGeneratedNotes] = useState(null);
  const [generatedPresentation, setGeneratedPresentation] = useState(null);
  const [showPresentationModal, setShowPresentationModal] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(isStudent && initialTab === 'teacher-asst' ? 'tutor' : initialTab);
    }
  }, [initialTab, isStudent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendQuery = (textToSend) => {
    const rawQuery = textToSend || userQuery;
    if (!rawQuery.trim() || isTyping) return;

    const { isSafe, cleanText } = filterContent(rawQuery);
    if (!isSafe) {
      onTriggerNotification('⚠️ Please maintain academic and appropriate language in the AI Tutor.');
    }

    const query = cleanText;
    setChatMessages(prev => [...prev, { sender: 'User', text: query }]);
    setUserQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const q = query.toLowerCase();
      if (q.includes('cramer') || q.includes('matrix') || q.includes('determinant')) {
        aiResponse = "Cramer's Rule Step-by-Step:\n1. Write linear equations in matrix AX = B form.\n2. Compute determinant |A|.\n3. Substitute B into Col 1 for |Ax| & Col 2 for |Ay|.\n4. Solution: x = |Ax| / |A| and y = |Ay| / |A|.";
      } else if (q.includes('quadratic') || q.includes('equation')) {
        aiResponse = "Solving Quadratic Equations:\n1. Standard form: ax² + bx + c = 0.\n2. Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a.\n3. Check Discriminant D = b² - 4ac to determine root nature.";
      } else if (q.includes('kinematics') || q.includes('velocity') || q.includes('acceleration')) {
        aiResponse = "Kinematics Equations Breakdown:\n1. v = u + at (Velocity-Time)\n2. S = ut + ½at² (Displacement-Time)\n3. v² - u² = 2aS (Velocity-Displacement)\nWhere u = initial velocity, v = final velocity, a = acceleration, t = time.";
      } else if (q.includes('python') || q.includes('code') || q.includes('function')) {
        aiResponse = "Python Core Functions:\n1. Define with `def function_name(params):`\n2. Indent code block for logic.\n3. Return result using `return`. Example:\ndef calculate_speed(distance, time):\n    return distance / time";
      } else {
        aiResponse = `AI Breakdown for "${query}":\n1. Identify core parameters and boundary conditions.\n2. Apply standard formula or algorithmic steps.\n3. Verify output against expected sample values.`;
      }
      setChatMessages(prev => [...prev, { sender: 'AI Tutor', text: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedQuiz([
        { q: `Q1. What is the key variable formula in ${quizTopic}?`, options: ["v = u + at", "F = ma", "E = mc²", "P = IV"], ans: "v = u + at" },
        { q: "Q2. Which measurement unit is standard in SI system for displacement?", options: ["Kilometers", "Meters (m)", "Centimeters", "Miles"], ans: "Meters (m)" },
        { q: "Q3. What does slope of velocity-time graph represent?", options: ["Displacement", "Acceleration", "Speed", "Force"], ans: "Acceleration" }
      ]);
      setIsGenerating(false);
      onTriggerNotification(`✨ AI generated 3 practice MCQs for "${quizTopic}"!`);
    }, 800);
  };

  // Open Lesson Plan in PDF format
  const handleOpenLessonPlanPdf = () => {
    openPdfDocument({
      title: `45-Minute Lesson Plan: ${teacherProfile?.primarySubject || 'Mathematics & Science'}`,
      subtitle: `Target Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} • Core Fundamentals`,
      documentType: 'LESSON PLAN & STUDY GUIDE',
      author: teacherProfile?.name || 'Prof. Sarah Khan',
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: '1. Learning Objectives',
          bullets: [
            `Define foundational principles and key terminology of ${teacherProfile?.primarySubject || 'Physics'}.`,
            'Solve 3 guided sample problems on whiteboard with active student participation.',
            'Conduct a 10-minute formative assessment concept check.'
          ]
        },
        {
          title: '2. Whiteboard Setup & Board Plan',
          bullets: [
            'Left Panel: Key definitions, coordinate system diagram, and vector components.',
            'Top Right: Master formulas, units, and boundary conditions.',
            'Bottom Right: Practice Problem 1 & 2 step-by-step breakdown.'
          ]
        },
        {
          title: '3. Lesson Timeline (45 Mins Total)',
          bullets: [
            '00 - 10 Mins: Warm-up recap of previous chapter concepts.',
            '10 - 25 Mins: Instructor explanation & whiteboard derivation.',
            '25 - 35 Mins: Pair-share activity and guided numerical problem solving.',
            '35 - 45 Mins: 3-MCQ Quick Quiz & Homework assignment.'
          ]
        }
      ],
      footerNote: 'Generated by AI Teacher Assistant Layer • Apex Digital School System'
    });
    onTriggerNotification('📄 Opened 45-Min Lesson Plan as PDF Document in new tab.');
  };

  // Generate & Open AI Notes as PDF
  const handleGenerateNotes = () => {
    const notesTitle = `AI Study Notes: ${selectedLectures}`;
    setGeneratedNotes({
      title: notesTitle,
      sources: uploadedLectureFile ? uploadedLectureFile.name : selectedLectures,
      summary: `Comprehensive study notes derived from ${selectedLectures}. Formatted for quick revision, concept clarity, and exam preparation.`,
      sections: [
        {
          heading: 'Core Definitions & Laws',
          text: 'Every physical system governed by motion obeys fundamental conservation principles. Vector quantities represent magnitude and direction.'
        },
        {
          heading: 'Formula Reference Sheet',
          text: '1. Displacement: S = v_avg * t\n2. Final Velocity: v = u + at\n3. Kinetic Energy: KE = ½ mv²'
        },
        {
          heading: 'Self-Assessment Questions',
          text: 'Q1: Differentiate between scalar and vector quantities with 2 examples.\nQ2: Derive the displacement equation for uniformly accelerated linear motion.'
        }
      ]
    });
    onTriggerNotification(`✨ AI generated Study Notes from selected lectures!`);
  };

  const handleOpenNotesPdf = () => {
    openPdfDocument({
      title: `AI Study Notes: ${teacherProfile?.primarySubject || 'Academic Subject'}`,
      subtitle: `Source Lectures: ${uploadedLectureFile ? uploadedLectureFile.name : selectedLectures}`,
      documentType: 'AI STUDY NOTES PDF',
      author: teacherProfile?.name || 'Prof. Sarah Khan',
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: 'Executive Summary',
          content: `High-yield study notes automatically synthesized by AI from the provided lecture transcripts and materials (${selectedLectures}).`
        },
        {
          title: 'Fundamental Definitions & Principles',
          bullets: [
            'Core Definitions: State variables, physical constants, and units of measurement.',
            'Governing Equations: Detailed breakdown of primary formulas and derivations.',
            'System Boundaries: Assumptions, ideal conditions, and real-world friction losses.'
          ]
        },
        {
          title: 'Key Formula Reference',
          content: '• v = u + at (Velocity-Time Derivation)\n• S = ut + ½at² (Displacement Equation)\n• v² - u² = 2aS (Velocity-Displacement Relation)'
        },
        {
          title: 'Review Questions & Practice Problems',
          bullets: [
            'Explain the physical significance of negative acceleration in a braking car.',
            'Calculate the distance traveled in 15 seconds given initial velocity 10 m/s and acceleration 2 m/s².'
          ]
        }
      ],
      footerNote: 'Generated via AI Lecture Notes Engine • Apex Digital School System'
    });
    onTriggerNotification('📄 Opened AI Study Notes as PDF Document in new tab.');
  };

  // Generate & Open Slide Presentation Deck as PDF / PPTX
  const handleGeneratePresentation = () => {
    const slideDeckTitle = `Lecture Presentation Deck: ${selectedLectures}`;
    setGeneratedPresentation({
      title: slideDeckTitle,
      slides: [
        { 
          slideNo: 1, 
          title: `Presentation Deck: ${selectedLectures}`, 
          bullets: [
            `Target Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} • ${teacherProfile?.primarySubject || 'Mathematics & Physics'}`,
            `Instructor: ${teacherProfile?.name || 'Prof. Sarah Khan'}`,
            'Source Materials: ' + (uploadedLectureFile ? uploadedLectureFile.name : selectedLectures),
            'Goal: Comprehensive conceptual understanding & problem solving.'
          ] 
        },
        { 
          slideNo: 2, 
          title: 'Learning Objectives & Core Scope', 
          bullets: [
            'Define fundamental laws, physical quantities, and system boundaries.',
            'Derive master equations of motion and force balances.',
            'Graphically analyze velocity-time and displacement-time relationships.',
            'Solve guided numerical problems with proper SI units.'
          ] 
        },
        { 
          slideNo: 3, 
          title: 'Theoretical Principles & Master Equations', 
          bullets: [
            'Velocity-Time Formula: v = u + at',
            'Displacement Equation: S = ut + ½at²',
            'Velocity-Displacement Relation: v² - u² = 2aS',
            'Work-Energy Theorem: Total Work W = ΔKE = ½ m(v² - u²)'
          ] 
        },
        { 
          slideNo: 4, 
          title: 'Real-World Engineering Applications', 
          bullets: [
            'Automobile Braking Distance & Reaction Time Calculations.',
            'Satellite Trajectory & Orbital Centripetal Acceleration.',
            'Bridge Truss Structural Stress & Force Equilibrium Analysis.'
          ] 
        },
        { 
          slideNo: 5, 
          title: 'Classroom Concept Check & Summary', 
          bullets: [
            'Quick Concept Check: What does slope of v-t graph represent?',
            'Group Activity: Pair-share derivation of 3rd equation of motion.',
            'Homework Assignment: Exercise 3.2 Questions 1 to 8.',
            'Next Session: Laboratory experiment & live demonstration.'
          ] 
        }
      ]
    });
    onTriggerNotification(`📽️ AI generated 5-slide PowerPoint Deck for "${selectedLectures}"!`);
  };

  const handleOpenPresentationPdf = () => {
    openPdfDocument({
      title: `Slide Deck Presentation: ${selectedLectures}`,
      subtitle: `Target Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} • ${teacherProfile?.primarySubject || 'Physics'}`,
      documentType: 'SLIDE PRESENTATION PDF',
      author: teacherProfile?.name || 'Prof. Sarah Khan',
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: '[SLIDE 1] Title & Overview',
          bullets: [
            `Topic: ${selectedLectures}`,
            `Instructor: ${teacherProfile?.name || 'Prof. Sarah Khan'}`,
            'Learning Objective: Master core equations & practical applications.'
          ]
        },
        {
          title: '[SLIDE 2] Core Principles',
          bullets: [
            'Definition of vector scalar field variables.',
            'Diagrammatic representation of velocity vectors.',
            'SI unit conventions and dimensional analysis.'
          ]
        },
        {
          title: '[SLIDE 3] Formula Breakdown',
          bullets: [
            'Equation 1: v = u + at',
            'Equation 2: S = ut + ½at²',
            'Equation 3: v² - u² = 2aS'
          ]
        },
        {
          title: '[SLIDE 4] Classroom Exercise & Homework',
          bullets: [
            'Group Discussion: Real-world satellite trajectory calculation.',
            'Assigned Reading: Chapter 3 Pages 45-52.',
            'Next Session: Laboratory experiment on projectile motion.'
          ]
        }
      ],
      footerNote: 'Generated via AI Slide Deck Engine • Apex Digital School System'
    });
    onTriggerNotification('📽️ Opened Presentation Deck as PDF Document in new tab.');
  };

  // Open Grading Rubric in PDF format
  const handleOpenRubricPdf = () => {
    openPdfDocument({
      title: `4-Tier Assessment Rubric (${teacherProfile?.primarySubject || 'Academic Subject'})`,
      subtitle: `Target Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} • Assignment & Test Grading`,
      documentType: 'GRADING RUBRIC PDF',
      author: teacherProfile?.name || 'Prof. Sarah Khan',
      date: new Date().toLocaleDateString(),
      tables: [
        {
          title: 'Evaluation Criteria Matrix',
          headers: ['Performance Tier', 'Score Range', 'Conceptual Understanding', 'Mathematical Accuracy', 'Presentation & Reasoning'],
          rows: [
            ['Tier 4 (Exemplary)', '90% - 100%', 'Mastery of all concepts & edge cases', 'Zero calculation or unit errors', 'Flawless step-by-step logic'],
            ['Tier 3 (Proficient)', '75% - 89%', 'Solid grasp of core formulas', 'Minor arithmetic oversight', 'Clear reasoning with minor gaps'],
            ['Tier 2 (Developing)', '50% - 74%', 'Partial understanding of steps', '2+ procedural mistakes', 'Unclear notation or missing steps'],
            ['Tier 1 (Emerging)', 'Below 50%', 'Misconceptions present', 'Multiple calculation errors', 'Requires instructor intervention']
          ]
        }
      ],
      footerNote: 'Generated by AI Teacher Assistant Layer • Apex Digital School System'
    });
    onTriggerNotification('📄 Opened 4-Tier Grading Rubric as PDF Document in new tab.');
  };

  const subjectName = teacherProfile?.primarySubject || 'Mathematics & Science';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* AI Title Banner */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI School Ecosystem Layer 🤖</h2>
            <span className="badge badge-indigo">AI Powered</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Interactive AI Tutor, Automatic Quiz Generator, Weakness Analytics & Teacher Assistant for {subjectName}.
          </p>
        </div>
      </div>

      {/* AI Tool Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('tutor')}
          className={`btn ${activeTab === 'tutor' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Bot size={18} /> 1. AI Student Tutor
        </button>
        <button 
          onClick={() => setActiveTab('quiz-gen')}
          className={`btn ${activeTab === 'quiz-gen' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Zap size={18} /> 2. AI Quiz Generator
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BarChart2 size={18} /> 3. AI Student Analytics
        </button>
        {!isStudent && (
          <button 
            onClick={() => setActiveTab('teacher-asst')}
            className={`btn ${activeTab === 'teacher-asst' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={18} /> 4. AI Teacher Assistant
          </button>
        )}
      </div>

      {/* Tab 1: AI Student Tutor */}
      {activeTab === 'tutor' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
          <div className="card-header">
            <div className="card-title">
              <Bot size={20} className="text-indigo-400" />
              <span>Interactive Step-by-Step AI Tutor</span>
            </div>
            <span className="badge badge-emerald">Available 24/7</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'User' ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{msg.sender}</span>
                <div style={{
                  background: msg.sender === 'User' ? 'var(--accent-gradient)' : 'var(--bg-surface)',
                  color: msg.sender === 'User' ? '#fff' : 'var(--text-main)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '80%',
                  whiteSpace: 'pre-line',
                  fontSize: '0.9rem',
                  border: msg.sender === 'User' ? 'none' : '1px solid var(--border-color)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>AI Tutor</span>
                <div style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '80%',
                  fontSize: '0.9rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="typing-indicator" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {schoolData.aiPresets.tutorTopics.map((topic, idx) => (
              <button key={idx} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', whiteSpace: 'nowrap' }} onClick={() => handleSendQuery(topic)}>
                <Lightbulb size={12} className="text-amber-400" /> {topic}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text"
              placeholder={`Ask AI Tutor about ${subjectName}...`}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              disabled={isTyping}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)', outline: 'none' }}
            />
            <button className="btn btn-primary" onClick={() => handleSendQuery()} disabled={isTyping}>
              <Send size={18} /> {isTyping ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: AI Quiz Generator */}
      {activeTab === 'quiz-gen' && (
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Zap size={20} className="text-amber-400" />
              <span>Instant AI Quiz & MCQ Generator for {subjectName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Enter subject topic or chapter name..."
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-main)' }}
              />
              <button className="btn btn-primary" onClick={handleGenerateQuiz} disabled={isGenerating}>
                <Sparkles size={18} /> {isGenerating ? 'Generating...' : 'Generate MCQs'}
              </button>
            </div>

            {generatedQuiz && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-card-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>Generated MCQs for {quizTopic}:</h4>
                {generatedQuiz.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.q}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {item.options.map((opt, i) => (
                        <div key={i} style={{ background: opt === item.ans ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: opt === item.ans ? '1px solid var(--accent-emerald)' : 'var(--glass-border)', fontSize: '0.85rem' }}>
                          {opt} {opt === item.ans && '✓ (Correct)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: AI Student Analytics */}
      {activeTab === 'analytics' && (
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart2 size={20} className="text-rose-400" />
              <span>AI Weakness Detection & Remedial Recommendations</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schoolData.aiPresets.weaknessRecommendations.map((rec, i) => (
              <div key={i} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-rose">{rec.subject} • Weak Area Detected</span>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.35rem' }}>{rec.topic}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    AI Recommended Action: <strong>{rec.recommendation}</strong>
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setRemedialModalRec(rec)}>
                  Start Remedial Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Teacher Assistant */}
      {activeTab === 'teacher-asst' && (
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={20} className="text-emerald-400" />
              <span>AI Teacher Assistant: Study Plans, PDF Notes, Presentations & Rubrics</span>
            </div>
            <span className="badge badge-emerald">PDF & Print Ready</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* 1. 45-Min Lesson / Study Plan Generator */}
            <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FileText size={18} className="text-indigo-400" />
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Generate 45-Min Study Plan</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Creates learning objectives, whiteboard diagrams, timeline breakdown & discussion questions for {teacherProfile?.assignedClasses?.[0] || 'Class 9-A'} {subjectName}.
              </p>
              
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }} 
                onClick={() => {
                  setTeacherAssistantOutputs(prev => ({ ...prev, lessonPlan: '⏳ Generating lesson plan...' }));
                  setTimeout(() => {
                    setTeacherAssistantOutputs(prev => ({ 
                      ...prev, 
                      lessonPlan: `✅ Lesson Plan: ${subjectName} Core Fundamentals\n\nTarget Class: ${teacherProfile?.assignedClasses?.[0] || 'Class 9-A'}\nObjectives:\n1. Define foundational concepts of ${subjectName}.\n2. Solve 3 guided sample problems on whiteboard.\n3. Conduct 10-min group quiz.\n\nWhiteboard Setup:\n- Draw main diagram/matrix on left side.\n- Outline key formulas on top right.\n\nActivity:\nPair-share discussion on real-world application.` 
                    }));
                  }, 1000);
                }}
              >
                <Sparkles size={16} /> Generate Lesson Plan
              </button>

              {teacherAssistantOutputs.lessonPlan && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <div style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                    {teacherAssistantOutputs.lessonPlan}
                  </div>

                  {teacherAssistantOutputs.lessonPlan.includes('✅') && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, fontSize: '0.78rem', justifyContent: 'center', gap: '0.35rem' }}
                        onClick={handleOpenLessonPlanPdf}
                      >
                        <ExternalLink size={14} className="text-indigo-400" /> Open PDF in New Tab
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. AI Lecture Notes & Presentation Generator (PDF & PPT Deck) */}
            <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Presentation size={18} className="text-amber-400" />
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>AI Notes & Presentation Generator</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Select lectures or upload lecture files to instantly auto-generate PDF study notes and slide presentation decks.
              </p>

              {/* Lecture Selection & File Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Lectures / Topics to Generate From:
                  </label>
                  <input 
                    type="text"
                    value={selectedLectures}
                    onChange={(e) => setSelectedLectures(e.target.value)}
                    placeholder="e.g. Lecture 1: Motion, Lecture 2: Forces"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Upload Lecture File / Document (Optional):
                  </label>
                  <div style={{
                    border: '1.5px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem',
                    textAlign: 'center',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedLectureFile(e.target.files[0]);
                          onTriggerNotification(`📄 Selected file: ${e.target.files[0].name}`);
                        }
                      }}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                      <Upload size={14} className="text-amber-400" />
                      {uploadedLectureFile ? `📄 ${uploadedLectureFile.name}` : 'Upload PDF / Doc Lecture File'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Notes vs Presentation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.78rem', justifyContent: 'center', gap: '0.3rem' }}
                  onClick={handleGenerateNotes}
                >
                  <FileText size={14} className="text-emerald-400" /> Generate PDF Notes
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.78rem', justifyContent: 'center', gap: '0.3rem' }}
                  onClick={handleGeneratePresentation}
                >
                  <Presentation size={14} className="text-amber-400" /> Generate Slides
                </button>
              </div>

              {/* Generated Notes Preview & PDF action */}
              {generatedNotes && (
                <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '0.35rem' }}>
                    ✨ Generated PDF Study Notes
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                    {generatedNotes.summary}
                  </p>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'center', gap: '0.35rem' }}
                    onClick={handleOpenNotesPdf}
                  >
                    <ExternalLink size={14} /> View Notes PDF in Separate Tab
                  </button>
                </div>
              )}

              {/* Generated Presentation Preview & Actions */}
              {generatedPresentation && (
                <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Presentation size={16} /> Generated Presentation ({generatedPresentation.slides.length} Widescreen Slides)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    {generatedPresentation.slides.slice(0, 3).map((slide) => (
                      <div key={slide.slideNo} style={{ background: 'var(--bg-card-hover)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Slide {slide.slideNo}:</strong> {slide.title}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{slide.bullets?.length || 1} points</span>
                      </div>
                    ))}
                    {generatedPresentation.slides.length > 3 && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+ {generatedPresentation.slides.length - 3} more slides in deck...</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'center', gap: '0.35rem' }}
                      onClick={() => setShowPresentationModal(true)}
                    >
                      <Presentation size={15} /> 📽️ Present / View Interactive Slide Deck
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.74rem', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem' }}
                        onClick={() => {
                          generatePptxFile({
                            title: generatedPresentation.title,
                            subject: subjectName,
                            teacherName: teacherProfile?.name,
                            targetClass: teacherProfile?.assignedClasses?.[0],
                            slides: generatedPresentation.slides
                          });
                          onTriggerNotification('📥 Downloaded PowerPoint (.pptx) file!');
                        }}
                      >
                        <Download size={13} /> PowerPoint (.pptx)
                      </button>

                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.74rem', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem' }}
                        onClick={handleOpenPresentationPdf}
                      >
                        <ExternalLink size={13} /> Open PDF Deck
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Generate Grading Rubric */}
            <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FileCheck size={18} className="text-emerald-400" />
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Generate Grading Rubric</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Generates a 4-tier evaluation rubric matrix for assignments and tests in {subjectName}.
              </p>
              
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }} 
                onClick={() => {
                  setTeacherAssistantOutputs(prev => ({ ...prev, rubric: '⏳ Generating rubric...' }));
                  setTimeout(() => {
                    setTeacherAssistantOutputs(prev => ({ 
                      ...prev, 
                      rubric: `✅ 4-Tier Assessment Rubric (${subjectName})\n\nTier 4 (Exemplary):\nFlawless methodology, zero calculation errors, clear reasoning.\n\nTier 3 (Proficient):\nCorrect steps with minor arithmetic or formatting oversight.\n\nTier 2 (Developing):\nPartial understanding, 2+ procedural mistakes.\n\nTier 1 (Emerging):\nUnclear approach, requires instructor intervention.` 
                    }));
                  }, 1000);
                }}
              >
                <Sparkles size={16} /> Generate Rubric
              </button>

              {teacherAssistantOutputs.rubric && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <div style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                    {teacherAssistantOutputs.rubric}
                  </div>

                  {teacherAssistantOutputs.rubric.includes('✅') && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'center', gap: '0.35rem' }}
                      onClick={handleOpenRubricPdf}
                    >
                      <ExternalLink size={14} className="text-emerald-400" /> Open Rubric PDF in New Tab
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Remedial Worksheet Modal */}
      {remedialModalRec && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.5rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Remedial Practice: {remedialModalRec.topic}</h3>
              <button onClick={() => setRemedialModalRec(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              AI Recommendation: <strong>{remedialModalRec.recommendation}</strong>
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Worksheet Q1 (Remedial Level)</h4>
              <p style={{ fontSize: '0.85rem' }}>Solve step-by-step for key terms in {remedialModalRec.topic}.</p>
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Hint: Focus on foundational rules before applying compound steps.
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
              const topicName = remedialModalRec.topic;
              setRemedialModalRec(null);
              if (isStudent) {
                onTriggerNotification(`📝 Remedial Practice Worksheet for "${topicName}" started! Questions loaded.`);
              } else {
                onTriggerNotification(`✅ Remedial Practice Sheet for "${topicName}" assigned to students!`);
              }
            }}>
              {isStudent ? 'Start Practice Worksheet' : 'Assign Worksheet to Students'}
            </button>
          </div>
        </div>
      )}

      {/* Interactive 16:9 Presentation Slide Viewer Modal */}
      <PresentationViewerModal 
        isOpen={showPresentationModal}
        onClose={() => setShowPresentationModal(false)}
        presentationData={generatedPresentation}
        subjectName={subjectName}
        teacherProfile={teacherProfile}
        onTriggerNotification={onTriggerNotification}
      />

    </div>
  );
}
