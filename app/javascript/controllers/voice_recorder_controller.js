// app/javascript/controllers/voice_recorder_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "statusText"]

  connect() {
    this.audioChunks = []
    this.mediaRecorder = null
  }

  start(e) {
    if (e) e.preventDefault()

    this.buttonTarget.classList.add("scale-110", "bg-rose-500", "ring-4", "ring-rose-400/50")
    if (this.hasStatusTextTarget) {
      this.statusTextTarget.textContent = "Listening... Release mic when finished speaking"
      this.statusTextTarget.classList.add("text-rose-400")
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream)
        this.audioChunks = []

        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data)
          }
        }

        this.mediaRecorder.start()
      }).catch(err => {
        console.warn("Microphone permission denied or unavailable:", err)
        if (this.hasStatusTextTarget) {
          this.statusTextTarget.textContent = "Mic unavailable. Please tap one of the 4 tiles above."
        }
      })
    }
  }

  stop(e) {
    if (e) e.preventDefault()

    this.buttonTarget.classList.remove("scale-110", "bg-rose-500", "ring-4", "ring-rose-400/50")
    if (this.hasStatusTextTarget) {
      this.statusTextTarget.textContent = "Processing audio signal with Gemini AI..."
      this.statusTextTarget.classList.remove("text-rose-400")
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop()
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' })
        const formData = new FormData()
        formData.append("audio_data", audioBlob)
        formData.append("language", "ml")

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content

        fetch("/crises", {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrfToken,
            "Accept": "text/vnd.turbo-stream.html, application/json"
          },
          body: formData
        })
        .then(response => response.text())
        .then(html => {
          if (window.Turbo) {
            Turbo.renderStreamMessage(html)
          }
          if (this.hasStatusTextTarget) {
            this.statusTextTarget.textContent = "Hold mic to speak in Malayalam / Manglish"
          }
        })
        .catch(error => {
          console.error("Voice posting failed:", error)
          if (this.hasStatusTextTarget) {
            this.statusTextTarget.textContent = "Hold mic to speak in Malayalam / Manglish"
          }
        })
      }
    }
  }
}
