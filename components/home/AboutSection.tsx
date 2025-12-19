import React from 'react';
import { CreditCard, ArrowRightLeft, Shield, Smartphone } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    icon: CreditCard,
    title: 'Buy with Cards',
    description: 'Purchase crypto instantly using your credit or debit card. Support for all major payment methods.',
    color: 'primary',
  },
  {
    icon: ArrowRightLeft,
    title: 'Easy Swaps',
    description: 'Swap between 100+ cryptocurrencies with the best rates and minimal fees.',
    color: 'secondary',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected with industry-leading security protocols and encryption.',
    color: 'primary',
  },
  {
    icon: Smartphone,
    title: 'Intuitive Interface',
    description: 'Designed for both beginners and experts. Trade confidently with our clean, modern UI.',
    color: 'secondary',
  },
];

const AboutSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-primary/3 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-secondary/3 blur-3xl" />
      </div>

      <div 
        ref={ref}
        className="container mx-auto px-4 relative z-10"
      >
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4">
            How It <span className="text-primary text-glow-blue">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple, secure, and seamless crypto trading experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isBlue = feature.color === 'primary';
            
            return (
              <div
                key={feature.title}
                className={`glass-card p-8 group hover:scale-[1.02] transition-all duration-500 cursor-pointer ${
                  isBlue ? 'hover:neon-border-blue' : 'hover:neon-border-purple'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div 
                  className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    isBlue 
                      ? 'bg-primary/10 group-hover:bg-primary/20' 
                      : 'bg-secondary/10 group-hover:bg-secondary/20'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${isBlue ? 'text-primary' : 'text-secondary'}`} />
                </div>

                {/* Content */}
                <h3 className="font-orbitron font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { value: '$2.5B+', label: 'Trading Volume' },
            { value: '100K+', label: 'Active Users' },
            { value: '150+', label: 'Supported Coins' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="font-orbitron font-bold text-2xl md:text-3xl text-primary text-glow-blue mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
