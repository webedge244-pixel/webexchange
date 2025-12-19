import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

const initialCryptoData: CryptoData[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change24h: 2.45, icon: '₿' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 2280.00, change24h: -1.23, icon: 'Ξ' },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 98.50, change24h: 5.67, icon: '◎' },
  { id: '4', symbol: 'BNB', name: 'BNB', price: 312.00, change24h: 0.89, icon: '◆' },
  { id: '5', symbol: 'XRP', name: 'Ripple', price: 0.62, change24h: -2.15, icon: '✕' },
];

const CryptoTicker: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialCryptoData);
  const [flashingId, setFlashingId] = useState<string | null>(null);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const item = updated[randomIndex];
        const changePercent = (Math.random() - 0.5) * 0.5;
        const newPrice = item.price * (1 + changePercent / 100);
        
        updated[randomIndex] = {
          ...item,
          price: newPrice,
          change24h: item.change24h + (Math.random() - 0.5) * 0.1,
        };
        
        setFlashingId(item.id);
        setTimeout(() => setFlashingId(null), 500);
        
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  return (
    <section id="prices" className="py-20 relative">
      <div 
        ref={ref}
        className="container mx-auto px-4"
      >
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4">
            Live <span className="text-secondary text-glow-purple">Prices</span>
          </h2>
          <p className="text-muted-foreground">
            Real-time cryptocurrency market data
          </p>
        </div>

        {/* Crypto Table */}
        <div 
          className={`max-w-4xl mx-auto glass-card overflow-hidden transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-border/50 text-sm text-muted-foreground font-medium">
            <div>#  Asset</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h Change</div>
            <div className="text-right hidden sm:block">Market Cap</div>
          </div>

          {/* Table Rows */}
          {cryptoData.map((crypto, index) => (
            <div
              key={crypto.id}
              className={`grid grid-cols-4 gap-4 px-6 py-4 border-b border-border/30 last:border-0 
                hover:bg-muted/30 transition-all duration-300 cursor-pointer group
                ${flashingId === crypto.id ? 'bg-primary/10' : ''}
              `}
              style={{ 
                transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* Asset */}
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-4">{index + 1}</span>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {crypto.icon}
                </div>
                <div>
                  <p className="font-medium">{crypto.symbol}</p>
                  <p className="text-sm text-muted-foreground hidden sm:block">{crypto.name}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-end">
                <span 
                  className={`font-mono font-medium transition-all ${
                    flashingId === crypto.id ? 'text-primary scale-105' : ''
                  }`}
                >
                  ${formatPrice(crypto.price)}
                </span>
              </div>

              {/* 24h Change */}
              <div className="flex items-center justify-end gap-1">
                {crypto.change24h >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-green-500">
                      +{crypto.change24h.toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-red-500">
                      {crypto.change24h.toFixed(2)}%
                    </span>
                  </>
                )}
              </div>

              {/* Market Cap */}
              <div className="hidden sm:flex items-center justify-end">
                <span className="font-mono text-muted-foreground">
                  ${(crypto.price * (1000000 + index * 500000)).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live data updates</span>
        </div>
      </div>
    </section>
  );
};

export default CryptoTicker;
