// server.js - Professional Web Server for Sahaay (സഹായം) Support Platform
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

const PORT = process.env.PORT || 3005;

// Basic in-memory rate limiting for security
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = rateLimitCache.get(ip);
  if (now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count += 1;
  return true;
}

// Utility to apply security headers
function setSecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data: blob:; media-src 'self' blob:;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(self)');
}

// Official Kerala Safety Facilities with GPS Coordinates
const KERALA_RESOURCES = [
  {
    title: "DISHA Tele-Helpline 1056",
    type: "helpline",
    district: "All Kerala",
    phone: "1056",
    address: "Dept of Health & Family Welfare, Govt of Kerala (24x7 Toll Free)",
    lat: 8.524139,
    lng: 76.936638
  },
  {
    title: "Vimukthi Excise Anti-Narcotic Helpline",
    type: "helpline",
    district: "All Kerala",
    phone: "155300",
    address: "Kerala State Excise Department Control Room",
    lat: 8.5089,
    lng: 76.9537
  },
  {
    title: "National Nasha Mukt Bharat Helpline",
    type: "helpline",
    district: "All Kerala",
    phone: "14446",
    address: "Ministry of Social Justice & Empowerment",
    lat: 8.5000,
    lng: 76.9000
  },
  {
    title: "Vimukthi De-Addiction Centre - Govt MCH",
    type: "hospital",
    district: "Thiruvananthapuram",
    phone: "0471-2528300",
    address: "Medical College Campus, Thiruvananthapuram",
    lat: 8.5241,
    lng: 76.9284
  },
  {
    title: "Govt Mental Health Centre, Peroorkada",
    type: "hospital",
    district: "Thiruvananthapuram",
    phone: "0471-2433297",
    address: "Peroorkada, Thiruvananthapuram",
    lat: 8.5375,
    lng: 76.9664
  },
  {
    title: "Vimukthi Centre - General Hospital Ernakulam",
    type: "hospital",
    district: "Ernakulam",
    phone: "0484-2360051",
    address: "Marine Drive, Kochi, Ernakulam",
    lat: 9.9723,
    lng: 76.2801
  },
  {
    title: "Taluk Head Quarters Hospital De-Addiction Unit",
    type: "hospital",
    district: "Ernakulam",
    phone: "0484-2624241",
    address: "Substation Road, Aluva, Ernakulam",
    lat: 10.1076,
    lng: 76.3516
  },
  {
    title: "Govt Mental Health Centre, Kuthiravattom",
    type: "hospital",
    district: "Kozhikode",
    phone: "0495-2741756",
    address: "Kuthiravattom, Kozhikode",
    lat: 11.2612,
    lng: 75.8034
  },
  {
    title: "Vimukthi Centre - District Hospital Thrissur",
    type: "hospital",
    district: "Thrissur",
    phone: "0487-2423150",
    address: "Palakkad Road, Thrissur",
    lat: 10.5276,
    lng: 76.2144
  }
];

function generateCrisisResponse(triggerTile, language = 'en', district = 'Thiruvananthapuram') {
  switch (triggerTile) {
    case 'Overdose Emergency':
      return {
        distress_score: 10,
        immediate_action: "Stay calm immediately. Turn the person onto their side in the Recovery Position. Check breathing and dial DISHA 1056 or 108 Ambulance right away.",
        emergency_script: `ഹലോ DISHA 1056/108, എന്റെ ഒപ്പമുള്ളയാൾ മരുന്ന് മാറി കഴിച്ച് ബോധരഹിതനായിരിക്കുന്നു. ശ്വാസമെടുപ്പ് വളരെ കുറവാണ്. സ്ഥലം: ${district}. (Hello DISHA 1056/108, the person with me has consumed unknown substances and is unresponsive. Breathing is very low. Location: ${district}.)`,
        call_helpline: true,
        helpline_number: "1056",
        audio_coregulation_text: "Do not panic. Turn the person onto their side and call DISHA 1056 immediately."
      };
    case 'Panic Grounding':
      return {
        distress_score: 7,
        immediate_action: "You are completely safe right now. Inhale slowly for 4 seconds, hold your breath for 7 seconds, then exhale gently for 8 seconds.",
        emergency_script: `എനിക്ക് കടുത്ത അസ്വസ്ഥതയും പരിഭ്രാന്തിയും അനുഭവപ്പെടുന്നു. വിമുക്തി ഹെൽപ്പ്‌ലൈൻ (155300) വഴി കൗൺസിലിംഗ് വേണം. (Experiencing acute anxiety episode. Requesting Vimukthi audio counseling.)`,
        call_helpline: false,
        helpline_number: "155300",
        audio_coregulation_text: "Focus on my voice. Take a deep breath. This moment will pass. You are completely safe."
      };
    case 'De-Escalate':
      return {
        distress_score: 8,
        immediate_action: "Keep your voice neutral and soft. Avoid arguing or raising your voice. Provide the person with safe physical space.",
        emergency_script: `വീട്ടിൽ വിഡ്രോവൽ കാരണം അക്രമാസക്തമായ സാഹചര്യമുണ്ട്. വിമുക്തി ഡി-അഡിക്ഷൻ സെന്ററിന്റെ ഉപദേശം വേണം. (Facing severe withdrawal agitation at home. Requesting Vimukthi guidance.)`,
        call_helpline: true,
        helpline_number: "155300",
        audio_coregulation_text: "Maintain composure. Speak softly. Ensure physical safety for everyone present."
      };
    default: // Craving Relief / Default
      return {
        distress_score: 6,
        immediate_action: "This intense craving wave will peak and pass within 10 to 15 minutes. Sip cold water now and change your immediate room surroundings.",
        emergency_script: `എനിക്ക് കടുത്ത ഡ്രഗ്ഗ് ക്രെയ്വിംഗ് വരുന്നുണ്ട്. എന്നെ സഹായിക്കാൻ ഒരു കൗൺസിലറുമായി സംസാരിക്കണം. (Experiencing strong craving wave. Requesting peer support counselor.)`,
        call_helpline: false,
        helpline_number: "1056",
        audio_coregulation_text: "This craving is like a wave—it will rise and pass away. Sip cold water now and take a deep breath."
      };
  }
}

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Too many requests, please try again later.' }));
  }

  setSecurityHeaders(res);

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error loading Sahaay UI');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && ['/patient', '/caregiver', '/counselor'].includes(req.url)) {
    const filePath = path.join(__dirname, 'public', `${req.url.substring(1)}.html`);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error loading dashboard');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url === '/service-worker.js') {
    const filePath = path.join(__dirname, 'public', 'service-worker.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url.startsWith('/safety_resources')) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const district = urlObj.searchParams.get('district') || 'All';
    const filtered = (district === 'All' || district === 'All Kerala') ? 
      KERALA_RESOURCES : 
      KERALA_RESOURCES.filter(r => r.district === 'All Kerala' || r.district === district);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ district: district, count: filtered.length, resources: filtered }));
  } else if (req.method === 'POST' && req.url === '/crises') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let triggerTile = 'Intense Craving';
      let language = 'en';
      let district = 'Thiruvananthapuram';

      try {
        if (body.startsWith('{')) {
          const parsed = JSON.parse(body);
          triggerTile = parsed.trigger_tile || triggerTile;
          language = parsed.language || language;
          district = parsed.district || district;
        } else {
          const params = new URLSearchParams(body);
          triggerTile = params.get('trigger_tile') || triggerTile;
          language = params.get('language') || language;
          district = params.get('district') || district;
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }

      // Basic input validation
      if (typeof triggerTile !== 'string' || triggerTile.length > 100) triggerTile = 'Intense Craving';
      if (typeof language !== 'string' || language.length > 10) language = 'en';
      if (typeof district !== 'string' || district.length > 50) district = 'Thiruvananthapuram';

      const result = generateCrisisResponse(triggerTile, language, district);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
    });
  } else if (req.method === 'POST' && req.url === '/api/companion') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.6-preview" });
        const prompt = `You are Sahaay, an empathetic AI recovery companion for someone with a Substance Use Disorder. Keep it brief (2 sentences max). User says: "${message}"`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: response }));
      } catch (e) {
        console.error('Companion AI Error:', e.message);
        let errorMsg = "I'm having trouble connecting right now, but please stay strong.";
        if (e.message.includes('401') || e.message.includes('authentication')) {
           errorMsg = "Invalid Gemini API Key provided. Please update your .env file with a valid key starting with 'AIzaSy'.";
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: errorMsg }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/api/vision') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { imageBase64 } = JSON.parse(body);
        const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.6-preview" });
        const prompt = "Analyze this pill or medication strip. Provide 3 short bullet points: 1) Detected medication, 2) Safe Usage, 3) Risks if mixed with alcohol.";
        const imagePart = {
          inlineData: {
            data: imageBase64.split(',')[1],
            mimeType: "image/jpeg"
          }
        };
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ analysis: responseText }));
      } catch (e) {
        console.error('Vision AI Error:', e.message);
        let errorMsg = "Failed to analyze image with AI.";
        if (e.message.includes('401') || e.message.includes('authentication')) {
           errorMsg = "Invalid Gemini API Key provided. Please update your .env file with a valid key starting with 'AIzaSy'.";
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMsg }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/api/rag') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { query } = JSON.parse(body);
        const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.6-preview" });
        const prompt = `Act as an expert based on NIMHANS and WHO guidelines for SUD. Answer briefly. Caregiver asks: "${query}"`;
        const result = await model.generateContent(prompt);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ answer: result.response.text() }));
      } catch (e) {
        console.error('RAG AI Error:', e.message);
        let errorMsg = "System error answering query.";
        if (e.message.includes('401') || e.message.includes('authentication')) {
           errorMsg = "Invalid Gemini API Key provided. Please update your .env file with a valid key starting with 'AIzaSy'.";
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ answer: errorMsg }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Sahaay Support Professional Workstation v2.5`);
    console.log(`  Running on Port ${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = server;
