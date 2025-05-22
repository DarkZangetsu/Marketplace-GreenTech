'use client';

import HeroContact from '../components/contact/HeroContact';
import ContactSection from '../components/contact/ContactSection';
import MapContact from '../components/contact/MapContact';
import FAQContact from '../components/contact/FAQContact';

export default function ContactPage() {
  return (
    <div className="bg-white">
      <HeroContact />

      <ContactSection />

      <MapContact />

      <FAQContact />

    </div>
  );
} 