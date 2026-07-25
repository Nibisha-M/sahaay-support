// app/javascript/controllers/vision_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "preview", "results"]

  connect() {
    console.log("Vision controller connected for pill strip / prescription analysis.");
  }

  processImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewTarget.src = e.target.result;
      this.previewTarget.classList.remove('hidden');
      
      this.resultsTarget.innerHTML = "<p class='text-slate-400'>Analyzing image with Gemini Vision...</p>";

      // Extract base64 without prefix
      const base64Data = e.target.result.split(',')[1];
      
      this.sendToVisionAPI(base64Data);
    };
    reader.readAsDataURL(file);
  }

  sendToVisionAPI(base64) {
    fetch('/vision/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_data: base64 })
    })
    .then(res => res.json())
    .then(data => {
      this.resultsTarget.innerHTML = `
        <div class="space-y-2 mt-4 p-4 border border-emerald-500/30 rounded-xl bg-emerald-950/20">
          <h4 class="text-sm font-bold text-white">Detected: ${data.detected_medication}</h4>
          <p class="text-xs text-slate-300"><span class="font-bold text-emerald-400">Safe Usage:</span> ${data.safe_usage}</p>
          <p class="text-xs text-slate-300"><span class="font-bold text-amber-400">Risks:</span> ${data.risks}</p>
          <p class="text-xs text-slate-300"><span class="font-bold text-rose-400">Emergency:</span> ${data.emergency_guidance}</p>
        </div>
      `;
    })
    .catch(err => {
      this.resultsTarget.innerHTML = "<p class='text-rose-400 text-xs'>Failed to analyze image.</p>";
    });
  }
}
