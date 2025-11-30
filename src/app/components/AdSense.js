'use client';

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AdSense.module.css';

export default function AdSense({ adSlot, adFormat = 'auto', fullWidthResponsive = true }) {
  useEffect(() => {
    try {
      const adsbygoogle = globalThis.adsbygoogle || [];
      globalThis.adsbygoogle = adsbygoogle;
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={styles.adWrapper}>
      <ins
        className={`adsbygoogle ${styles.adSense}`}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3504234733980898"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

AdSense.propTypes = {
  adSlot: PropTypes.string.isRequired,
  adFormat: PropTypes.string,
  fullWidthResponsive: PropTypes.bool,
};

