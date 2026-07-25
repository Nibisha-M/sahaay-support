# app/controllers/community_posts_controller.rb
class CommunityPostsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def index
    @posts = CommunityPost.all.order(created_at: :desc)
    render json: @posts
  end

  def create
    content = params[:content]
    
    moderation = GeminiModerationService.analyze_post(content)
    
    if moderation[:is_flagged]
      render json: { success: false, reason: moderation[:reason], risk_level: moderation[:risk_level] }, status: :unprocessable_entity
    else
      post = CommunityPost.create!(user_id: 1, title: params[:title], content: content)
      render json: { success: true, post: post }
    end
  end
end
