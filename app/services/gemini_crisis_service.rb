# app/services/gemini_crisis_service.rb
require "net/http"
require "json"

class GeminiCrisisService
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

  def self.process_crisis(audio_base64: nil, trigger_tile: nil, language: "ml", district: "Thiruvananthapuram")
    api_key = ENV["GEMINI_API_KEY"]
    
    # If no API key is available or in offline fallback mode, return dialect-aware fallback guidance
    return fallback_response(trigger_tile, language, district) if api_key.blank?

    uri = URI("#{GEMINI_API_URL}?key=#{api_key}")

    system_instruction = <<~SYS
      You are an emergency AI clinical co-pilot for Substance Use Disorder (SUD) crises in Kerala, India ("Sahaay" platform).
      Your job is to assist high-cognitive-load users (patients experiencing cravings/panic or caregivers facing overdose/aggression) with immediate zero-typing guidance.
      Language requested: #{language} (If 'ml', use empathetic, clear Malayalam; if 'manglish', use Roman script Malayalam; if 'en', use simple English).
      District context: #{district}. Always include specific references to local Kerala resources like DISHA 1056, Vimukthi Excise Helpline 155300, or 108 Ambulance if acute emergency.
      Return strictly valid JSON with no markdown wrapping around the JSON object.
      JSON structure:
      {
        "distress_score": integer (1-10),
        "immediate_action": "1-2 sentence soothing co-regulation/grounding instruction in requested language",
        "emergency_script": "Line-by-line spoken script for user to speak when calling DISHA 1056 / 108 emergency responders in requested language",
        "call_helpline": boolean,
        "helpline_number": "1056 or 112 or 155300",
        "audio_coregulation_text": "Spoken grounding text for web audio TTS synthesis"
      }
    SYS

    contents = []
    
    if audio_base64.present?
      contents << {
        parts: [
          { inline_data: { mime_type: "audio/mp3", data: audio_base64 } },
          { text: "Analyze this distress voice SOS in Malayalam/Manglish. Identify user distress level and generate immediate emergency call script and coping action." }
        ]
      }
    else
      contents << {
        parts: [
          { text: "Trigger tile selected: '#{trigger_tile}'. Provide immediate zero-typing high-cognitive load guidance and Malayalam emergency call script." }
        ]
      }
    end

    payload = {
      system_instruction: { parts: [{ text: system_instruction }] },
      contents: contents,
      generationConfig: { response_mime_type: "application/json", temperature: 0.2 }
    }

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 10

    request = Net::HTTP::Post.new(uri.request_uri, { "Content-Type" => "application/json" })
    request.body = payload.to_json

    response = http.request(request)
    parsed = JSON.parse(response.body)
    
    raw_json = parsed.dig("candidates", 0, "content", "parts", 0, "text")
    JSON.parse(raw_json)
  rescue StandardError => e
    Rails.logger.error("Gemini Crisis Engine Error: #{e.message}") if defined?(Rails)
    fallback_response(trigger_tile, language, district)
  end

  private

  def self.fallback_response(trigger, language, district)
    case trigger
    when "Overdose Emergency"
      {
        "distress_score" => 10,
        "immediate_action" => language == "ml" ? 
          "ഉടൻ ശാന്തനായിരിക്കുക. വ്യക്തിയെ ഒരു വശത്തേക്ക് ചരിച്ചു കിടത്തുക (Recovery Position). ശ്വാസമെടുപ്പ് ശ്രദ്ധിക്കുക." : 
          "Stay calm. Turn the person onto their side (Recovery Position). Check breathing immediately.",
        "emergency_script" => language == "ml" ?
          "ഹലോ DISHA 1056/108, എന്റെ ഒപ്പമുള്ളയാൾ മരുന്ന് മാറി കഴിച്ച് ബോധരഹിതനായിരിക്കുന്നു. ശ്വാസമെടുപ്പ് വളരെ കുറവാണ്. സ്ഥലം: #{district}." :
          "Hello DISHA 1056/108, the person with me has consumed unknown substances and is unresponsive. Breathing is low. Location: #{district}.",
        "call_helpline" => true,
        "helpline_number" => "1056",
        "audio_coregulation_text" => language == "ml" ?
          "പേടിക്കേണ്ട. ആംബുലൻസിനെ വിളിക്കാൻ 1056 അമർത്തുക. വ്യക്തിയെ വശത്തേക്ക് ചരിച്ചു കിടത്തുക." :
          "Do not panic. Press call 1056 for DISHA helpline. Keep the person on their side."
      }
    when "Panic Grounding", "Panic Attack"
      {
        "distress_score" => 7,
        "immediate_action" => language == "ml" ?
          "നിങ്ങൾ സുരക്ഷിതനാണ്. 4 സെക്കൻഡ് ശ്വാസമെടുക്കുക, 7 സെക്കൻഡ് അടക്കിവെക്കുക, 8 സെക്കൻഡ് സാവധാനം പുറത്തുവിടുക." :
          "You are safe right now. Breathe in for 4 seconds, hold for 7 seconds, exhale slowly for 8 seconds.",
        "emergency_script" => language == "ml" ?
          "എനിക്ക് കടുത്ത അസ്വസ്ഥതയും പരിഭ്രാന്തിയും അനുഭവപ്പെടുന്നു. വിമുക്തി ഹെൽപ്പ്‌ലൈൻ (155300) വഴി കൗൺസിലിംഗ് വേണം." :
          "I am experiencing intense panic and distress. I need immediate audio grounding support.",
        "call_helpline" => false,
        "helpline_number" => "155300",
        "audio_coregulation_text" => language == "ml" ?
          "എന്റെ ശബ്ദം ശ്രദ്ധിക്കുക. ദീർഘമായി ശ്വാസമെടുക്കുക. ഈ നിമിഷം കടന്നുപോകും. നിങ്ങൾ ഒറ്റയ്ക്കല്ല." :
          "Focus on my voice. Take a deep breath. This moment will pass. You are safe."
      }
    when "De-Escalate", "Aggression or Conflict"
      {
        "distress_score" => 8,
        "immediate_action" => language == "ml" ?
          "ശബ്ദം താഴ്ത്തി സംസാരിക്കുക. തർക്കിക്കാതിരിക്കുക. വ്യക്തിക്ക് സുരക്ഷിതമായ അകലം നൽകുക." :
          "Keep your voice low and neutral. Avoid arguing. Give the person safe physical space.",
        "emergency_script" => language == "ml" ?
          "വീട്ടിൽ വിഡ്രോവൽ കാരണം അക്രമാസക്തമായ സാഹചര്യമുണ്ട്. വിമുക്തി ഡി-അഡിക്ഷൻ സെന്ററിന്റെ ഉപദേശം വേണം." :
          "We are facing severe withdrawal agitation at home. Need Vimukthi counselor assistance.",
        "call_helpline" => true,
        "helpline_number" => "155300",
        "audio_coregulation_text" => language == "ml" ?
          "ശാന്തമായിരിക്കുക. ശബ്ദമുയർത്തരുത്. സ്വയം സംരക്ഷണം ഉറപ്പാക്കുക." :
          "Maintain composure. Speak softly. Ensure safety for everyone in the room."
      }
    else # Craving Relief / Default
      {
        "distress_score" => 6,
        "immediate_action" => language == "ml" ?
          "ലഹരിയോടുള്ള ഈ ആഗ്രഹം (Craving) 15 മിനിറ്റിനുള്ളിൽ കുറയും. തണുത്ത വെള്ളം കുടിക്കുക. നടക്കാൻ ഇറങ്ങുക." :
          "This intense craving will peak and pass within 15 minutes. Sip cold water now.",
        "emergency_script" => language == "ml" ?
          "എനിക്ക് കടുത്ത ഡ്രഗ്ഗ് ക്രെയ്വിംഗ് വരുന്നുണ്ട്. എന്നെ സഹായിക്കാൻ ഒരു കൗൺസിലറുമായി സംസാരിക്കണം." :
          "I am having a strong craving episode. I want to speak to a Vimukthi peer support counselor.",
        "call_helpline" => false,
        "helpline_number" => "1056",
        "audio_coregulation_text" => language == "ml" ?
          "ഈ ക്രെയ്വിംഗ് ഒരു തിരമാല പോലെ വന്നു പോകും. വെള്ളം കുടിക്കുക. ദീർഘമായി ശ്വാസമെടുക്കുക." :
          "This craving is like a wave—it will rise and pass. Sip water now and breathe."
      }
    end
  end
end
