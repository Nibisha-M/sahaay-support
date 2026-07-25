// public/service-worker.js
const CACHE_NAME = "sahaay-offline-v1";
const EMERGENCY_RESOURCES = [
  "/",
  "/crises",
  "/safety_resources"
];

const EMERGENCY_HELPLINES = {
  disha: "1056",
  vimukthi: "155300",
  nmba: "14446",
  ambulance: "108"
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Sahaay SW] Pre-caching critical emergency helpline assets");
      return cache.addAll(EMERGENCY_RESOURCES).catch(err => {
        console.warn("[Sahaay SW] Caching optional assets skipped:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Network first with offline fallback for emergency access
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) return response;
        // Fallback response for crisis requests when completely offline
        if (event.request.url.includes("/crises")) {
          return new Response(
            JSON.stringify({
              distress_score: 9,
              immediate_action: "ഓഫ്‌ലൈൻ എമർജൻസി: ദീർഘമായി ശ്വാസമെടുക്കുക. DISHA 1056 ഹെൽപ്പ്‌ലൈനിൽ വിളിക്കുക.",
              emergency_script: "DISHA Helpline Call 1056 immediately for Kerala SUD Emergency.",
              call_helpline: true,
              helpline_number: EMERGENCY_HELPLINES.disha
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      });
    })
  );
});
