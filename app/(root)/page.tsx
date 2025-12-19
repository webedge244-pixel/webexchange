"use client";
import React from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CryptoCalculator from "@/components/home/CryptoCalculator";
import CryptoTicker from "@/components/home/CryptoTicker";
import AboutSection from "@/components/home/AboutSection";
import FAQSection from "@/components/home/FAQSection";

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          <HeroSection />
          <CryptoCalculator />
          <CryptoTicker />
          <AboutSection />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
