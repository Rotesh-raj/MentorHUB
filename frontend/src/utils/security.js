/**
 * Security Utility for Device Binding
 * Generates a unique fingerprint for the current device/browser session.
 */
export const getDeviceFingerprint = () => {
  let fingerprint = localStorage.getItem("mentorhub_device_id");
  
  if (!fingerprint) {
    // Generate a unique ID using crypto.randomUUID or a fallback
    fingerprint = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("mentorhub_device_id", fingerprint);
  }
  
  // Combine with User Agent for extra bound layer
  return `${fingerprint}-${navigator.userAgent.replace(/[^a-zA-Z0-9]/g, "").substring(0, 50)}`;
};
