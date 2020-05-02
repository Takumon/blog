import React from 'react'
import AdSense from 'react-adsense'

const Adsense = () => (
  <AdSense.Google
    client={process.env.GOOGLE_AD_CLIENT_ID}
    slot={process.env.GOOGLE_AD_SLOT}
    format='fluid'
  />
)

export default Adsense;

