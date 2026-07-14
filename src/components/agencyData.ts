export const AGENCY_DATA = {
  name: 'ALPHA',
  tagline: 'AI-powered image generation platform. Turn your ideas into visuals instantly.',
  website: 'alpha.zemz.pro',

  contact: {
    email: 'zemz.pro@gmail.com',
  },

  overview: {
    positioning: 'ALPHA is an AI-powered image generation platform that transforms text prompts into stunning visuals in seconds.',
    approach: 'Using state-of-the-art AI models, ALPHA understands your creative intent and generates high-quality images across multiple artistic styles.',
    philosophy: 'Creativity should have no barriers. ALPHA makes visual creation accessible to everyone, from designers to dreamers.',
  },

  services: [
    {
      name: 'Text-to-Image Generation',
      description: 'Describe what you want to see and ALPHA brings it to life.',
      deliverables: [
        'AI-generated images from text prompts',
        'Multiple style options',
        'High-resolution outputs',
        'Real-time generation',
      ],
      pricing: 'Free tier available. Contact for premium access.',
    },
    {
      name: 'Image Gallery',
      description: 'Browse and explore a growing collection of AI-generated artwork.',
      deliverables: [
        'Curated showcase of generated images',
        'Community gallery',
        'Save and share your creations',
        'Export in multiple formats',
      ],
      pricing: 'Free tier available. Contact for premium access.',
    },
  ],

  process: [
    'Describe your vision in a text prompt.',
    'Choose your preferred style, mood, and format.',
    'ALPHA generates your image using advanced AI.',
    'Refine, download, and share your creation.',
  ],

  products: [
    {
      name: 'AI Image Generator',
      status: 'Live',
      description: 'Generate unique images from text descriptions using cutting-edge AI models.',
    },
    {
      name: 'Style Library',
      status: 'Live',
      description: 'Browse a curated collection of artistic styles and presets for your generations.',
    },
    {
      name: 'Image Showcase',
      status: 'Live',
      description: 'Explore a gallery of AI-generated artwork from the ALPHA community.',
    },
  ],

  portfolio: [
    {
      name: 'Neo-Tokyo Cyberpunk',
      description: 'A futuristic neon cyberpunk street scene generated from text prompt, demonstrating ALPHA\'s ability to render complex urban environments with atmospheric lighting.',
      timeframe: 'Instant',
      role: 'AI Generated',
    },
    {
      name: '3D Glass Sculpture',
      description: 'An abstract 3D matte-glass sculpture floating in zero-gravity, showcasing ALPHA\'s material rendering and spatial composition capabilities.',
      timeframe: 'Instant',
      role: 'AI Generated',
    },
    {
      name: 'Treehouse Library',
      description: 'A cozy treehouse library in a mystical glowing forest, highlighting ALPHA\'s environmental storytelling and lighting effects.',
      timeframe: 'Instant',
      role: 'AI Generated',
    },
    {
      name: 'Watercolor Kitten',
      description: 'A realistic watercolor sketch of a sleeping kitten, demonstrating ALPHA\'s ability to emulate traditional artistic mediums.',
      timeframe: 'Instant',
      role: 'AI Generated',
    },
  ],

  faqs: [
    {
      q: 'How does ALPHA generate images?',
      a: 'ALPHA uses advanced AI models that interpret your text description and generate a unique image matching your creative intent.',
    },
    {
      q: 'Is ALPHA free to use?',
      a: 'Yes, ALPHA offers a free tier. Premium plans with higher resolution and faster generation are also available.',
    },
    {
      q: 'What styles can ALPHA generate?',
      a: 'ALPHA supports a wide range of styles including photorealism, watercolor, cyberpunk, abstract 3D, fantasy, minimalism, and many more.',
    },
    {
      q: 'Can I use generated images commercially?',
      a: 'Yes, images generated with ALPHA can be used for personal and commercial projects.',
    },
  ],

  guardrails: {
    pricing: 'If someone asks about pricing, rates, or premium plans, direct them to the contact email for details.',
    outOfScope: 'If someone asks about anything unrelated to ALPHA, image generation, or its features, politely decline to answer.',
  },

  agentPersonality: 'Friendly, creative, concise, and helpful. Never invent facts. Never answer unrelated questions.',
}

export const CHAT_SUGGESTIONS = {
  initial: [
    'How does ALPHA work?',
    'What styles can I use?',
    'Is ALPHA free?',
  ],
  followUp: [
    'How do I generate an image?',
    'What kind of images can I make?',
    'Can I use images commercially?',
    'Tell me about the Style Library',
    'Tell me about the Image Showcase',
    'Show me some example images',
    'What are the premium features?',
    'How do I save my creations?',
    'Can I share my images?',
  ],
}

export const OPENING_MESSAGE =
  `Hi, I'm the ${AGENCY_DATA.name} assistant.\n` +
  `I can help you with image generation, styles, features, and anything about the ${AGENCY_DATA.name} platform.`
