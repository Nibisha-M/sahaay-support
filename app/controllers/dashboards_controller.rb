# app/controllers/dashboards_controller.rb
class DashboardsController < ApplicationController
  def patient
    @active_tab = 'patient'
    @relapse_risk = GeminiRiskService.calculate_risk(current_user_mock)
    @milestones = [] # Fetch from DB
  end

  def caregiver
    @active_tab = 'caregiver'
    @alerts = [] # Mock caregiver alerts
  end

  def counselor
    @active_tab = 'counselor'
    @patient_logs = []
  end

  private

  def current_user_mock
    # Mocking user ID for prototype
    1
  end
end
