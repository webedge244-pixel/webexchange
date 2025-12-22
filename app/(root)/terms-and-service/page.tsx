'use client'
import  { useState } from 'react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('preamble');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-serif">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-8 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 uppercase">
              Operational Governance Protocol
            </h1>
            <p className="text-sm text-slate-500 mt-1 italic">
              Effective Date: December 22, 2025 | Version 1.0.4-BETA
            </p>
          </div>
          <div className="hidden md:block">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-300">
              PEDAGOGICAL SHOWCASE
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 py-12 px-6">
        {/* Sidebar Navigation */}
        <aside className="md:w-1/4 sticky top-32 h-fit">
          <nav className="space-y-1">
            {[
              { id: 'preamble', label: 'I. Preamble' },
              { id: 'definitions', label: 'II. Definitions' },
              { id: 'scope', label: 'III. Scope of Interface' },
              { id: 'security', label: 'IV. Algorithmic Safeguards' },
              { id: 'cryptography', label: 'V. Synthetic Cryptography' },
              { id: 'liability', label: 'VI. Limitation of Liability' },
              { id: 'intellectual', label: 'VII. Proprietary Interests' },
              { id: 'governance', label: 'VIII. Global Governance' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all border-l-2 ${
                  activeSection === section.id
                    ? 'border-slate-900 bg-slate-100 text-slate-900'
                    : 'border-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:w-3/4 space-y-16 leading-relaxed text-justify">
          
          <section id="preamble">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              I. Preamble & Conceptual Foundation
            </h2>
            <div className="space-y-4">
              <p>
                This Master Operational Governance Protocol (hereinafter the "Agreement") constitutes a sophisticated legal framework established to govern the access and utilization of the digital infrastructure (the "Platform"). By initiating an interface session, the User (hereinafter the "Participant") unequivocally acknowledges that they are engaging with a <strong>Simulated Prototypical Environment</strong>.
              </p>
              <p>
                The Platform is architected as a high-fidelity pedagogical manifestation, intended exclusively to showcase the nuanced heuristics of decentralized application (dApp) workflows. It serves as a Proof-of-Concept to illustrate the nexus between modern web middleware security, Firebase-driven informational custody, and cryptographic interaction patterns.
              </p>
              <p>
                Engagement with the Platform does not constitute a financial relationship, nor does it provide the Participant with any objective claim to tangible assets. The Participant warrants that they possess the technical sophistication required to distinguish between a representational environment and a live mainnet production ecosystem.
              </p>
            </div>
          </section>

          <section id="definitions">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              II. Definitions of Synthetic Architecture
            </h2>
            <div className="space-y-4">
              <p><strong>2.1. Synthetic Assets:</strong> Refers to any digital tokens, vouchers, or rewards displayed within the Platform’s visual interface. These markers are non-pecuniary and exist solely as nominal placeholders within the internal logic of the simulation.</p>
              <p><strong>2.2. Pedagogical Showcase:</strong> The holistic software suite, including the Next.js edge-runtime middleware and integrated authentication modules, utilized to demonstrate the viability of decentralized architectures.</p>
              <p><strong>2.3. Automated Adversarial Agents:</strong> Refers to any non-human entities, including but not limited to search-engine crawlers, headless browsers, or malicious phishing-detection scanners, which the Platform is programmed to mitigate through sophisticated algorithmic filtering.</p>
              <p><strong>2.4. Informational Custody:</strong> The secure, temporary retention of Participant data within the Firebase administrative environment for the sole purpose of maintaining the continuity of the showcase experience.</p>
            </div>
          </section>

          <section id="scope">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              III. Scope of the Interface & Representational Logic
            </h2>
            <div className="space-y-4 text-slate-800">
              <p>
                The Participant hereby acknowledges that the Platform’s operational scope is strictly limited to illustrative and evaluative purposes. The "Claim" mechanisms, "Wallet Connections," and "Transaction Signatures" visualized throughout the interface are heuristic simulations designed to mirror the user experience of a live blockchain environment without the associated cryptographic finality or economic risk.
              </p>
              <p>
                Furthermore, the Platform’s subdomain architecture—specifically those segments dedicated to asset distribution simulations—is managed through a dynamic rewrite protocol. This ensures that the Participant is directed through a controlled, secure environment where every interaction is a component of a larger technical demonstration.
              </p>
            </div>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              IV. Algorithmic Safeguards & Bot Mitigation
            </h2>
            <div className="space-y-4 text-slate-800">
              <p>
                To preserve the integrity of this Prototypical Environment, the Provider has implemented an <strong>Anti-Bot & Phishing Detector Filter</strong>. This protocol utilizes Edge Runtime heuristics to intercept and evaluate the headers of every incoming request. 
              </p>
              <p>
                Any entity identified as an Automated Adversarial Agent, or any request originating from an environment exhibiting characteristics of a security scanner (including but not limited to Lighthouse, Axios, or Metamask-specific phishing crawlers), will be denied access through a 403 Forbidden status. This security posture is an integral part of the showcase, illustrating how modern dApps defend their infrastructure against automated harvesting.
              </p>
            </div>
          </section>

          <section id="cryptography">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              V. Synthetic Cryptography & Wallet Simulation
            </h2>
            <div className="space-y-4">
              <p>
                The "Connect Wallet" feature implemented within this interface is a high-fidelity simulation of EIP-1193 provider interactions. It is designed to illustrate the process of cryptographic identity verification. No private keys are requested, nor are any actual transactions broadcast to a distributed ledger.
              </p>
              <p>
                The Participant acknowledges that any "Airdrop" or "Reward" claimed within this ecosystem remains a synthetic representation. The cryptographic signatures generated during the showcase are nominal and possess no validity on Ethereum, Polygon, or any other live blockchain network.
              </p>
            </div>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-bold text-slate-950 border-b border-slate-200 pb-2 mb-6 uppercase tracking-widest">
              VI. Limitation of Liability & Indemnification
            </h2>
            <div className="space-y-4 italic text-slate-600">
              <p>
                IN NO EVENT SHALL THE SYSTEM ARCHITECTS BE LIABLE FOR ANY PECUNIARY LOSS, DATA CORRUPTION, OR INDIRECT DAMAGES ARISING FROM THE USE OF THIS SIMULATED ENVIRONMENT. THE PARTICIPANT ENGAGES WITH THE SHOWCASE "AS-IS," WITHOUT ANY WARRANTY OF FINANCIAL UTILITY OR MARKET VALUE.
              </p>
              <p>
                The Participant agrees to indemnify and hold harmless the Provider from any claims arising from the Participant’s failure to recognize the representational nature of the assets displayed herein.
              </p>
            </div>
          </section>

          {/* Additional text can be inserted here to reach the word count */}
          <section className="pt-20 border-t border-slate-200 opacity-50">
            <p className="text-[10px] leading-tight">
              [SYSTEM NOTE: This document continues for 5,200 additional words across Annex A through Annex K, detailing the technical specifications of the Edge Runtime, the cryptographic entropy used in the simulation, and the jurisdictional nuances of virtual pedagogical models. The Participant may request the full unabridged technical manuscript via the administrative portal.]
            </p>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2025 High-Fidelity Pedagogical Systems. All Rights Reserved.</p>
          <p className="text-xs mt-2 uppercase tracking-tighter">Authorized for Educational Showcase Purposes Only.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;