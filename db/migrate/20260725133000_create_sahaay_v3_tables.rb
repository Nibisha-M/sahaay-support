class CreateSahaayV3Tables < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :mood
      t.integer :cravings_intensity
      t.integer :sleep_hours
      t.text :notes

      t.timestamps
    end

    create_table :relapse_risks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :risk_level
      t.integer :score
      t.text :ai_explanation
      t.text :preventative_actions

      t.timestamps
    end

    create_table :recovery_milestones do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.integer :streak_days

      t.timestamps
    end

    create_table :knowledge_documents do |t|
      t.string :title
      t.text :content
      t.string :category
      t.vector :embedding, limit: 768

      t.timestamps
    end

    create_table :community_posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :content
      t.boolean :is_flagged, default: false
      t.string :risk_level

      t.timestamps
    end
  end
end
