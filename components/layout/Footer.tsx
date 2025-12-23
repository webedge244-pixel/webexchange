import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 neon-border-blue flex items-center justify-center">
                <span className="font-orbitron font-bold text-primary text-sm overflow-hidden object-cover">
                <img src='/webex.jpeg' alt='logo' className='w-7 h-7 rounded-md'/>
              </span>
              </div>
              <span className="font-orbitron font-bold text-lg">
                vexel<span className="text-primary">web3</span>chain
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The future of decentralized exchange. Trade with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#swap"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Swap
                </a>
              </li>
              <li>
                <a
                  href="#prices"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Prices
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-orbitron font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 vexelweb3chain. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="privacy-policy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-service"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
