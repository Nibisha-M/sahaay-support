# app/controllers/vision_controller.rb
class VisionController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:analyze]

  def analyze
    base64_image = params[:image_data]
    
    # Send image to Gemini Vision Service
    analysis = GeminiVisionService.analyze_image(base64_image)

    render json: analysis
  end
end
