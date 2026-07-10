import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../../components/ScrollReveal';
import SplitText from '../../components/SplitText';
import Antigravity from '../../components/Antigravity';
import Magnet from '../../components/Magnet';
import ProjectThumbnailSection, { type ProjectThumbnail } from '../../components/ProjectThumbnailSection';
import { getPage, getProjects, getSettings } from '../../controllers/apiController';
import SEO from '../../components/SEO';
import './About.css';

const DEFAULTS = {
  hero_line1: 'About ALPHA',
  hero_line2: 'Where AI Meets Imagination.',
  products_title: 'A Gallery Powered by AI',
  products_paragraphs: [
    "We believe that creativity is the ultimate human frontier. AI isn't here to replace the artist—it's here to provide a canvas without boundaries.",
    "ALPHA was built to give everyone the tools to visualize their ideas in breathtaking quality. By integrating the latest generative models directly into our studio, we empower creators to bring their wildest visions to life.",
    "Describe your vision in simple text and let our integrated engine render it into high-fidelity art within seconds. Save your best generations to your personal gallery, and share your unique aesthetic with the world.",
  ],
  services_items: ['Instant Image Generation', 'High-Fidelity Rendering', 'Personal Galleries', 'Community Curation', 'Creative Discovery'],
  faqs: [
    { question: 'How do I create an image?', answer: 'Simply head over to the Create page, describe what you want to see in the prompt box, and let the AI generate it instantly.' },
    { question: 'Can I save my creations?', answer: 'Yes! Every image you generate can be saved directly to your personal gallery to build your own portfolio of AI artwork.' },
    { question: 'What powers the generation?', answer: 'We utilize advanced AI models to interpret your prompts and render highly detailed, creative imagery.' },
  ],
  cta_title: "Start creating today.",
  cta_button_text: 'Open Studio',
  cta_button_link: '/create',
};

const About: React.FC<{ onOpenContact?: () => void }> = ({ onOpenContact }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState(DEFAULTS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectThumbnail[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [siteSettings, setSiteSettings] = useState({ cta_title: DEFAULTS.cta_title, cta_button_text: DEFAULTS.cta_button_text, contact_email: 'christian@offmenu.design' });

  useEffect(() => {
    getPage('about').then(d => {
      if (d?.content) setPageData({ ...DEFAULTS, ...d.content });
    }).catch(() => { });

    getProjects().then(data => {
      if (Array.isArray(data)) setProjects(data);
    }).catch(() => { })
      .finally(() => setIsLoadingProjects(false));

    getSettings().then(settings => {
      setSiteSettings({
        cta_title: settings?.cta_title || DEFAULTS.cta_title,
        cta_button_text: settings?.cta_button_text || DEFAULTS.cta_button_text,
        contact_email: settings?.contact_email || 'christian@offmenu.design',
      });
    }).catch(() => { });
  }, []);

  const ctaHref = `/create`;

  return (
    <div ref={containerRef} className="about-container">
      <SEO 
        title="ZEMZ | About Us" 
        description={`${pageData.hero_line1} ${pageData.hero_line2}`} 
        canonicalUrl="https://zemz.pro/about" 
      />
      <section className="about-hero-section">
        <div className="antigravity-wrapper" style={{ opacity: 0.8 }}>
          <Antigravity color="var(--color-text)" count={80} magnetRadius={12} fieldStrength={10} particleSize={1.2} autoAnimate={true} />
        </div>
        <div className="max-container">
          <h1 className="hero-title">
            <span className="hero-line-1">
              <SplitText text={pageData.hero_line1} delay={30} animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </span>
            <span className="hero-line-2">
              <SplitText text={pageData.hero_line2} delay={30} animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </span>
          </h1>
        </div>
      </section>

      <section className="products-section">
        <div className="max-container">
          <div className="products-header">
            <h2 className="products-title">
              <SplitText text={pageData.products_title} delay={40} animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} />
            </h2>
            <div className="products-content">
              {pageData.products_paragraphs.map((para, i) => (
                <ScrollReveal key={i} y={30} delay={0.1}>
                  <p className="products-description">{para}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="scope-section">
        <div className="max-container">
          <div className="scope-header">
            <h2 className="project-info-label">
              <SplitText text="Services" delay={50} animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} textAlign="left" />
            </h2>
          </div>
          <div className="scope">
            <ul className="service-list">
              {pageData.services_items.map((item, i) => (
                <li key={i} className="service-item">
                  <span className="item-text">{item}</span>
                  <span className="item-number">{(i + 1).toString().padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProjectThumbnailSection projects={projects} startIndex={0} isLoading={isLoadingProjects} />

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="max-container">
          <div className="faq-header">
            <h2 className="project-info-label">
              <SplitText text="FAQ" delay={50} animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }} animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }} textAlign="left" />
            </h2>
          </div>
          <div className="faq-list">
            {pageData.faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeIndex === i ? 'active' : ''}`}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                <div className="faq-question">
                  <span className="item-text">{faq.question}</span>
                  <span className="item-number">{(i + 1).toString().padStart(2, '0')}</span>
                </div>
                <motion.div className="faq-answer-wrapper" initial={false}
                  animate={{ height: activeIndex === i ? 'auto' : 0, opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <div className="pb-20 md:pb-40"></div>
    </div>
  );
};

export default About;
