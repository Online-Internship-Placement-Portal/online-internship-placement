/**
 * Full Jira Backlog & Sprint Automation Sync
 * Auto-discovering Project Key and Board
 * Domain: sohel412.atlassian.net
 */

const https = require('https');

const JIRA_DOMAIN = 'sohel412.atlassian.net';
const JIRA_EMAIL = 'sohelchapparband4@gmail.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'ATATT3xFfGF0eeMdk2jx5vJHmU0Sig4S9xSOSF1NepBtqwS2Uvs6B6ocnGiLy-698qyymgSL3PAf71bk2wLsSS6ChVxYo4XneGu-h6RmMgpHOfnoxQGJMcEi40Rkchn26HTVUtDff-O-KaAkBluvS3AG785DlffR5RBCag298iX0VKaF2G-5tF4=650A9751';
const BOARD_ID = 70;

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

function makeRequest(method, endpoint, payload = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: JIRA_DOMAIN,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-Jira-Client'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

const sprintTasks = [
  // --- SOHEL: Authentication & Integration ---
  { summary: "Student Registration & Credential Validation (IPR-F-001, TC-Auth-01)", desc: "Student registration endpoint with email validation and error feedback.", type: "Story", assignee: "Sohel" },
  { summary: "User Login & JWT Token Authentication Service (IPR-F-002, TC-Auth-02)", desc: "User login returning JWT token for session authorization.", type: "Story", assignee: "Sohel" },
  { summary: "Salted Adaptive Password Hashing with Bcrypt (IPR-SR-002, TC-Sec-02)", desc: "Secure password hashing using bcrypt with 10 salt rounds.", type: "Story", assignee: "Sohel" },
  { summary: "Role-Based Access Control Middleware (IPR-F-003, TC-Auth-03)", desc: "RBAC middleware enforcing permissions for Student, Recruiter, and Admin roles.", type: "Story", assignee: "Sohel" },
  { summary: "Server-Side Input Sanitization & XSS Protection (IPR-SR-005, TC-Sec-05)", desc: "Sanitization middleware stripping script tags and malicious payloads.", type: "Story", assignee: "Sohel" },
  { summary: "Automated Auth & Integration Test Runner (STP Section 13 & 14)", desc: "Standalone test suite verifying all auth and RBAC requirements with 100% pass rate.", type: "Story", assignee: "Sohel" },
  { summary: "GitHub Actions CI Pipeline Automation (.github/workflows/ci.yml)", desc: "CI workflow running automated test matrix on Node.js 18.x and 20.x on PRs.", type: "Task", assignee: "Sohel" },
  { summary: "Sprint-1 1-Minute Working Product Video Demo Recording", desc: "Recorded and uploaded demo video showcase outcome of sprint 1.", type: "Task", assignee: "Sohel" },
  { summary: "Sprint-1 Deviations & Requirements Traceability Report", desc: "Documented compliance and deviations from submitted SRS, SAD, and STP.", type: "Task", assignee: "Sohel" },

  // --- NAVYA: Frontend / UI ---
  { summary: "Responsive Portal Layout & Navbar (IPR-NF-004, TC-UI-01)", desc: "Responsive navigation bar with active links, role badge, and mobile layout.", type: "Story", assignee: "Navya" },
  { summary: "Login and Student Registration UI Screens", desc: "User login and student registration forms with quick demo credentials.", type: "Story", assignee: "Navya" },
  { summary: "Student Dashboard & Preparation Analytics Bar (IPR-F-014, IPR-F-015)", desc: "Student dashboard displaying placement preparation progress bar and score breakdown.", type: "Story", assignee: "Navya" },
  { summary: "Internship Catalog Search, Filter & 1-Click Apply UI (IPR-F-006, IPR-F-008)", desc: "Search and filter internships with duplicate application blocker alert.", type: "Story", assignee: "Navya" },
  { summary: "Interactive Aptitude Assessment Engine UI (IPR-F-011, IPR-F-012)", desc: "Online quiz interface with instant automatic score calculation.", type: "Story", assignee: "Navya" },
  { summary: "Recruiter Portal & Candidate Status Workflow UI (IPR-F-016, IPR-F-017)", desc: "Post internships and shortlist/reject candidate applications.", type: "Story", assignee: "Navya" },
  { summary: "Administrator Governance Dashboard UI (IPR-F-018)", desc: "Platform stats, active jobs, and user account governance table.", type: "Story", assignee: "Navya" },

  // --- NIKHIL RAJ: Backend Setup ---
  { summary: "Express Server Architecture, Environment Config & CORS", desc: "Node.js and Express backend setup with environment variable management.", type: "Story", assignee: "Nikhil Raj" },
  { summary: "Centralized Error Handling Middleware (SAD Section 4.4)", desc: "Standardized error handler for 400, 401, 403, 404, 409, 500 status codes.", type: "Story", assignee: "Nikhil Raj" },
  { summary: "Internship Management REST API Endpoints (/api/internships)", desc: "REST endpoints for listing, filtering, and retrieving internships.", type: "Story", assignee: "Nikhil Raj" },
  { summary: "Application Submission & Duplicate Prevention API (IPR-F-008, IPR-F-009)", desc: "Application workflow endpoint returning 409 Conflict on duplicate attempts.", type: "Story", assignee: "Nikhil Raj" },
  { summary: "Automated Aptitude Test Scoring Engine (/api/tests/:id/submit)", desc: "Backend grading engine calculating scores and percentages automatically.", type: "Story", assignee: "Nikhil Raj" },
  { summary: "Candidate Application Status Management APIs (/api/applications)", desc: "Endpoints for recruiters to shortlist or reject applicants.", type: "Story", assignee: "Nikhil Raj" },

  // --- DHEERAJ: Database Setup ---
  { summary: "MongoDB Mongoose Connection & Fallback Handler", desc: "Mongoose ODM setup with auto-reconnect and safety fallback.", type: "Story", assignee: "Dheeraj" },
  { summary: "User and StudentProfile Mongoose Schemas (IPR-F-001, IPR-F-004)", desc: "Data models for user accounts, credentials, and placement profiles.", type: "Story", assignee: "Dheeraj" },
  { summary: "Internship & Application Schemas with Compound Unique Index (IPR-F-009)", desc: "Application schema enforcing unique index on student and internship.", type: "Story", assignee: "Dheeraj" },
  { summary: "AptitudeTest, TestResult & PreparationProgress Schemas", desc: "Data models for questions, student test results, and preparation metrics.", type: "Story", assignee: "Dheeraj" },
  { summary: "Database Seeder Script with Realistic STP Test Records", desc: "Script populating dummy students, recruiters, admins, and test questions.", type: "Story", assignee: "Dheeraj" }
];

async function syncAllToJira() {
  console.log('================================================================');
  console.log(' JIRA SPRINT-1 BACKLOG & TIMELINES AUTOMATION');
  console.log(` Board: https://${JIRA_DOMAIN}/jira/software/projects/.../boards/${BOARD_ID}/backlog`);
  console.log('================================================================\n');

  // 1. Discover Projects
  console.log('[1/4] Discovering accessible Jira projects for this account...');
  const projListRes = await makeRequest('GET', '/rest/api/3/project');
  let targetProjectKey = 'OIP';

  if (projListRes.status === 200 && Array.isArray(projListRes.body)) {
    console.log(`  Found ${projListRes.body.length} project(s):`);
    projListRes.body.forEach(p => console.log(`   - Name: "${p.name}", Key: "${p.key}", ID: ${p.id}`));
    // Auto-select the first project or the one matching OIP
    const matched = projListRes.body.find(p => p.key.toUpperCase() === 'OIP') || projListRes.body[0];
    if (matched) {
      targetProjectKey = matched.key;
    }
  } else {
    // Check Board 70 directly
    console.log(`  Fetching Board ${BOARD_ID} config to find project key...`);
    const boardRes = await makeRequest('GET', `/rest/agile/1.0/board/${BOARD_ID}/project`);
    if (boardRes.body?.values?.length > 0) {
      targetProjectKey = boardRes.body.values[0].key;
      console.log(`  Discovered Project Key from Board 70: "${targetProjectKey}"`);
    }
  }

  console.log(`\n  👉 Using Project Key: "${targetProjectKey}"`);

  // Verify Issue Types
  const projDetails = await makeRequest('GET', `/rest/api/3/project/${targetProjectKey}`);
  const issueTypes = projDetails.body?.issueTypes || [];
  const defaultType = issueTypes.find(t => t.name.toLowerCase() === 'story' || t.name.toLowerCase() === 'task') || issueTypes[0] || { name: 'Task' };
  console.log(`  Using Issue Type: "${defaultType.name}"\n`);

  // 2. Create or Find Sprint 1
  console.log('[2/4] Setting up Sprint 1 on Board 70...');
  let sprintId = null;
  const sprintPayload = {
    name: 'Sprint 1 - Foundation, Auth & Integration',
    startDate: '2026-10-19T09:00:00.000+05:30',
    endDate: '2026-10-23T18:00:00.000+05:30',
    originBoardId: BOARD_ID,
    goal: 'Deliver working authentication, role-based access control, database schemas, and CI/CD automation.'
  };

  const sprintRes = await makeRequest('POST', '/rest/agile/1.0/sprint', sprintPayload);
  if (sprintRes.status === 201) {
    sprintId = sprintRes.body.id;
    console.log(`  ✅ Created Sprint 1 (ID: ${sprintId}) with timeline: 19 Oct 2026 -> 23 Oct 2026!`);
  } else {
    const sprintsList = await makeRequest('GET', `/rest/agile/1.0/board/${BOARD_ID}/sprint`);
    if (sprintsList.body?.values?.length > 0) {
      sprintId = sprintsList.body.values[sprintsList.body.values.length - 1].id;
      console.log(`  Using existing Sprint ID: ${sprintId} ("${sprintsList.body.values[sprintsList.body.values.length - 1].name}")`);
    }
  }

  // 3. Create all Backlog Issues
  console.log(`\n[3/4] Creating all ${sprintTasks.length} backlog issues in Jira under project "${targetProjectKey}"...`);
  const createdIssueKeys = [];

  for (let i = 0; i < sprintTasks.length; i++) {
    const task = sprintTasks[i];
    const targetTypeName = issueTypes.some(t => t.name.toLowerCase() === task.type.toLowerCase()) ? task.type : defaultType.name;

    const issuePayload = {
      fields: {
        project: { key: targetProjectKey },
        summary: `[${task.assignee}] ${task.summary}`,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: `${task.desc} | Owner: ${task.assignee}` }]
            }
          ]
        },
        issuetype: { name: targetTypeName }
      }
    };

    const res = await makeRequest('POST', '/rest/api/3/issue', issuePayload);
    if (res.status === 201) {
      createdIssueKeys.push(res.body.key);
      console.log(`  [${i + 1}/${sprintTasks.length}] ✅ Created [${res.body.key}] [${task.assignee}] ${task.summary.substring(0, 42)}...`);
    } else {
      console.warn(`  [${i + 1}/${sprintTasks.length}] ⚠️ Error (${res.status}):`, res.body?.errors || res.body?.errorMessages || res.status);
    }
  }

  // 4. Move all created issues into Sprint 1
  if (sprintId && createdIssueKeys.length > 0) {
    console.log(`\n[4/4] Adding ${createdIssueKeys.length} issues into Sprint 1 (ID: ${sprintId})...`);
    const moveRes = await makeRequest('POST', `/rest/agile/1.0/sprint/${sprintId}/issue`, {
      issues: createdIssueKeys
    });
    if (moveRes.status === 204) {
      console.log(`  ✅ Successfully moved all issues into Sprint 1!`);
    } else {
      console.log(`  Move response status: ${moveRes.status}`);
    }
  }

  console.log('\n================================================================');
  console.log(' 🎉 JIRA SPRINT-1 BACKLOG SETUP COMPLETE!');
  console.log(` Open your Jira Board: https://${JIRA_DOMAIN}/jira/software/projects/${targetProjectKey}/boards/${BOARD_ID}/backlog`);
  console.log('================================================================\n');
}

if (require.main === module) {
  syncAllToJira();
}

module.exports = { syncAllToJira };
