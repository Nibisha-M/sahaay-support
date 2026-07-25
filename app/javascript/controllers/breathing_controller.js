// app/javascript/controllers/breathing_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["phaseText", "timerText", "circle"]

  connect() {
    this.startCycle()
  }

  disconnect() {
    if (this.interval) clearInterval(this.interval)
  }

  startCycle() {
    const phases = [
      { name: "Inhale (ശ്വാസമെടുക്കുക)", duration: 4, color: "text-emerald-400", scale: "scale-125" },
      { name: "Hold (അടക്കിവെക്കുക)", duration: 7, color: "text-sky-400", scale: "scale-125" },
      { name: "Exhale (പുറത്തുവിടുക)", duration: 8, color: "text-amber-400", scale: "scale-90" }
    ]

    let currentPhaseIdx = 0
    let secondsLeft = phases[0].duration

    const updateDisplay = () => {
      const current = phases[currentPhaseIdx]
      if (this.hasPhaseTextTarget) this.phaseTextTarget.textContent = current.name
      if (this.hasTimerTextTarget) this.timerTextTarget.textContent = `${secondsLeft}s`
    }

    updateDisplay()

    this.interval = setInterval(() => {
      secondsLeft -= 1
      if (secondsLeft <= 0) {
        currentPhaseIdx = (currentPhaseIdx + 1) % phases.length
        secondsLeft = phases[currentPhaseIdx].duration
      }
      updateDisplay()
    }, 1000)
  }
}
