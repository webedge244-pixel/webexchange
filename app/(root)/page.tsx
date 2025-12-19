import React from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>NexusX - The Future of Crypto Exchange</title>
        <meta
          name="description"
          content="Trade, swap, and manage your digital assets with industry-leading security and lightning-fast transactions. Buy crypto with cards or swap instantly."
        />
        <meta
          name="keywords"
          content="crypto exchange, cryptocurrency, bitcoin, ethereum, swap, trading"
        />
      </Helmet>

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
