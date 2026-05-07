const http = require('http');
const https = require('https');

const VERIFY_TOKEN = 'nowcheck2026';
const MAKE_WEBHOOK = 'https://hook.eu1.make.com/zpetprk064qm1bwrlnj0e34efmdh2b6e';
const server = http.createServer((req, res) => {
  // GET - Verification
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(challenge);
    } else {
      res.writeHead(403);
      res.end('Forbidden');
    }
  }
  
  // POST - Messages
  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('Webhook:', body);
      
      // Forward to Make
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      };
      
      const makeReq = https.request(MAKE_WEBHOOK, options);
      makeReq.write(body);
      makeReq.end();
      
      res.writeHead(200);
      res.end('OK');
    });
  }
  
  else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
