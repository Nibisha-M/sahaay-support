# app/controllers/crises_controller.rb
class CrisesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create] # Handles instant async voice/tile postings

  def index
    @recent_episodes = CrisisEpisode.recent.limit(5)
    @safety_resources = SafetyResource.for_district(params[:district] || "Thiruvananthapuram")
  end

  def create
    audio_file = params[:audio_data]
    trigger_tile = params[:trigger_tile]
    language = params[:language] || "ml"
    district = params[:district] || "Thiruvananthapuram"

    audio_b64 = audio_file.present? ? Base64.strict_encode64(audio_file.read) : nil

    result = GeminiCrisisService.process_crisis(
      audio_base64: audio_b64,
      trigger_tile: trigger_tile,
      language: language,
      district: district
    )

    @episode = CrisisEpisode.create!(
      user_id: current_user_id,
      trigger_category: trigger_tile || "voice_sos",
      ai_assessment: result,
      generated_script: result["emergency_script"],
      distress_score: result["distress_score"],
      escalated_to_helpline: result["call_helpline"]
    )

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "crisis_response_area",
          partial: "crises/response_card",
          locals: { result: result, episode: @episode }
        )
      end
      format.html { redirect_to crises_path, notice: "Crisis assessment logged." }
      format.json { render json: result }
    end
  end

  private

  def current_user_id
    # Frictionless demo user creation
    User.first_or_create!(
      phone_number_digest: "demo_hash_#{Socket.gethostname rescue 'local'}",
      role: "patient",
      preferred_language: "ml",
      district: "Thiruvananthapuram"
    ).id
  end
end
