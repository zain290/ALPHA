import React, { useEffect, useState } from 'react';
import SplitText from '../../components/SplitText';
import ScrollReveal from '../../components/ScrollReveal';
import Antigravity from '../../components/Antigravity';
import { getPage } from '../../controllers/apiController';
import SEO from '../../components/SEO';
import './PrivacyPolicy.css';

const DEFAULT_PAGE = {
  hero_line1: 'Privacy Policy',
  hero_line2: 'Transparency & Trust',
  sections: [
    {
      label: 'Introduction',
      title: 'Respecting Your Privacy',
      paragraphs: [
        'At ZEMZ, we are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.',
        'This privacy policy applies to all information collected through our website and/or any related services, sales, marketing or events.',
      ],
    },
    {
      label: 'Information Collection',
      title: 'Information We Collect',
      paragraphs: [
        'We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.',
        'The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use.',
      ],
      bullets: [
        'Name and contact data: We collect your first and last name, email address, and other similar contact data when you use our contact form.',
      ],
    },
    {
      label: 'Usage',
      title: 'How We Use Your Information',
      paragraphs: [
        'We use personal information collected via our Website for a variety of business purposes described below.',
        'We may use your information to respond to your inquiries, solve issues with our services, analyze usage trends, and improve our website, products, and marketing.',
      ],
    },
    {
      label: 'Third Parties',
      title: 'Sharing Your Information',
      paragraphs: [
        'We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.',
        'We do not sell, rent or share your personal information with third parties for their marketing purposes.',
      ],
    },
    {
      label: 'Security',
      title: 'Keeping Your Information Safe',
      paragraphs: [
        'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please remember that the internet itself cannot be guaranteed to be 100% secure.',
      ],
    },
  ],
};

const formatUpdatedAt = (value?: string | null) =>
  new Date(value || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const PrivacyPolicy: React.FC = () => {
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    getPage('privacy-policy')
      .then((page) => {
        setPageData({
          ...DEFAULT_PAGE,
          ...page.content,
          sections: page.content?.sections || DEFAULT_PAGE.sections,
        });
        setUpdatedAt(page.updated_at || null);
      })
      .catch((err) => {
        console.error('Privacy page load error:', err);
      });
  }, []);

  return (
    <div className="privacy-container">
      <SEO
        title="ZEMZ | Privacy Policy"
        description={`${pageData.hero_line1} - ${pageData.hero_line2}`}
        canonicalUrl="https://zemz.pro/privacy-policy"
      />
      <section className="privacy-hero-section">
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

      <section className="privacy-content-section">
        {pageData.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="privacy-block">
            <ScrollReveal y={20} delay={0.1}>
              <span className="privacy-label">{section.label}</span>
              <h2>{section.title}</h2>
              <div className="privacy-text">
                {(section.paragraphs || []).map((paragraph: string, paragraphIndex: number) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        ))}

        <div className="last-updated">
          <p>Last updated: {formatUpdatedAt(updatedAt)}</p>
        </div>
      </section>
      <div className="pb-20 md:pb-40"></div>
    </div>
  );
};

export default PrivacyPolicy;
