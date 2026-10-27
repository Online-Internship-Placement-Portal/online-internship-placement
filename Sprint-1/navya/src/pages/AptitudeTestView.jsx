/**
 * Aptitude Test & Evaluation Component
 * Author: Navya R (PES2UG24CS308)
 * Role: User Interface (Frontend)
 * Traceability: IPR-F-011, IPR-F-012, TC-Test-01, TC-Test-02
 */

import React, { useState, useEffect } from 'react';

const AptitudeTestView = ({ token }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setTests(data.data);
        setSelectedTest(data.data[0]);
      }
    } catch (err) {
      console.error('Failed to load tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers({ ...answers, [questionId]: optionKey });
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    if (!selectedTest) return;
    setSubmitting(true);

    try {
      const testId = selectedTest.id || selectedTest._id;
      const res = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });

      const data = await res.json();
      if (data.success) {
        setTestResult(data.result);
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetTest = () => {
    setAnswers({});
    setTestResult(null);
  };

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Placement Aptitude Assessment Engine</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Interactive test engine with automatic score calculation (IPR-F-011 & IPR-F-012)
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading assessment questions...</div>
      ) : !selectedTest ? (
        <div className="card">No tests available right now.</div>
      ) : testResult ? (
        /* Results View (IPR-F-012 / TC-Test-02) */
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Assessment Completed!
          </h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
            Score: {testResult.score} / {testResult.totalMarks} ({testResult.percentage})
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: testResult.status === 'PASSED' ? 'var(--success)' : 'var(--warning)', marginBottom: '1.5rem' }}>
            Status: {testResult.status}
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Evaluation Breakdown:</h4>
            {testResult.details?.map((item, idx) => (
              <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Question #{idx + 1}</span>
                <span>
                  Selected: <strong>{item.selectedOption || 'None'}</strong> | Correct: <strong>{item.correctOption}</strong>{' '}
                  {item.isCorrect ? '✅ (+1)' : '❌ (0)'}
                </span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={resetTest}>
            Retake Assessment
          </button>
        </div>
      ) : (
        /* Test Taking View */
        <form onSubmit={handleSubmitTest}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedTest.title}</h2>
                <span className="role-pill">{selectedTest.category}</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                ⏱️ {selectedTest.durationMinutes} mins | 🏆 {selectedTest.totalMarks} Marks
              </div>
            </div>

            {selectedTest.questions?.map((q, idx) => {
              const qId = q.id || q._id;
              return (
                <div key={qId} style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>
                    Q{idx + 1}. {q.questionText}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {Object.entries(q.options || {}).map(([key, optText]) => (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: answers[qId] === key ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: answers[qId] === key ? 'var(--primary-light)' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="radio"
                          name={`q_${qId}`}
                          value={key}
                          checked={answers[qId] === key}
                          onChange={() => handleOptionSelect(qId, key)}
                        />
                        <span><strong>{key}:</strong> {optText}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Calculating Score...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AptitudeTestView;
