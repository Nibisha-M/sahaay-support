// server.js - Professional Web Server for Sahaay (സഹായം) Support Platform
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3005;

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
      } catch (e) {}

      const result = generateCrisisResponse(triggerTile, language, district);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Sahaay Support Professional Workstation v2.5`);
  console.log(`  Running on Port ${PORT}`);
  console.log(`=======================================================`);
});
