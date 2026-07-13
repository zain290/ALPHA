// ============================================================
// Batch Image Creator — Paste this into browser DevTools (F12)
// on the Create page (http://localhost:5173/create)
// ============================================================
// It will:
//   1. Generate 20 unique images via puter.ai.txt2img()
//   2. Save each to the gallery via POST /api/images
//   3. Stop on first error or when 20 are done
// ============================================================

const PROMPTS = [
  "A futuristic neon-lit cyberpunk cityscape at night with flying cars and holographic billboards",
  "A serene fantasy landscape with floating islands, waterfalls cascading into clouds, and ancient ruins",
  "A close-up portrait of a wise old wizard with a long white beard, glowing blue eyes, and starry robes",
  "Abstract fluid art with vibrant colors of gold, magenta, and cyan swirling in organic patterns",
  "A misty mountain sunrise over a pine forest with a calm lake reflecting the golden sky",
  "An underwater coral reef teeming with colorful tropical fish and rays of sunlight piercing through",
  "A steampunk airship floating above Victorian-era London with brass gears and hot air balloons",
  "A delicious gourmet burger with melting cheese, crispy bacon, and fresh vegetables on a wooden table",
  "A breathtaking view of the Andromeda galaxy with swirling nebulas and distant stars in deep space",
  "A minimalist Japanese temple surrounded by cherry blossom trees in full bloom with a red torii gate",
  "A majestic white wolf standing on a rocky cliff under a full moon with aurora borealis in the sky",
  "A cyberpunk hacker in a dimly lit room filled with holographic screens and glowing code rain",
  "A watercolor painting of a cozy Parisian café on a rainy evening with warm glowing windows",
  "A 3D render of a futuristic sports car with sleek curves and neon underglow on a wet city street",
  "A surreal dreamscape with melting clocks draped over tree branches in a desert landscape",
  "A vintage photograph of a 1950s diner with red neon signs, checkered floor, and classic cars outside",
  "A minimalist geometric composition with pastel gradients, clean lines, and soft shadows",
  "A glowing neon sign reading 'CREATE' in a dark alley with reflections on wet pavement",
  "A magical forest with giant glowing mushrooms, fireflies, and a small wooden bridge over a stream",
  "A chromatic geometric abstract with iridescent triangles, glowing edges, and deep purple shadows"
];

(async function batchCreateImages() {
  console.log('=== BATCH IMAGE CREATION STARTED ===');
  console.log(`Target: ${PROMPTS.length} images`);
  console.log('');

  let count = 0;

  for (const prompt of PROMPTS) {
    count++;
    const shortPrompt = prompt.length > 60 ? prompt.substring(0, 57) + '...' : prompt;

    try {
      console.log(`[${count}/${PROMPTS.length}] Generating: "${shortPrompt}"`);

      const img = await puter.ai.txt2img(prompt, {
        model: 'gpt-image-1-mini',
        ratio: { w: 1024, h: 1024 },
        aspect_ratio: '1:1',
        size: '1024x1024'
      });

      const imageUrl = img?.src || '';
      if (!imageUrl) throw new Error('No image URL returned from Puter');

      console.log(`[${count}/${PROMPTS.length}] Saving to gallery...`);

      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageUrl })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Server error ${res.status}: ${err.error || err.detail || res.statusText}`);
      }

      const data = await res.json();
      console.log(`[${count}/${PROMPTS.length}] ✓ Saved (ID: ${data.image.id})`);

    } catch (err) {
      console.error(`[${count}/${PROMPTS.length}] ✗ FAILED: ${err.message}`);
      console.error('Stopping batch due to error.');
      console.log(`\n=== Batch incomplete: ${count - 1} images created before error ===`);
      return;
    }
  }

  console.log('');
  console.log(`=== BATCH COMPLETE: ${count} images created and saved ===`);
  console.log('Refresh the page to see them in the Community Creations gallery.');
})();
