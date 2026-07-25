# app/models/user.rb
class User < ApplicationRecord
  has_many :crisis_episodes, dependent: :destroy

  validates :phone_number_digest, presence: true, uniqueness: true
  validates :role, inclusion: { in: %w[patient caregiver clinician] }
  validates :preferred_language, inclusion: { in: %w[ml en manglish] }

  def patient?
    role == "patient"
  end

  def caregiver?
    role == "caregiver"
  end
end
