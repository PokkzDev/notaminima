'use client';

import { useEffect } from 'react';

export default function AdSense({ adSlot, adFormat = 'auto', fullWidthResponsive = true }) {
  useEffect(() => {
    try {
      ((window.adsbygoogle = window.adsbygoogle || []).push({}));
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3504234733980898"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}

