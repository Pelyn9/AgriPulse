export function createLeafThumbnail(predictionHint = 'leaf') {
  const hue =
    predictionHint === 'Healthy'
      ? 138
      : predictionHint.includes('Nitrogen')
        ? 68
        : predictionHint.includes('Phosphorus')
          ? 152
          : 42;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="hsl(${hue}, 62%, 82%)"/>
          <stop offset="1" stop-color="hsl(${hue + 40}, 72%, 38%)"/>
        </linearGradient>
        <radialGradient id="dew" cx="40%" cy="25%" r="50%">
          <stop stop-color="rgba(255,255,255,.7)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="320" height="240" rx="34" fill="url(#bg)"/>
      <path d="M171 43c-61 31-93 77-96 138-1 24 14 42 37 47 48 11 105-26 123-81 16-49-3-82-64-104Z" fill="rgba(240,253,244,.92)"/>
      <path d="M109 207c35-64 68-108 108-145" fill="none" stroke="rgba(21,128,61,.95)" stroke-width="12" stroke-linecap="round"/>
      <path d="M138 145c31 4 58-4 81-25" fill="none" stroke="rgba(21,128,61,.65)" stroke-width="8" stroke-linecap="round"/>
      <path d="M119 178c24 3 45-3 63-18" fill="none" stroke="rgba(21,128,61,.62)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="99" cy="56" r="82" fill="url(#dew)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}
