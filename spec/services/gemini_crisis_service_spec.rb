# spec/services/gemini_crisis_service_spec.rb
require 'rails_helper'

RSpec.describe GeminiCrisisService do
  describe '.process_crisis' do
    context 'when API key is missing or offline fallback is active' do
      it 'returns structured fallback emergency response for Overdose Emergency' do
        result = described_class.process_crisis(
          trigger_tile: 'Overdose Emergency',
          language: 'ml',
          district: 'Ernakulam'
        )

        expect(result).to be_a(Hash)
        expect(result['distress_score']).to eq(10)
        expect(result['call_helpline']).to eq(true)
        expect(result['helpline_number']).to eq('1056')
        expect(result['emergency_script']).to include('DISHA 1056/108')
      end

      it 'returns calming grounding response for Panic Grounding' do
        result = described_class.process_crisis(
          trigger_tile: 'Panic Grounding',
          language: 'ml',
          district: 'Thiruvananthapuram'
        )

        expect(result['distress_score']).to eq(7)
        expect(result['immediate_action']).to include('4 സെക്കൻഡ്')
      end
    end
  end
end
