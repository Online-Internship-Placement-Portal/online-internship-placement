const https = require('https');

const JIRA_DOMAIN = 'sohel412.atlassian.net';
const JIRA_EMAIL = 'sohelchapparband4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF0eeMdk2jx5vJHmU0Sig4S9xSOSF1NepBtqwS2Uvs6B6ocnGiLy-698qyymgSL3PAf71bk2wLsSS6ChVxYo4XneGu-h6RmMgpHOfnoxQGJMcEi40Rkchn26HTVUtDff-O-KaAkBluvS3AG785DlffR5RBCag298iX0VKaF2G-5tF4=650A9751';

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

function api(method, path, body = null) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: JIRA_DOMAIN,
      path,
      method,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, raw: data }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('1. Checking user (/rest/api/3/myself)...');
  const user = await api('GET', '/rest/api/3/myself');
  console.log('User status:', user.status, user.body ? { name: user.body.displayName, email: user.body.emailAddress, accountId: user.body.accountId } : user);

  console.log('\n2. Checking projects search (/rest/api/3/project/search)...');
  const projs = await api('GET', '/rest/api/3/project/search');
  console.log('Projects status:', projs.status, projs.body?.values?.map(p => ({ id: p.id, key: p.key, name: p.name, style: p.style, projectTypeKey: p.projectTypeKey })));

  console.log('\n3. Checking board 70 (/rest/agile/1.0/board/70)...');
  const board = await api('GET', '/rest/agile/1.0/board/70');
  console.log('Board status:', board.status, board.body);

  if (board.status === 200 && board.body.location) {
    console.log('Board location:', board.body.location);
  }

  console.log('\n4. Checking board 70 config (/rest/agile/1.0/board/70/configuration)...');
  const boardConfig = await api('GET', '/rest/agile/1.0/board/70/configuration');
  console.log('Board config status:', boardConfig.status, boardConfig.body?.location || boardConfig.body?.columnConfig);
}

run();
