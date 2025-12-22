import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

const initialCryptoData: CryptoData[] = [
  {
    id: "1",
    symbol: "BTC",
    name: "Bitcoin",
    price: 89140.02,
    change24h: 0.98,
    icon: "₿",
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    price: 3035.8,
    change24h: -1.23,
    icon: "Ξ",
  },
  {
    id: "3",
    symbol: "SOL",
    name: "Solana",
    price: 127,
    change24h: 0.09,
    icon: "◎",
  },
  {
    id: "4",
    symbol: "BNB",
    name: "BNB",
    price: 861,
    change24h: -0.2,
    icon: "◆",
  },
  {
    id: "5",
    symbol: "XRP",
    name: "Ripple",
    price: 1.93,
    change24h: -0.15,
    icon: "✕",
  },
];

const formatPrice = (price: number) => {
  if (price >= 1000)
    return price.toLocaleString("en-US", { minimumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
};

const CryptoTicker: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [cryptoData, setCryptoData] = useState(initialCryptoData);
  const [flashingId, setFlashingId] = useState<string | null>(null);

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prev) => {
        const index = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const item = updated[index];

        updated[index] = {
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.005),
          change24h: item.change24h + (Math.random() - 0.5) * 0.1,
        };

        setFlashingId(item.id);
        setTimeout(() => setFlashingId(null), 500);

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="prices" className="py-20">
      <div ref={ref} className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold">
            Live <span className="text-secondary text-glow-purple">Prices</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Real-time cryptocurrency market data
          </p>
        </div>

        {/* Table */}
        <div
          className={`max-w-4xl mx-auto glass-card overflow-hidden transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Desktop Header */}
          <div className="hidden sm:grid grid-cols-4 px-6 py-4 text-sm border-b border-border/50 text-muted-foreground font-medium">
            <div>Asset</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h</div>
            <div className="text-right">Market Cap</div>
          </div>

          {/* Rows */}
          {cryptoData.map((crypto, index) => {
            const isPositive = crypto.change24h >= 0;

            return (
              <div
                key={crypto.id}
                className={`border-b border-border/30 last:border-0 px-4 py-4 transition ${
                  flashingId === crypto.id ? "bg-primary/10" : ""
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
                }}
              >
                {/* Mobile Layout */}
                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
                        {crypto.icon}
                      </div>
                      <div>
                        <p className="font-medium">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {crypto.name}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-mono font-medium ${
                        flashingId === crypto.id ? "text-primary" : ""
                      }`}
                    >
                      ${formatPrice(crypto.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">24h Change</span>
                    <span
                      className={`flex items-center gap-1 font-mono ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {crypto.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-4 gap-4 items-center px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      {crypto.icon}
                    </div>
                    <div>
                      <p className="font-medium">{crypto.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {crypto.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    ${formatPrice(crypto.price)}
                  </div>

                  <div
                    className={`flex justify-end items-center gap-1 font-mono ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {crypto.change24h.toFixed(2)}%
                  </div>

                  <div className="text-right font-mono text-muted-foreground">
                    $
                    {(
                      crypto.price *
                      (1_000_000 + index * 500_000)
                    ).toLocaleString("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Indicator */}
        <div className="flex justify-center items-center gap-2 mt-6 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live updates
        </div>
      </div>
    </section>
  );
};

export default CryptoTicker;
