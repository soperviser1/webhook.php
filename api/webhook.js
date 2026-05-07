export default function handler(req, res) {
  // Handle GET request (Meta verification)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === 'nowcheck2026') {
      console.log('Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  }
  
  // Handle POST request (incoming messages)
  else if (req.method === 'POST') {
    console.log('Webhook event:', JSON.stringify(req.body, null, 2));
    
    // Forward to Make.com
    fetch('https://hook.eu1.make.com/90ekb5blqd155l31e8mdwihelht6tp5m', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }).catch(err => console.error('Error forwarding:', err));
    
    res.status(200).send('OK');
  }
  
  else {
    res.status(405).send('Method Not Allowed');
  }
}
