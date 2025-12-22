import React, { useState, useEffect } from "react";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CryptoOption {
  symbol: string;
  name: string;
  price: number;
  icon: string;
}

const cryptoOptions: CryptoOption[] = [
  { symbol: "BTC", name: "Bitcoin", price: 89140.02, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 3035.8, icon: "Ξ" },
  { symbol: "SOL", name: "Solana", price: 127, icon: "◎" },
  { symbol: "USDT", name: "Tether", price: 1.0, icon: "₮" },
  { symbol: "BNB", name: "BNB", price: 861, icon: "◆" },
];

const fiatOptions = [
  { symbol: "USD", name: "US Dollar", rate: 1 },
  { symbol: "EUR", name: "Euro", rate: 0.92 },
  { symbol: "GBP", name: "British Pound", rate: 0.79 },
];

const CryptoCalculator: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [mode, setMode] = useState<"crypto" | "fiat">("crypto");
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCrypto, setFromCrypto] = useState(cryptoOptions[0]);
  const [toCrypto, setToCrypto] = useState(cryptoOptions[1]);
  const [fromFiat, setFromFiat] = useState(fiatOptions[0]);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    calculateSwap();
  }, [fromAmount, fromCrypto, toCrypto, fromFiat, mode]);

  const calculateSwap = () => {
    const amount = parseFloat(fromAmount) || 0;
    if (mode === "crypto") {
      const result = (amount * fromCrypto.price) / toCrypto.price;
      setToAmount(result.toFixed(6));
    } else {
      const result = amount / toCrypto.price;
      setToAmount(result.toFixed(6));
    }
  };

  const handleSwapDirection = () => {
    setIsSwapping(true);
    setTimeout(() => {
      if (mode === "crypto") {
        const temp = fromCrypto;
        setFromCrypto(toCrypto);
        setToCrypto(temp);
      }
      setIsSwapping(false);
    }, 300);
  };

  return (
    <section id="swap" className="py-20 relative">
      <div ref={ref} className="container mx-auto px-4 ">
        <div className="max-w-xl mx-auto ">
          {/* Header */}
          <div
            className={`text-center mb-10 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4">
              Swap{" "}
              <span className="text-primary text-glow-blue">Instantly</span>
            </h2>
            <p className="text-muted-foreground">
              Exchange crypto or buy with your local currency
            </p>
          </div>

          {/* Calculator Card */}
          <div
            className={`glass-card-blue p-6 md:p-8 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Mode Toggle */}
            <div className="flex rounded-lg bg-muted/50 p-1 mb-6">
              <button
                onClick={() => setMode("crypto")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === "crypto"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Crypto → Crypto
              </button>
              <button
                onClick={() => setMode("fiat")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  mode === "fiat"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fiat → Crypto
              </button>
            </div>

            {/* From Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm text-muted-foreground">You Pay</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 text-lg font-mono input-glow focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <select
                  value={
                    mode === "crypto" ? fromCrypto.symbol : fromFiat.symbol
                  }
                  onChange={(e) => {
                    if (mode === "crypto") {
                      const crypto = cryptoOptions.find(
                        (c) => c.symbol === e.target.value
                      );
                      if (crypto) setFromCrypto(crypto);
                    } else {
                      const fiat = fiatOptions.find(
                        (f) => f.symbol === e.target.value
                      );
                      if (fiat) setFromFiat(fiat);
                    }
                  }}
                  className="bg-muted border border-border rounded-lg px-4 py-3 font-medium input-glow focus:outline-none min-w-30"
                >
                  {mode === "crypto"
                    ? cryptoOptions.map((c) => (
                        <option key={c.symbol} value={c.symbol}>
                          {c.icon} {c.symbol}
                        </option>
                      ))
                    : fiatOptions.map((f) => (
                        <option key={f.symbol} value={f.symbol}>
                          {f.symbol}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            {mode === "crypto" && (
              <div className="flex justify-center my-4">
                <button
                  onClick={handleSwapDirection}
                  className={`p-3 rounded-full glass-card hover:neon-border-blue transition-all ${
                    isSwapping ? "rotate-180" : ""
                  }`}
                  style={{ transition: "transform 0.3s ease-in-out" }}
                >
                  <ArrowDownUp className="w-5 h-5 text-primary" />
                </button>
              </div>
            )}

            {/* To Input */}
            <div className="space-y-2 mb-6">
              <label className="text-sm text-muted-foreground">
                You Receive
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    className="w-full bg-input/50 border border-border rounded-lg px-4 py-3 text-lg font-mono focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <select
                  value={toCrypto.symbol}
                  onChange={(e) => {
                    const crypto = cryptoOptions.find(
                      (c) => c.symbol === e.target.value
                    );
                    if (crypto) setToCrypto(crypto);
                  }}
                  className="bg-muted border border-border rounded-lg px-4 py-3 font-medium input-glow focus:outline-none min-w-30"
                >
                  {cryptoOptions.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.icon} {c.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate Display */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 px-1">
              <span>Exchange Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  1 {mode === "crypto" ? fromCrypto.symbol : fromFiat.symbol} ≈{" "}
                  {mode === "crypto"
                    ? (fromCrypto.price / toCrypto.price).toFixed(6)
                    : (1 / toCrypto.price).toFixed(6)}{" "}
                  {toCrypto.symbol}
                </span>
                <RefreshCw className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Swap Button */}
            <Button className="w-full btn-primary-glow py-6 text-lg">
              {mode === "crypto" ? "Swap Now" : "Buy Crypto"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoCalculator;
