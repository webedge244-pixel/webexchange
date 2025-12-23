import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    question: 'How do I buy crypto with my credit card?',
    answer: 'Simply create an account, complete verification, connect your card, and select the cryptocurrency you want to purchase. The process takes just a few minutes, and your crypto will be available in your wallet instantly.',
  },
  {
    question: 'What cryptocurrencies can I trade?',
    answer: 'We support over 150 cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and many more. You can swap between any supported pairs with competitive rates and minimal fees.',
  },
  {
    question: 'Is my crypto safe on vexelweb3chain?',
    answer: 'Yes. We use bank-grade security measures including 256-bit encryption, cold storage for the majority of assets, and multi-signature wallets. Additionally, we recommend using a hardware wallet for maximum security.',
  },
  {
    question: 'What are the trading fees?',
    answer: 'Our fees are among the lowest in the industry. Swaps typically cost 0.1-0.5% depending on the trading pair. Card purchases have a flat 2.5% fee. There are no hidden fees or monthly charges.',
  },
  {
    question: 'How do I connect my wallet?',
    answer: 'Click the "Connect Wallet" button in the navigation. We support all major wallets including MetaMask, Trust Wallet, Coinbase Wallet, and more. You can also connect using WalletConnect for mobile wallets.',
  },
  {
    question: 'Can I withdraw to my bank account?',
    answer: 'Yes, verified users can withdraw funds to their linked bank account. Withdrawals typically process within 1-3 business days depending on your bank and location.',
  },
];

const FAQSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" className="py-20 relative">
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
            Frequently Asked <span className="text-secondary text-glow-purple">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about trading on vexelweb3chain
          </p>
        </div>

        {/* FAQ Accordion */}
        <div 
          className={`max-w-3xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-none px-6 overflow-hidden data-[state=open]:neon-border-purple transition-all duration-300"
              >
                <AccordionTrigger className="py-5 text-left font-orbitron font-medium hover:no-underline hover:text-secondary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="#" className="text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
