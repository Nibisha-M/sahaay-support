# db/schema.rb
# This file is auto-generated from the current state of the database.
ActiveRecord::Schema[7.1].define(version: 2026_07_25_000000) do
  # Enable PgVector for semantic search over educational & safety resources
  enable_extension "plpgsql"
  enable_extension "vector"

  create_table "users", force: :cascade do |t|
    t.string "phone_number_digest", null: false
    t.string "role", default: "patient", null: false # patient, caregiver, clinician
    t.string "preferred_language", default: "ml" # ml (Malayalam), en, manglish
    t.string "district", default: "Thiruvananthapuram"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "crisis_episodes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "trigger_category" # craving, panic, overdose_risk, conflict
    t.text "raw_audio_transcript"
    t.jsonb "ai_assessment", default: {}
    t.text "generated_script"
    t.integer "distress_score" # 1 to 10
    t.boolean "escalated_to_helpline", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_crisis_episodes_on_user_id"
  end

  create_table "safety_resources", force: :cascade do |t|
    t.string "title", null: false
    t.string "resource_type", null: false # hospital, helpline, legal_support, deaddiction_center
    t.string "district", null: false
    t.string "contact_number", null: false
    t.text "address"
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.vector "embedding", limit: 768 # vector representation for RAG retrieval
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "crisis_episodes", "users"
end
