const https = require('https');

const JIRA_DOMAIN = 'sohel412.atlassian.net';
const JIRA_EMAIL = 'sohelchapparband4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF0eeMdk2jx5vJHmU0Sig4S9xSOSF1NepBtqwS2Uvs6B6ocnGiLy-698qyymgSL3PAf71bk2wLsSS6ChVxYo4XneGu-h6RmMgpHOfnoxQGJMcEi40Rkchn26HTVUtDff-O-KaAkBluvS3AG785DlffR5RBCag298iX0VKaF2G-5tF4=650A9751';

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

const options = {
  hostname: JIRA_DOMAIN,
  path: '/rest/api/3/myself',
  method: 'GET',
  headers: {
    'Authorization': authHeader,
    'Accept': 'application/json',
    'User-Agent': 'NodeJS-Client'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(data);
      console.log('Logged in user info:', {
        displayName: parsed.displayName,
        emailAddress: parsed.emailAddress,
        accountId: parsed.accountId,
        active: parsed.active
      });
    } catch(e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => console.error(e));
req.end();
