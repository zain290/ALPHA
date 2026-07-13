import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { puter } from '@heyputer/puter.js';
import SEO from '../../components/SEO';
import DotField from '../../components/DotField/DotField';
import ShinyText from '../../components/ShinyText';
import Masonry from '../../components/Masonry';

interface CreateProps {
  onOpenContact?: () => void;
}

interface ImageResult {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: 'generating' | 'done' | 'failed';
  phase?: 'sketching' | 'refining';
}

type GenPhase = 'idle' | 'sketching' | 'refining' | 'done';

const quickPrompts = [
  "A futuristic neon cyberpunk street in Neo-Tokyo, rainy night",
  "An abstract 3D matte-glass sculpture floating in zero-gravity",
  "A cozy treehouse library in a mystical glowing forest",
  "A realistic watercolor sketch of a sleeping kitten"
];

const CustomDropdown = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  
  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 px-4 rounded-3xl bg-[var(--color-create-surface)] hover:bg-[var(--color-create-surface-hover)] transition-all duration-300 shadow-sm cursor-pointer border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
      >
        <span className="text-sm font-medium text-text">{options.find(o => o.value === value)?.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-neutral-500`}>
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 w-48 bg-[var(--color-create-surface)] rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 p-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${value === opt.value ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-black dark:hover:text-white cursor-pointer'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Create: React.FC<CreateProps> = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-image-1-mini');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [savedGallery, setSavedGallery] = useState<{ id: string, img: string, height: number }[]>([]);
  const [genPhase, setGenPhase] = useState<GenPhase>('idle');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        if (data.images) {
          const formatted = data.images.map((item: any) => ({
            id: item.id.toString(),
            img: item.url,
            height: 300 + Math.random() * 200
          }));
          setSavedGallery(formatted);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const dotColors = isDark
    ? { glowColor: 'rgba(255, 255, 255, 0.12)', gradientFrom: 'rgba(255, 255, 255, 0.35)', gradientTo: 'rgba(255, 255, 255, 0.1)' }
    : { glowColor: 'rgba(0, 0, 0, 0.08)', gradientFrom: 'rgba(0, 0, 0, 0.25)', gradientTo: 'rgba(0, 0, 0, 0.08)' };
  
  const [statusIndex, setStatusIndex] = useState(0);
  const statusMessages = [
    'Generating draft...',
    'Sketching concept...',
    'Refining details...',
    'Polishing output...',
  ];

  useEffect(() => {
    if (genPhase !== 'sketching' && genPhase !== 'refining') return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [genPhase]);



  const handleGenerate = async (userPrompt: string) => {
    if (!userPrompt.trim() || genPhase !== 'idle') return;

    const newResultId = Date.now().toString();
    const newResult: ImageResult = {
      id: newResultId,
      prompt: userPrompt,
      status: 'generating',
      phase: 'sketching'
    };

    setResults(prev => [newResult, ...prev]);
    setPrompt('');

    setGenPhase('sketching');
    await new Promise(r => setTimeout(r, 1800));

    setResults(prev => prev.map(r => r.id === newResultId ? { ...r, phase: 'refining' } : r));
    setGenPhase('refining');
    await new Promise(r => setTimeout(r, 1200));

    try {
      let ratioObj = { w: 1024, h: 1024 };
      let sizeStr = '1024x1024';

      if (selectedRatio === '16:9') {
        ratioObj = { w: 1024, h: 576 };
        sizeStr = '1792x1024';
      } else if (selectedRatio === '9:16') {
        ratioObj = { w: 576, h: 1024 };
        sizeStr = '1024x1792';
      }

      const imageElement = await puter.ai.txt2img(userPrompt, { 
        model: selectedModel, 
        ratio: ratioObj,
        aspect_ratio: selectedRatio,
        size: sizeStr
      } as any);
      const imgUrl = imageElement?.src || '';

      if (imgUrl) {
        setResults(prev => prev.map(r => r.id === newResultId ? {
          ...r,
          imageUrl: imgUrl,
          status: 'done'
        } : r));
      } else {
        setResults(prev => prev.map(r => r.id === newResultId ? {
          ...r,
          status: 'failed'
        } : r));
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setResults(prev => prev.map(r => r.id === newResultId ? {
        ...r,
        status: 'failed'
      } : r));
    } finally {
      setGenPhase('done');
      // allow immediate next generation
      setTimeout(() => setGenPhase('idle'), 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(prompt);
  };

  const handleSave = async (imageUrl: string, promptText: string) => {
    try {
      console.log('[handleSave] Sending imageUrl to server:', imageUrl.slice(0, 80));

      // Send the URL to the server — it will download the image server-side
      // This avoids CORS issues when fetching from external AI image hosts
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, imageUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(`Server error ${res.status}: ${err.error || err.detail || res.statusText}`);
      }

      const data = await res.json();
      if (data.image) {
        setSavedGallery(prev => [{
          id: data.image.id.toString(),
          img: data.image.url,
          height: 300 + Math.random() * 200
        }, ...prev]);
        console.log('[handleSave] Saved successfully:', data.image.url);
      }
    } catch (e) {
      console.error('[handleSave] Failed:', e);
      alert(`Save failed: ${(e as Error).message}`);
    }
  };

  const onSaveClick = async (id: string, imageUrl: string, promptText: string) => {
    await handleSave(imageUrl, promptText);
    setSavedIds(prev => ({ ...prev, [id]: true }));
  };

  return (
    <motion.div
      className="bg-background pt-24 min-h-screen w-full flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <SEO title="Create AI Images" description="Generate stunning AI images from text prompts. Use cutting-edge models to bring your creative vision to life in seconds." canonicalUrl="https://alpha.pro/create" />

      {/* Main Content Area */}
      <div 
        className="w-full max-w-4xl px-4 pt-12 flex flex-col items-center transition-all duration-500"
        style={{ paddingBottom: (results.length > 0 || genPhase !== 'idle') ? '200px' : '48px' }}
      >
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-[44px] font-medium text-text mb-4 tracking-tight" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Create with Alpha
          </h1>
        </div>

        {/* Results Gallery — shown ABOVE the input */}
        {(results.length > 0 || genPhase !== 'idle') && (
          <div className="w-full flex flex-col gap-12 mb-8">
            <AnimatePresence>
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full"
                >
                  <div className="mb-3 px-2">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{result.prompt}</p>
                  </div>

                  {result.status === 'generating' && (
                    <div className="w-1/2 flex flex-col">
                      <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                        <DotField
                          dotRadius={1.5}
                          dotSpacing={15}
                          bulgeOnly
                          bulgeStrength={60}
                          cursorRadius={400}
                          glowColor={dotColors.glowColor}
                          gradientFrom={dotColors.gradientFrom}
                          gradientTo={dotColors.gradientTo}
                          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                        />
                      </div>
                      <div className="mt-3 px-1 text-left w-full">
                        <ShinyText text={statusMessages[statusIndex]} />
                      </div>
                    </div>
                  )}

                  {result.status === 'done' && result.imageUrl && (
                    <div className="flex flex-col w-1/2">
                      {/* Image */}
                      <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src={result.imageUrl}
                          alt={result.prompt}
                          className="w-full h-auto object-cover"
                        />
                      </div>

                      {/* Save Button — always visible below the image */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex justify-end"
                      >
                        <button
                          onClick={() => onSaveClick(result.id, result.imageUrl!, result.prompt)}
                          disabled={!!savedIds[result.id]}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                            savedIds[result.id]
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
                          }`}
                        >
                          {savedIds[result.id] ? (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Saved to Gallery
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Save to Gallery
                            </>
                          )}
                        </button>
                      </motion.div>
                    </div>
                  )}

                  {result.status === 'failed' && (
                    <div className="w-full p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                      <p className="font-medium">Generation failed.</p>
                      <p className="text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        )}

        {/* Gemini Style Input Box — now at the BOTTOM */}
        <div className={`transition-all duration-500 w-full flex justify-center ${
          results.length > 0 || genPhase !== 'idle'
            ? 'fixed bottom-6 left-0 right-0 z-40 px-4'
            : 'relative'
        }`}>
          <div className={`w-full ${results.length > 0 || genPhase !== 'idle' ? 'md:max-w-[35%] max-w-[90%] shadow-2xl' : ''} bg-[var(--color-create-surface)] rounded-3xl border border-transparent shadow-sm hover:border-neutral-300 focus-within:border-black focus-within:rounded-3xl dark:hover:border-neutral-600 dark:focus-within:border-white dark:focus-within:rounded-3xl transition-all duration-300 relative overflow-hidden`}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Describe the image you want to create"
              className="w-full bg-transparent resize-none outline-none text-text p-6 min-h-[60px] max-h-[250px] overflow-y-auto text-lg font-normal placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              style={{ overflowY: 'auto' }}
              disabled={genPhase === 'sketching' || genPhase === 'refining'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate(prompt);
                }
              }}
            />
            <div className="flex justify-between items-center px-4 pb-4 mt-2">
              <div className="flex items-center gap-2 relative">
                <CustomDropdown
                  value={selectedModel}
                  onChange={setSelectedModel}
                  options={[
                    { value: 'gpt-image-1-mini', label: 'OpenAI (Fast)' },
                    { value: 'gemini', label: 'Gemini' },
                    { value: 'grok-imagine-image', label: 'xAI (Grok)' }
                  ]}
                />
                <CustomDropdown
                  value={selectedRatio}
                  onChange={setSelectedRatio}
                  options={[
                    { value: '1:1', label: 'Square (1:1)' },
                    { value: '16:9', label: 'Landscape (16:9)' },
                    { value: '9:16', label: 'Portrait (9:16)' }
                  ]}
                />
              </div>
              <button
                type="submit"
                disabled={genPhase === 'sketching' || genPhase === 'refining' || !prompt.trim()}
                className="bg-black text-white hover:bg-neutral-800 disabled:bg-black disabled:opacity-30 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:disabled:bg-white dark:disabled:opacity-30 rounded-full px-6 py-2.5 font-medium text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                Create
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 21L10.5 14.5L4 13.5L10.5 12.5L11.5 6L12.5 12.5L19 13.5L12.5 14.5L11.5 21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
          </div>
        </div>

        {/* Suggestion Chips — shown BELOW the input when no results yet */}
        {results.length === 0 && genPhase === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-8"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-4 ml-2">Not sure what to create? Try these:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerate(qp)}
                  className="group text-left p-4 rounded-3xl bg-[var(--color-create-surface)] hover:bg-[var(--color-create-surface-hover)] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <p className="text-base text-text leading-relaxed font-medium">{qp}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Masonry Saved Gallery */}
        {savedGallery.length > 0 && (
          <div className="w-full mt-16 flex flex-col items-center">
            <h2 className="text-2xl font-medium text-text mb-8">Community Creations</h2>
            <div className="w-full relative">
              <Masonry items={savedGallery} />
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default Create;