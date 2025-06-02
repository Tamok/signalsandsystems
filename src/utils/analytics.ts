export const gtmId = 'GTM-XXXXXXX'; // Replace with your actual GTM ID when ready to deploy

// Function to initialize Google Tag Manager
export const initGTM = (id: string) => {
    // Add Google Tag Manager code
    const script = document.createElement('script');
    script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${id}');
    `;
    
    // Add to the head
    document.head.appendChild(script);
    
    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
};

// Function to send a custom event to GTM
export const sendGTMEvent = (eventName: string, eventParams: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...eventParams
        });
    }
};

// GDPR/Consent: We only store your analytics consent (granted/denied) in localStorage under 'ss-analytics-consent'. No other personal data is stored or tracked by this site. You can change your consent at any time using the preferences link in the footer.

// Type definitions for TypeScript
declare global {
    interface Window {
        dataLayer: any[];
    }
}
