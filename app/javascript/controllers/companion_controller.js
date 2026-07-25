// app/javascript/controllers/companion_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status", "response"]

  connect() {
    this.recognition = null;
    this.synth = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Could adapt based on user locale for Malayalam
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.statusTarget.textContent = `You said: "${transcript}"... Thinking...`;
        this.sendToGemini(transcript);
      };
      
      this.recognition.onerror = (event) => {
        this.statusTarget.textContent = "Error recognizing speech. Please try again.";
      };
    } else {
      this.statusTarget.textContent = "Speech recognition not supported in this browser.";
    }
  }

  startListening() {
    if (this.recognition) {
      this.statusTarget.textContent = "Listening...";
      this.recognition.start();
    }
  }

  sendToGemini(message) {
    fetch('/companion/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {
      this.responseTarget.textContent = data.reply;
      this.statusTarget.textContent = "Response received.";
      this.speakResponse(data.reply);
    })
    .catch(err => {
      this.statusTarget.textContent = "Failed to connect to Companion.";
    });
  }

  speakResponse(text) {
    if (this.synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      this.synth.speak(utterance);
    }
  }
}
