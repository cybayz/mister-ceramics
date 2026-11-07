'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Why is Ceramic & Borophene Coating essential for Kerala's climate?",
    answer:
      "Kerala's unique tropical environment subjects vehicle paint to high ambient humidity, intense UV solar index, coastal salt-air exposure, and monsoon rainfall carrying dissolved mineral contaminants and acid particulates. Nanotech 9H Ceramic and 10H Borophene coatings bond molecularly to factory clearcoat, providing an impermeable hydrophobic shield that prevents water spot etching, bird dropping etching, and premature clearcoat oxidation.",
  },
  {
    question: 'How does Self-Healing Paint Protection Film (TPU PPF) work in Kerala heat?',
    answer:
      'Our optical-grade thermoplastic polyurethane (TPU) PPF features elastomeric self-healing memory. When exposed to road gravel, brush marks, or wash swirls, the ambient Kerala heat (or warm water) causes the polymeric chains to reflow into their smooth original state within minutes, maintaining a flawless mirror finish without buffing.',
  },
  {
    question: 'What is the distinction between Borophene 10H and traditional Ceramic 9H?',
    answer:
      'While Ceramic coatings utilize silicon dioxide (SiO2) nanoparticles, Borophene 10H is formulated using an atomically engineered 2D lattice of boron atoms. Borophene exhibits significantly higher tensile strength, extreme chemical resistance against detergents and tree sap (pH 1–14 tolerance), and superior heat dissipation under direct Kerala sunlight.',
  },
  {
    question: 'How long does a full studio treatment take at the Chegamanadu facility?',
    answer:
      'Precision detailing cannot be rushed. A comprehensive multi-stage paint correction and 9H Ceramic coating typically requires 18 to 24 hours (2 studio days), allowing for shortwave infrared lamp curing. Full-body TPU PPF installation requires 3 to 4 days in our cleanroom bay to ensure precision edge wrapping and bubble-free adhesion.',
  },
  {
    question: 'What maintenance is required after coating or PPF installation?',
    answer:
      'We recommend washing your vehicle with a pH-neutral automotive shampoo using a two-bucket grit-guard technique. Avoid harsh roadside detergents, borewell water with heavy mineral hardness, and dry dusting. Our studio provides periodic maintenance wash inspections and hydrophobic topper applications to sustain maximum gloss.',
  },
  {
    question: 'Can I track my vehicle while it is inside the Mister Ceramic workshop?',
    answer:
      'Yes! Through our proprietary Live Vehicle Tracking portal (/track), you can enter your booking reference and phone number to monitor real-time workshop floor stages—from initial paint depth inspection and decontamination to infrared curing and final inspection—complete with photo updates.',
  },
];

export default function KeralaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Structured Data Schema for Google Rich Snippets (FAQPage)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-24 bg-brand-dark relative border-t border-brand-border">
      {/* Inject FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Expert Detailing Knowledge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Essential insights into paint protection films, atomic ceramic coatings, and studio care tailored for vehicles in Kerala.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-brand-gold/10 border-brand-gold/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-brand-borderSubtle">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
