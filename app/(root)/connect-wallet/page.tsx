"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Wallet,
  Key,
  HelpCircle,
  ChevronRight,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authstore";

type Step = "intro" | "select" | "connect";
type ConnectionMethod = "seed" | "private-key" | "forgot";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  popular?: boolean;
}

const wallets: WalletOption[] = [
  { id: "metamask", name: "MetaMask", icon: "🦊", popular: true },
  { id: "trust", name: "Trust Wallet", icon: "🛡️", popular: true },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🔵", popular: true },
  { id: "phantom", name: "Phantom", icon: "👻" },
  { id: "ledger", name: "Ledger", icon: "🔐" },
  { id: "brave", name: "Brave Wallet", icon: "🦁" },
  { id: "rainbow", name: "Rainbow", icon: "🌈" },
  { id: "argent", name: "Argent", icon: "⚡" },
  { id: "exodus", name: "Exodus", icon: "🚀" },
  { id: "zerion", name: "Zerion", icon: "🔷" },
];

const ConnectWallet: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [step, setStep] = useState<Step>("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(
    null
  );
  const [connectionMethod, setConnectionMethod] =
    useState<ConnectionMethod>("seed");
  const [inputValue, setInputValue] = useState("");

  const filteredWallets = wallets.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setStep("connect");
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error("Please enter your recovery phrase or private key");
      return;
    }
    // Demo only - show success
    toast.success("Wallet connected successfully! (Demo)");
    router.push("/");
  };

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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
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
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
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
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  className="glass-card p-4 flex flex-col items-center gap-2 hover:neon-border-blue transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {wallet.icon}
                  </span>
                  <span className="text-sm font-medium">{wallet.name}</span>
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
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {wallet.icon}
              </span>
              <span className="font-medium flex-1 text-left">
                {wallet.name}
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

  const renderConnect = () => (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-3xl">
          {selectedWallet?.icon}
        </div>
        <h1 className="font-orbitron font-bold text-2xl mb-2">
          Connect {selectedWallet?.name}
        </h1>
        <p className="text-muted-foreground">
          Enter your credentials to connect
        </p>
      </div>

      {/* Connection Method Tabs */}
      <div className="flex rounded-lg bg-muted/50 p-1 mb-6">
        <button
          onClick={() => setConnectionMethod("seed")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            connectionMethod === "seed"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Seed Phrase
        </button>
        <button
          onClick={() => setConnectionMethod("private-key")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            connectionMethod === "private-key"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Private Key
        </button>
        <button
          onClick={() => setConnectionMethod("forgot")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            connectionMethod === "forgot"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="w-4 h-4 mx-auto" />
        </button>
      </div>

      <form onSubmit={handleConnect} className="space-y-6">
        {connectionMethod === "seed" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recovery Phrase</label>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your 12 or 24 word recovery phrase..."
              className="w-full bg-input border border-border rounded-lg px-4 py-3 min-h-[120px] input-glow focus:outline-none resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Separate each word with a space
            </p>
          </div>
        )}

        {connectionMethod === "private-key" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Private Key</label>
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your private key..."
              className="w-full bg-input border border-border rounded-lg px-4 py-3 input-glow focus:outline-none font-mono"
            />
          </div>
        )}

        {connectionMethod === "forgot" && (
          <div className="glass-card p-6 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h3 className="font-medium mb-2">Forgot Recovery Phrase?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you've lost your recovery phrase, you'll need to use your
              wallet's official recovery process.
            </p>
            <a href="#" className="text-sm text-primary hover:underline">
              Learn more about wallet recovery →
            </a>
          </div>
        )}

        {connectionMethod !== "forgot" && (
          <>
            <div className="glass-card p-4 flex items-start gap-3 bg-destructive/5 border-destructive/20">
              <Shield className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive font-medium">Demo Mode:</span>{" "}
                This is a UI demonstration. Never enter real recovery phrases or
                private keys on untrusted websites.
              </p>
            </div>

            <Button type="submit" className="w-full btn-primary-glow py-6">
              Connect Wallet
            </Button>
          </>
        )}
      </form>

      <button
        onClick={() => {
          setStep("select");
          setInputValue("");
        }}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Choose different wallet
      </button>
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

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="w-full max-w-md relative z-10">
          {step === "intro" && renderIntro()}
          {step === "select" && renderSelect()}
          {step === "connect" && renderConnect()}
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
