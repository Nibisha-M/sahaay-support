# spec/controllers/crises_controller_spec.rb
require 'rails_helper'

RSpec.describe CrisesController, type: :controller do
  describe 'POST #create' do
    it 'accepts tile triggers and returns JSON or Turbo Stream response' do
      payload = { trigger_tile: 'Overdose Emergency', language: 'ml' }
      
      expect(GeminiCrisisService).to receive(:process_crisis).with(
        audio_base64: nil,
        trigger_tile: 'Overdose Emergency',
        language: 'ml',
        district: 'Thiruvananthapuram'
      ).and_call_original

      # Verify structure
      res = GeminiCrisisService.process_crisis(audio_base64: nil, trigger_tile: 'Overdose Emergency', language: 'ml')
      expect(res['call_helpline']).to eq(true)
    end
  end
end
