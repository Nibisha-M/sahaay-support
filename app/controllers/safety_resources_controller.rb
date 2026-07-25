# app/controllers/safety_resources_controller.rb
class SafetyResourcesController < ApplicationController
  def index
    district = params[:district] || "Thiruvananthapuram"
    @resources = SafetyResource.for_district(district)
    
    render json: {
      district: district,
      count: @resources.count,
      resources: @resources
    }
  end
end
