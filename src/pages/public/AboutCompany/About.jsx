import React from 'react'
import AboutHero from './AboutHero'
import AboutMission from './AboutMission'
import WhyCertazy from './WhyCertazy'
import ImpactNumbers from './ImpactNumbers'
import CertificationsMarquee from './CertificationsMarquee'
import CTABanner from '../HomePage/CTABanner'
export default function About() {
  return (
    <div>
      <AboutHero />
      <AboutMission />
      <WhyCertazy />
      <ImpactNumbers />
      <CertificationsMarquee />
      <CTABanner />
    </div>
  )
}