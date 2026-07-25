# app/models/safety_resource.rb
class SafetyResource < ApplicationRecord
  validates :title, :resource_type, :district, :contact_number, presence: true

  scope :for_district, ->(district_name) {
    if district_name.blank? || district_name == "All Kerala"
      all
    else
      where("district = ? OR district = 'All Kerala'", district_name)
    end
  }

  scope :helplines, -> { where(resource_type: "helpline") }
  scope :hospitals, -> { where(resource_type: ["hospital", "deaddiction_center"]) }
end
