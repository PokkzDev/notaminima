'use client';

import { useEffect } from 'react';
import { hasCookieConsent } from './CookieConsent';

export default function ConditionalScripts() {
  useEffect(() => {
    const checkConsent = () => {
      const hasConsent = hasCookieConsent();
      
      if (hasConsent) {
        // Load Google Analytics
        if (!globalThis.dataLayer) {
          globalThis.dataLayer = [];
          globalThis.gtag = function() {
            globalThis.dataLayer.push(arguments);
          };
          globalThis.gtag('js', new Date());
        }
        
        // Load gtag script if not already loaded
        if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
          const script1 = document.createElement('script');
          script1.async = true;
          script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-5E4XVS6STV';
          document.head.appendChild(script1);
          
          script1.onload = () => {
            globalThis.gtag('config', 'G-5E4XVS6STV', {
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          };
        }
        
        // Load AdSense script if not already loaded
        if (!document.querySelector('script[src*="googlesyndication.com/pagead/js/adsbygoogle"]')) {
          const script2 = document.createElement('script');
          script2.async = true;
          script2.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3504234733980898';
          script2.crossOrigin = 'anonymous';
          document.head.appendChild(script2);
        }
      } else if (globalThis.gtag) {
        // If consent is revoked, disable analytics
        globalThis.gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
        });
      }
    };
    
    checkConsent();
    
    // Listen for storage changes (when consent is given)
    const handleStorageChange = () => {
      checkConsent();
    };
    
    globalThis.addEventListener('storage', handleStorageChange);
    // Also listen for custom event in case consent is changed in same tab
    globalThis.addEventListener('cookieConsentChanged', handleStorageChange);
    
    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
      globalThis.removeEventListener('cookieConsentChanged', handleStorageChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

