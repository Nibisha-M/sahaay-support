// api/crises.js - Vercel Serverless Function Handler
function generateCrisisResponse(triggerTile, language = 'en', district = 'Thiruvananthapuram') {
  switch (triggerTile) {
    case 'Overdose Emergency':
      return {
        distress_score: 10,
        immediate_action: "Stay calm. Immediately turn the person onto their side into the Recovery Position. Check breathing and call DISHA 1056 / 108 Ambulance.",
        emergency_script: `ഹലോ DISHA 1056/108, എന്റെ ഒപ്പമുള്ളയാൾ മരുന്ന് മാറി കഴിച്ച് ബോധരഹിതനായിരിക്കുന്നു. ശ്വാസമെടുപ്പ് വളരെ കുറവാണ്. സ്ഥലം: ${district}. (Hello DISHA, person with me is unresponsive. Breathing is low. Location: ${district}.)`,
        call_helpline: true,
        helpline_number: "1056",
        audio_coregulation_text: "Do not panic. Keep the person on their side and call DISHA 1056 immediately."
      };
    case 'Panic Grounding':
      return {
        distress_score: 7,
        immediate_action: "You are completely safe. Inhale slowly for 4 seconds, hold your breath for 7 seconds, then exhale gently for 8 seconds.",
        emergency_script: `എനിക്ക് കടുത്ത അസ്വസ്ഥതയും പരിഭ്രാന്തിയും അനുഭവപ്പെടുന്നു. വിമുക്തി ഹെൽപ്പ്‌ലൈൻ (155300) വഴി കൗൺസിലിംഗ് വേണം. (Experiencing acute anxiety episode. Requesting Vimukthi audio counseling.)`,
        call_helpline: false,
        helpline_number: "155300",
        audio_coregulation_text: "Focus on my voice. Take a deep breath. This moment will pass. You are completely safe."
      };
    case 'De-Escalate':
      return {
        distress_score: 8,
        immediate_action: "Keep your voice neutral and low. Avoid arguing or raising your voice. Provide the person with safe physical space.",
        emergency_script: `വീട്ടിൽ വിഡ്രോവൽ കാരണം അക്രമാസക്തമായ സാഹചര്യമുണ്ട്. വിമുക്തി ഡി-അഡിക്ഷൻ സെന്ററിന്റെ ഉപദേശം വേണം. (Facing severe withdrawal agitation at home. Requesting Vimukthi guidance.)`,
        call_helpline: true,
        helpline_number: "155300",
        audio_coregulation_text: "Maintain composure. Speak softly. Ensure physical safety for everyone present."
      };
    default: // Craving Relief / Default
      return {
        distress_score: 6,
        immediate_action: "This intense craving will peak and pass within 10 to 15 minutes. Sip cold water now and change your immediate surroundings.",
        emergency_script: `എനിക്ക് കടുത്ത ഡ്രഗ്ഗ് ക്രെയ്വിംഗ് വരുന്നുണ്ട്. എന്നെ സഹായിക്കാൻ ഒരു കൗൺസിലറുമായി സംസാരിക്കണം. (Experiencing strong craving wave. Requesting peer support counselor.)`,
        call_helpline: false,
        helpline_number: "1056",
        audio_coregulation_text: "This craving is like a wave—it will rise and pass away. Sip cold water now and take a deep breath."
      };
  }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {}
  }

  const triggerTile = body.trigger_tile || 'Intense Craving';
  const language = body.language || 'en';
  const district = body.district || 'Thiruvananthapuram';

  const responseData = generateCrisisResponse(triggerTile, language, district);
  res.status(200).json(responseData);
};
