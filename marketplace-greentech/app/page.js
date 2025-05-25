'use client';
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import CTA from "./components/home/CTA";
import Listings from "./components/home/Listings";
import Parteners from "./components/home/Parteners";
import Testimonials from "./components/home/Testimonials";
import AboutHome from "./components/home/AboutHome";


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
