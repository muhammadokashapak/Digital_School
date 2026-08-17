import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Clock, CheckCircle2, XCircle, Award, Eye, RotateCcw, X } from 'lucide-react';
import { saveState, loadState } from '../utils/storage';

export default function QuizModal({ quizId, schoolData, currentUserAccount, onClose, onTriggerNotification }) {
  // Look up quiz by quizId
  let quizData = null;
  if (schoolData?.lms) {
    for (const course of schoolData.lms) {
      for (const chapter of course.chapters || []) {
        if (chapter.quiz && chapter.quiz.id === quizId) {
          quizData = chapter.quiz;
          break;
        }
      }
      if (quizData) break;
    }
  }
  // Fallback if quizId not found
  if (!quizData) {
    quizData = schoolData?.lms?.[0]?.chapters?.[0]?.quiz || {
      id: 'QZ-DEFAULT',
      title: 'General Science Concept Check',
      questions: [
        { id: 1, text: 'What is the SI unit of force?', options: ['Pascal', 'Newton', 'Joule', 'Watt'], correct: 1 },
        { id: 2, text: 'Which organelle is known as the powerhouse of the cell?', options: ['Ribosome', 'Mitochondria', 'Nucleus', 'Golgi Apparatus'], correct: 1 }
      ]
    };
  }

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const selectedAnswersRef = useRef({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [score, setScore] = useState(0);

  // 10 minutes countdown timer
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const timerRef = useRef(null);

  // Keep selectedAnswersRef in sync to avoid stale closure (BUG A1 fix)
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSubmitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateAndSubmit = (answers) => {
    let calculatedScore = 0;
    quizData.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    clearInterval(timerRef.current);

    // Save quiz attempt in local persistence
    try {
      const historyKey = `quiz_attempts_${currentUserAccount?.id || 'student'}`;
      const existingHistory = loadState(historyKey, []);
      const newAttempt = {
        quizId: quizData.id || quizId,
        quizTitle: quizData.title,
        score: calculatedScore,
        total: quizData.questions.length,
        percentage: Math.round((calculatedScore / quizData.questions.length) * 100),
        date: new Date().toISOString()
      };
      saveState(historyKey, [newAttempt, ...existingHistory]);
    } catch (err) {
      console.warn('Quiz history save error:', err);
    }

    onTriggerNotification(`🎯 Quiz Completed! Score: ${calculatedScore} / ${quizData.questions.length} (${Math.round((calculatedScore / quizData.questions.length) * 100)}%)`);
  };

  const handleAutoSubmit = () => {
    // Read from ref to avoid stale closure (BUG A1)
    calculateAndSubmit(selectedAnswersRef.current);
    onTriggerNotification('⏰ Time expired! Quiz auto-submitted with current answers.');
  };

  const handleSubmitQuiz = () => {
    calculateAndSubmit(selectedAnswers);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: '720px', padding: '2rem' }}>
        
        {/* Quiz Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '0.25rem' }}>ONLINE ASSESSMENT</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{quizData.title}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', 
              color: timeLeft < 60 ? '#ef4444' : 'var(--accent-rose)', 
              fontWeight: 700, 
              background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(244, 63, 94, 0.1)', 
              padding: '0.4rem 0.8rem', 
              borderRadius: 'var(--radius-md)',
              animation: (!isSubmitted && timeLeft < 60) ? 'pulse 1s infinite' : 'none'
            }}>
              <Clock size={16} /> {isSubmitted ? 'Submitted' : formatTime(timeLeft)}
            </div>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.35rem 0.5rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Questions Taker Mode */}
        {!isSubmitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {quizData.questions.map((q, idx) => (
              <div key={q.id} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.85rem' }}>
                  {idx + 1}. {q.text}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      style={{
                        background: selectedAnswers[q.id] === optIdx ? 'var(--accent-gradient)' : 'var(--bg-surface)',
                        color: selectedAnswers[q.id] === optIdx ? '#fff' : 'var(--text-main)',
                        border: selectedAnswers[q.id] === optIdx ? 'none' : 'var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.65rem 0.85rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              onClick={handleSubmitQuiz}
            >
              Submit Quiz ({Object.keys(selectedAnswers).length}/{quizData.questions.length} Answered)
            </button>
          </div>
        ) : isReviewing ? (
          /* Quiz Answer Review Screen (C11 Fix) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 700 }}>Reviewing Results: {score} / {quizData.questions.length} Correct</span>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }} onClick={() => setIsReviewing(false)}>
                Back to Summary
              </button>
            </div>

            {quizData.questions.map((q, idx) => {
              const studentChoice = selectedAnswers[q.id];
              const isCorrect = studentChoice === q.correct;

              return (
                <div 
                  key={q.id} 
                  style={{ 
                    background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)', 
                    border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.25rem' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{idx + 1}. {q.text}</h4>
                    {isCorrect ? (
                      <span className="badge badge-emerald"><CheckCircle2 size={13} /> Correct (+1)</span>
                    ) : (
                      <span className="badge badge-rose"><XCircle size={13} /> Incorrect (0)</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      Your Answer: <strong style={{ color: isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                        {studentChoice !== undefined ? `${String.fromCharCode(65 + studentChoice)}. ${q.options[studentChoice]}` : 'Not Answered'}
                      </strong>
                    </div>
                    {!isCorrect && (
                      <div>
                        Correct Answer: <strong style={{ color: 'var(--accent-emerald)' }}>
                          {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
              Done Reviewing
            </button>
          </div>
        ) : (
          /* Quiz Score Result View */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
              <Award size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quiz Completed!</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0.5rem 0' }}>
              You scored <strong className="text-emerald-400" style={{ fontSize: '1.4rem' }}>{score} / {quizData.questions.length}</strong> ({Math.round((score / quizData.questions.length) * 100)}%)
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Time used: {formatTime(10 * 60 - timeLeft)}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setIsReviewing(true)}>
                <Eye size={16} /> Review Question Answers
              </button>
              <button className="btn btn-primary" style={{ minWidth: '140px' }} onClick={onClose}>
                Done & Return
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
