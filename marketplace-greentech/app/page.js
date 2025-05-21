'use client';
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import CTA from "./components/home/CTA";
import Recherches from "./components/home/Recherches";
import Listings from "./components/home/Listings";
import Categories from "./components/home/Categories";
import Parteners from "./components/home/Parteners";


export default function Home() {
  return (
    <div>
      {/* Section */}
      <Hero />

      <Recherches />

      <Listings />

      <Features />

      <Categories />

      <Parteners />

      <CTA />
    </div>
  );
}
