'use client';

import { useEffect, useState } from 'react';
import { hasCookieConsent } from './CookieConsent';

export default function ConditionalScripts() {
  const [consent, setConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkConsent = () => {
      const hasConsent = hasCookieConsent();
      setConsent(hasConsent);
      
      if (hasConsent) {
        // Load Google Analytics
        if (!window.dataLayer) {
          window.dataLayer = [];
          window.gtag = function() {
            window.dataLayer.push(arguments);
          };
          window.gtag('js', new Date());
        }
        
        // Load gtag script if not already loaded
        if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
          const script1 = document.createElement('script');
          script1.async = true;
          script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-5E4XVS6STV';
          document.head.appendChild(script1);
          
          script1.onload = () => {
            window.gtag('config', 'G-5E4XVS6STV', {
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
      } else {
        // If consent is revoked, disable analytics
        if (window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
          });
        }
      }
    };
    
    checkConsent();
    
    // Listen for storage changes (when consent is given)
    const handleStorageChange = () => {
      checkConsent();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event in case consent is changed in same tab
    window.addEventListener('cookieConsentChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentChanged', handleStorageChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

