import React, { useEffect, useState } from 'react';
import SplitText from '../../components/SplitText';
import ScrollReveal from '../../components/ScrollReveal';
import Antigravity from '../../components/Antigravity';
import { getPage } from '../../controllers/apiController';
import SEO from '../../components/SEO';
import './TermsOfService.css';

const DEFAULT_PAGE = {
  hero_line1: 'Terms of Service',
  hero_line2: 'Our Agreement',
  sections: [
    {
      label: '01. Acceptance',
      title: 'Agreement to Terms',
      paragraphs: [
        'By accessing or using the ZEMZ website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.',
      ],
    },
    {
      label: '02. Intellectual Property',
      title: 'Ownership & Rights',
      paragraphs: [
        'The Website and its original content, features, and functionality are owned by ZEMZ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
        'Any materials, designs, or code presented in our portfolio remain the property of ZEMZ or our respective clients as indicated.',
      ],
    },
    {
      label: '03. Use License',
      title: 'Limited Usage',
      paragraphs: [
        'Permission is granted to temporarily download one copy of the materials on ZEMZ\'s website for personal, non-commercial transitory viewing only.',
      ],
      bullets: [
        'Do not modify or copy the materials.',
        'Do not use the materials for any commercial purpose.',
        'Do not attempt to decompile or reverse engineer any software contained on the website.',
        'Do not remove any copyright or other proprietary notations from the materials.',
      ],
    },
    {
      label: '04. Disclaimer',
      title: 'No Warranties',
      paragraphs: [
        'The materials on ZEMZ\'s website are provided on an "as is" basis. ZEMZ makes no warranties, expressed or implied, and disclaims all other warranties including implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement.',
      ],
    },
    {
      label: '05. Governing Law',
      title: 'Jurisdiction',
      paragraphs: [
        'These terms and conditions are governed by and construed in accordance with the applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.',
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

const TermsOfService: React.FC = () => {
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    getPage('terms')
      .then((page) => {
        setPageData({
          ...DEFAULT_PAGE,
          ...page.content,
          sections: page.content?.sections || DEFAULT_PAGE.sections,
        });
        setUpdatedAt(page.updated_at || null);
      })
      .catch((err) => {
        console.error('Terms page load error:', err);
      });
  }, []);

  return (
    <div className="terms-container">
      <SEO 
        title="ZEMZ | Terms of Service" 
        description={`${pageData.hero_line1} - ${pageData.hero_line2}`} 
        canonicalUrl="https://zemz.pro/terms" 
      />
      <section className="terms-hero-section">
        <div className="antigravity-wrapper" style={{ opacity: 0.8 }}>
          <Antigravity color="var(--color-text)" count={60} magnetRadius={12} fieldStrength={10} particleSize={1.2} autoAnimate={true} />
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

      <section className="terms-content-section">
        {pageData.sections.map((section, index) => {
          // Split "01. Acceptance" into "01." and " Acceptance"
          const labelParts = (section.label || '').split(' ');
          const labelNum = labelParts[0];
          const labelText = labelParts.slice(1).join(' ');

          return (
            <div key={`${section.title}-${index}`} className="terms-block">
              <ScrollReveal y={20} delay={0.1}>
                <span className="terms-label">
                  <span className="terms-label-num">{labelNum}</span>
                  <span className="terms-label-text">{labelText}</span>
                </span>
                <h2>{section.title}</h2>
                <div className="terms-text">
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
          );
        })}

        <div className="last-updated">
          <p>Last updated: {formatUpdatedAt(updatedAt)}</p>
        </div>
      </section>
      <div className="pb-20 md:pb-40"></div>
    </div>
  );
};

export default TermsOfService;
