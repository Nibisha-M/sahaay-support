# app/controllers/companion_controller.rb
class CompanionController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:chat]

  def chat
    message = params[:message]
    user_id = 1 # mock user

    result = GeminiCompanionService.process_conversation(user_id, message)
    
    render json: { reply: result[:response] }
  end
end
