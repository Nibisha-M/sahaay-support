# app/services/gemini_companion_service.rb
require "net/http"
require "json"

class GeminiCompanionService
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

  def self.process_conversation(user_id, message)
    # Mocking persistent memory for the sake of the prototype
    # In production, we would fetch previous context or embeddings for the user's history
    
    prompt = <<~PROMPT
      You are Sahaay, an empathetic AI recovery companion for Substance Use Disorder patients in Kerala.
      You provide personalized encouragement, daily emotional check-ins, and recovery motivation.
      The user says: "#{message}"
      
      Respond in a supportive, concise manner suitable for voice playback. Keep it under 2 sentences.
    PROMPT

    call_gemini_api(prompt)
  end

  private

  def self.call_gemini_api(prompt)
    api_key = ENV["GEMINI_API_KEY"] || "mock_key"
    
    if api_key == "mock_key"
      return { response: "I hear you. Remember that craving is like a wave—it will pass. You have been strong for 12 days, let's keep going. I'm here with you." }
    end

    uri = URI("#{GEMINI_API_URL}?key=#{api_key}")
    req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    req.body = { contents: [{ parts: [{ text: prompt }] }] }.to_json

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    data = JSON.parse(res.body)
    { response: data.dig("candidates", 0, "content", "parts", 0, "text") || "I am here to support you." }
  rescue => e
    Rails.logger.error "Companion Error: #{e.message}"
    { response: "I am here to support you." }
  end
end
