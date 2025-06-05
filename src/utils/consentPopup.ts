// Shared utility for creating consent popups
// Used by both initial consent popup and footer consent manager

import { sendGTMEvent } from './analytics.js';

export function createConsentPopup(isPreferencesMode = false) {
  const consentKey = 'ss-analytics-consent';
  
  // Don't create if popup already exists
  if (document.getElementById('astro-consent-popup')) return;
  
  const popup = document.createElement('div');
  popup.id = 'astro-consent-popup';
  popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60';
  
  const title = isPreferencesMode ? 'Analytics Consent Preferences' : 'Analytics Consent';  const description = isPreferencesMode 
    ? 'You can update your analytics consent at any time. We use Google Tag Manager (GA4) to collect anonymous usage data because we love data and want to improve the site. Declining is totally fine and won\'t affect your experience. <a href="/privacy" target="_blank" class="text-blue-600 underline">Read our Privacy Policy</a> for full details.'
    : 'We use Google Tag Manager (GA4) to collect anonymous usage data because I\'m a nerd who loves data and patterns. This helps me improve the site and content. Declining is totally fine and won\'t affect your experience. No personal data is stored, and you can change your preference at any time using the link in the footer. <a href="/privacy" target="_blank" class="text-blue-600 underline">Read our Privacy Policy</a> for full details.';
  
  popup.innerHTML = `
    <div class='bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-gray-900' role='dialog' aria-modal='true' aria-labelledby='consent-title'>
      <h2 id='consent-title' class='text-lg font-semibold mb-2'>${title}</h2>
      <p class='mb-4'>${description}</p>
      <div class='flex gap-2 justify-end'>
        <button id='decline-btn' class='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'>Decline</button>
        <button id='accept-btn' class='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'>Accept</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Add event listeners
  popup.querySelector('#accept-btn')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'granted');
    popup.remove();
    if (isPreferencesMode) {
      window.location.reload(); // Reload to apply GTM if newly accepted
    }
  });
  
  popup.querySelector('#decline-btn')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'denied');
    popup.remove();
    if (isPreferencesMode) {
      window.location.reload(); // Reload to remove GTM if newly declined
    }
  });
  
  return popup;
}
