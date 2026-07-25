Rails.application.routes.draw do
  root 'dashboards#patient'

  # Role Dashboards
  get 'dashboards/patient', to: 'dashboards#patient'
  get 'dashboards/caregiver', to: 'dashboards#caregiver'
  get 'dashboards/counselor', to: 'dashboards#counselor'

  # AI Companionship & Crisis
  post 'companion/chat', to: 'companion#chat'
  post 'crises', to: 'crises#create' # Existing SOS

  # Vision Support
  post 'vision/analyze', to: 'vision#analyze'

  # Community Forum
  resources :community_posts, only: [:index, :create, :show]

  # Safety Resources (Radar)
  resources :safety_resources, only: [:index]
end
