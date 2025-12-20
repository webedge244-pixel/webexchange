import React from "react";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-secondary/5 rounded-full" />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Secure • Fast • Decentralized
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-orbitron font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            The Future of{" "}
            <span className="text-primary text-glow-blue">Crypto</span> Exchange
          </h1>

          {/* Subtext */}
          <p
            className={`text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Trade, swap, and manage your digital assets with industry-leading
            security and lightning-fast transactions. Built for the next
            generation of traders.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-10 scale-95"
            }`}
          >
            {isAuthenticated ? (
              <Link href="/connect-wallet">
                <Button
                  size="lg"
                  className="btn-primary-glow text-lg px-8 py-6 gap-2"
                >
                  Connect Wallet
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="btn-primary-glow text-lg px-8 py-6 gap-2"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                {/* <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white/80 text-lg px-8 py-6 neon-border-purple hover:bg-secondary/10"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link> */}
              </>
            )}
          </div>

          {/* Feature Pills */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-[400ms] ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm">Instant Swaps</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm">Non-Custodial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
