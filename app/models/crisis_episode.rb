# app/models/crisis_episode.rb
class CrisisEpisode < ApplicationRecord
  belongs_to :user

  validates :trigger_category, presence: true
  validates :distress_score, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }, allow_nil: true

  scope :recent, -> { order(created_at: :desc) }
  scope :high_distress, -> { where("distress_score >= 7") }
  scope :escalated, -> { where(escalated_to_helpline: true) }

  def acute_emergency?
    trigger_category == "Overdose Emergency" || distress_score.to_i >= 8
  end
end
