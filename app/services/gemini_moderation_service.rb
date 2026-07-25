# app/services/gemini_moderation_service.rb
class GeminiModerationService
  def self.analyze_post(content)
    # In production: Use Gemini or Hugging Face Inference API to detect toxicity, self-harm, or relapse discussions.
    
    is_flagged = content.downcase.include?("relapse") || content.downcase.include?("harm")
    
    {
      is_flagged: is_flagged,
      risk_level: is_flagged ? "High" : "Low",
      reason: is_flagged ? "Contains potential triggers or self-harm keywords." : "Safe content."
    }
  end
end
