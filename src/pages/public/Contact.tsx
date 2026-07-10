import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { AGENCY_DATA } from '../../components/agencyData';

const Contact: React.FC = () => {
  return (
    <motion.div
      className="bg-background pt-32 pb-24 min-h-screen w-full flex flex-col items-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <SEO title={`${AGENCY_DATA.name} | Contact & About Us`} description={AGENCY_DATA.tagline} canonicalUrl="/contact" />

      <div className="w-full max-w-3xl flex flex-col gap-12">
        {/* Header section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text">
            Let's build together.
          </h1>
          <p className="text-xl text-muted font-medium max-w-2xl mx-auto leading-relaxed">
            {AGENCY_DATA.tagline}
          </p>
        </section>

        {/* About Us section */}
        <section className="bg-surface border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <h2 className="text-3xl font-semibold text-text">About Us</h2>
          
          <div className="space-y-6 text-lg text-text leading-relaxed">
            <p>
              <strong className="font-semibold text-primary">Positioning:</strong> {AGENCY_DATA.overview.positioning}
            </p>
            <p>
              <strong className="font-semibold text-primary">Approach:</strong> {AGENCY_DATA.overview.approach}
            </p>
            <p>
              <strong className="font-semibold text-primary">Philosophy:</strong> {AGENCY_DATA.overview.philosophy}
            </p>
          </div>
        </section>

        {/* Contact info section */}
        <section className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-surface border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-text mb-2">Email Us</h3>
            <p className="text-muted mb-4">For new projects or general inquiries.</p>
            <a href={`mailto:${AGENCY_DATA.contact.email}`} className="text-primary hover:text-fuchsia-600 font-medium text-lg transition-colors">
              {AGENCY_DATA.contact.email}
            </a>
          </div>

          <div className="flex-1 bg-surface border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-text mb-2">Chat with us</h3>
            <p className="text-muted">
              You can also use the widget in the bottom-left corner to ask our AI assistant anything about our services and portfolio.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Contact;
