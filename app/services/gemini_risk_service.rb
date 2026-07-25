# app/services/gemini_risk_service.rb
require "net/http"
require "json"

class GeminiRiskService
  def self.calculate_risk(user_id)
    # In production: Fetch DailyLogs, CrisisEpisodes, and missed events
    logs_summary = "User reported high anxiety and 3 cravings yesterday. Missed counseling."
    
    prompt = <<~PROMPT
      Analyze the following recovery data and generate a relapse risk score (Low, Medium, High).
      Explain the score and suggest preventative actions. Output as JSON.
      Data: #{logs_summary}
    PROMPT

    # Mocked structured output for prototype
    {
      risk_level: "High",
      score: 8,
      ai_explanation: "High anxiety combined with multiple cravings and a missed counseling session indicate an elevated risk of relapse.",
      preventative_actions: "Schedule an emergency call with your counselor and engage in a 4-7-8 breathing exercise immediately."
    }
  end
end
