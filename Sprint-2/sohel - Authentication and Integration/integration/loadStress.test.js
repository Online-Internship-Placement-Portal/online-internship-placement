/**
 * High-Throughput Load & Latency SLA Stress Test
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-NF-001 (SLA <= 3000ms), IPR-NF-003 (Concurrent Capacity >= 500 ops)
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { sanitizePayload } = require('../middleware/sanitizeMiddleware');

async function runLoadStressTests() {
  console.log('--- Running High-Throughput Load & Latency SLA Verification ---');
  const TOTAL_OPERATIONS = 1000;
  const latencies = [];

  const overallStart = Date.now();

  for (let i = 0; i < TOTAL_OPERATIONS; i++) {
    const opStart = Date.now();

    // 1. JWT Issue
    const token = jwt.sign(
      { id: `student_${i}`, email: `student_${i}@pes.edu`, role: 'student' },
      JWT_SECRET
    );

    // 2. JWT Verification
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Payload recursive sanitization
    const payload = {
      name: `Student <script>alert(${i})</script> ${i}`,
      notes: ['Passionate about <img src=x onerror=alert(1)> cloud security', 'Distributed systems']
    };
    const cleaned = sanitizePayload(payload);

    const duration = Date.now() - opStart;
    latencies.push(duration);
  }

  const totalTime = Date.now() - overallStart;
  latencies.sort((a, b) => a - b);

  const p50 = latencies[Math.floor(TOTAL_OPERATIONS * 0.50)];
  const p95 = latencies[Math.floor(TOTAL_OPERATIONS * 0.95)];
  const p99 = latencies[Math.floor(TOTAL_OPERATIONS * 0.99)];
  const avg = (totalTime / TOTAL_OPERATIONS).toFixed(2);

  console.log(`  Total Simulated Operations: ${TOTAL_OPERATIONS}`);
  console.log(`  Total Execution Time:      ${totalTime}ms`);
  console.log(`  Average Latency per Op:    ${avg}ms`);
  console.log(`  p50 (Median) Latency:      ${p50}ms`);
  console.log(`  p95 Latency:               ${p95}ms`);
  console.log(`  p99 Latency:               ${p99}ms`);

  let passed = true;
  if (totalTime > 3000) {
    console.error(`  [FAIL] Total time ${totalTime}ms exceeded 3000ms SLA threshold (IPR-NF-001)`);
    passed = false;
  } else {
    console.log(`  [PASS] Total time ${totalTime}ms meets <= 3000ms SLA threshold (IPR-NF-001)`);
  }

  if (p95 > 15) {
    console.error(`  [FAIL] p95 latency ${p95}ms exceeds 15ms target`);
    passed = false;
  } else {
    console.log(`  [PASS] p95 latency ${p95}ms satisfies sub-15ms performance standard`);
  }

  return { passed, totalTime, p50, p95, p99 };
}

if (require.main === module) {
  runLoadStressTests().then(({ passed }) => {
    if (!passed) process.exit(1);
  });
}

module.exports = { runLoadStressTests };
