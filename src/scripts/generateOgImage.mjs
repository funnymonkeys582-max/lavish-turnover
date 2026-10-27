import sharp from 'sharp';
import path from 'path';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mesh1" cx="20%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#0070f3" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mesh2" cx="80%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#7928ca" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mesh3" cx="50%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#50e3c2" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00dfd8"/>
      <stop offset="50%" stop-color="#007cf0"/>
      <stop offset="100%" stop-color="#7928ca"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="#090d16"/>
  
  <!-- Mesh Blobs -->
  <rect width="1200" height="630" fill="url(#mesh1)"/>
  <rect width="1200" height="630" fill="url(#mesh2)"/>
  <rect width="1200" height="630" fill="url(#mesh3)"/>

  <!-- Subtle Grid Pattern -->
  <g stroke="#ffffff" stroke-width="1" opacity="0.04">
    <line x1="0" y1="105" x2="1200" y2="105"/>
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>

  <!-- Brand Wordmark Top Left -->
  <g transform="translate(80, 80)">
    <rect width="48" height="48" rx="12" fill="#171717" stroke="#ffffff" stroke-opacity="0.2"/>
    <path d="M 12 20 L 12 12 L 20 12" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 36 20 L 36 12 L 28 12" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 12 28 L 12 36 L 20 36" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 36 28 L 36 36 L 28 36" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="5" fill="#0070f3"/>
    
    <text x="64" y="32" font-family="'Geist', -apple-system, sans-serif" font-weight="700" font-size="26" fill="#ffffff" letter-spacing="-0.5px">
      RemoveBlur<tspan fill="#0070f3">Online</tspan>.com
    </text>
  </g>

  <!-- Eyebrow Tag -->
  <g transform="translate(80, 165)">
    <rect width="360" height="34" rx="17" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15"/>
    <circle cx="20" cy="17" r="4" fill="#50e3c2"/>
    <text x="36" y="22" font-family="'Geist Mono', monospace" font-size="13" font-weight="600" fill="#e2e8f0" letter-spacing="0.5px">
      100% FREE • NO LOGIN • NO WATERMARK
    </text>
  </g>

  <!-- Main Headline -->
  <text x="80" y="275" font-family="'Geist', -apple-system, sans-serif" font-weight="800" font-size="58" fill="#ffffff" letter-spacing="-2px">
    Remove Blur From
  </text>
  <text x="80" y="345" font-family="'Geist', -apple-system, sans-serif" font-weight="800" font-size="58" fill="url(#textGrad)" letter-spacing="-2px">
    Image &amp; Photo Online Free
  </text>

  <!-- Subtitle -->
  <text x="80" y="415" font-family="'Geist', -apple-system, sans-serif" font-size="22" fill="#94a3b8" letter-spacing="-0.3px">
    Instant split-screen before/after preview • 100% private client-side AI &amp; edge restoration
  </text>

  <!-- Feature Pills Bottom -->
  <g transform="translate(80, 480)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="230" height="46" rx="10" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="24" y="28" font-family="'Geist', sans-serif" font-weight="600" font-size="15" fill="#ffffff">
      🔒 Zero Cloud Uploads
    </text>

    <!-- Pill 2 -->
    <rect x="250" y="0" width="220" height="46" rx="10" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="274" y="28" font-family="'Geist', sans-serif" font-weight="600" font-size="15" fill="#ffffff">
      ⚡ Millisecond Speed
    </text>

    <!-- Pill 3 -->
    <rect x="490" y="0" width="240" height="46" rx="10" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="514" y="28" font-family="'Geist', sans-serif" font-weight="600" font-size="15" fill="#ffffff">
      💎 Full 4K+ Resolution
    </text>

    <!-- Pill 4 -->
    <rect x="750" y="0" width="230" height="46" rx="10" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="774" y="28" font-family="'Geist', sans-serif" font-weight="600" font-size="15" fill="#ffffff">
      🚫 Zero Watermarks
    </text>
  </g>
</svg>
`;

async function generate() {
  const outputPath = path.resolve('public', 'og-image.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);
  console.log('og-image.png created at', outputPath);
}

generate();
