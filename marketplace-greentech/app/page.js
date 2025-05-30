'use client';
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import CTA from "./components/home/CTA";
import Listings from "./components/home/Listings";


export default function Home() {
  return (
    <div>
      {/* Section */}
      <Hero />
      {/* <AboutHome /> */}
      <Listings />
      {/* <Testimonials /> */}
      <Features />
      {/* <Parteners /> */}
      <CTA />
    </div>
  );
}
