/**
 * Aptitude Test Engine & Review Component
 * Author: NAVYA R (PES2UG24CS308)
 * Traceability: IPR-F-011, IPR-F-012, TC-Test-01, TC-Test-02
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getAptitudeTests, getAptitudeTestById, submitAptitudeTest } from '../../services/testService';
import { useTimer } from '../../hooks/useTimer';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertBanner from '../common/AlertBanner';
import StatusBadge from '../common/StatusBadge';

export default function AptitudeTestView() {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleFinishTest = useCallback(async () => {
    if (!activeTest) return;
    try {
      const res = await submitAptitudeTest(activeTest.id || activeTest._id, answers, 600);
      setResult(res.data);
      setActiveTest(null);
    } catch (err) {
      setError(err.message || 'Submission failed.');
    }
  }, [activeTest, answers]);

  const { formattedTime, start, stop } = useTimer(900, handleFinishTest);

  useEffect(() => {
    getAptitudeTests()
      .then((res) => setTests(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const startTest = async (testId) => {
    setError('');
    setResult(null);
    setAnswers({});
    try {
      const res = await getAptitudeTestById(testId);
      setActiveTest(res.data);
      start((res.data.durationMinutes || 15) * 60);
    } catch (err) {
      setError(err.message || 'Unable to load test.');
    }
  };

  const selectOption = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const submitNow = async () => {
    stop();
    await handleFinishTest();
  };

  if (loading) return <LoadingSpinner label="Loading aptitude assessments..." />;

  return (
    <div>
      {error && <AlertBanner alert={{ type: 'error', message: error }} onClose={() => setError('')} />}

      {result && (
        <div className="card">
          <div className="card-title">
            <span>Assessment Result</span>
            <StatusBadge label={result.passed ? 'Selected' : 'Rejected'} />
          </div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Score: <strong>{result.score} / {result.totalQuestions || 5}</strong> ({result.percentage}%)
          </p>
          <p style={{ color: result.passed ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {result.passed ? 'Passed! Well prepared for campus drives.' : 'Needs more revision. Review the solutions below.'}
          </p>
        </div>
      )}

      {activeTest ? (
        <div className="card">
          <div className="card-title">
            <span>{activeTest.title}</span>
            <span className="badge badge-interview">Time Left: {formattedTime}</span>
          </div>

          {(activeTest.questions || []).map((q, idx) => (
            <div key={q.id || q._id} className="question-box">
              <p className="question-prompt">
                Q{idx + 1}. {q.prompt}
              </p>
              <div className="options-list">
                {(q.options || []).map((opt, optIdx) => {
                  const key = ['A', 'B', 'C', 'D'][optIdx];
                  const qId = q.id || q._id;
                  return (
                    <label key={key} className="option-row">
                      <input
                        type="radio"
                        name={qId}
                        checked={answers[qId] === key}
                        onChange={() => selectOption(qId, key)}
                      />
                      <span><strong>{key}.</strong> {opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-primary" onClick={submitNow}>
            Submit Assessment
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {tests.map((test) => (
            <div key={test._id || test.id} className="card">
              <div className="card-title">
                <span>{test.title}</span>
                <span className="badge badge-submitted">{test.durationMinutes || 15} Mins</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {test.category || 'Technical & Quantitative Aptitude'}
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => startTest(test._id || test.id)}>
                Start Assessment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
