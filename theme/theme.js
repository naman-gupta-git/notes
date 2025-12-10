function setColor(input) {
  const hex = input.value;
  localStorage.setItem('base-color', hex);

  // Convert hex to RGB
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  // Convert sRGB to linear RGB
  function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);

  // Convert linear RGB to LMS
  const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin;
  const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin;
  const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin;

  // Convert LMS to Oklab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  // Now call your actual logic
  applyColors(L * 100, C, H);
}

function applyColors(L, C, H) {
  function oklch(l, c, h) {
    return `oklch(${l.toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(3)})`;
  }

  const getTextColor = (baseL) => ({
    main: baseL > 70 ? oklch(10, 0, 0) : oklch(95, 0, 0),
    muted: baseL > 70 ? oklch(35, 0, 0) : oklch(75, 0, 0)
  });

  // Core values
  const bgDark = oklch(L, C, H);
  const bg = oklch(Math.min(L * 1.1, 100), C, H);
  const surface = oklch(Math.min(L * 1.3, 100), C * 0.65, H);
  const border = oklch(Math.min(L * 1.3, 100), C * 2, H);

  // Accent
  const accentHue = (H + 30) % 360;
  const accent = oklch(L * 0.8, C * 1.5, accentHue);
  const accentMuted = oklch(L * 0.9, C, accentHue);

  // Set base colors
  document.body.style.setProperty('--bg-dark', bgDark);
  document.body.style.setProperty('--bg', bg);
  document.body.style.setProperty('--surface', surface);
  document.body.style.setProperty('--border', border);
  document.body.style.setProperty('--accent', accent);
  document.body.style.setProperty('--accent-muted', accentMuted);

  // Text on backgrounds
  const textBgDark = getTextColor(L);
  const textBg = getTextColor(Math.min(L * 1.5, 100));
  const textSurface = getTextColor(Math.min(L * 1.15, 100));
  const textAccent = getTextColor(L * 0.8);
  const textAccentMuted = getTextColor(L * 0.9);

  document.body.style.setProperty('--text-on-bg-dark', textBgDark.main);
  document.body.style.setProperty('--text-muted-on-bg-dark', textBgDark.muted);

  document.body.style.setProperty('--text-on-bg', textBg.main);
  document.body.style.setProperty('--text-muted-on-bg', textBg.muted);

  document.body.style.setProperty('--text-on-surface', textSurface.main);
  document.body.style.setProperty('--text-muted-on-surface', textSurface.muted);

  document.body.style.setProperty('--text-on-accent', textAccent.main);
  document.body.style.setProperty('--text-muted-on-accent', textAccent.muted);

  document.body.style.setProperty('--text-on-accent-muted', textAccentMuted.main);
  document.body.style.setProperty('--text-muted-on-accent-muted', textAccentMuted.muted);

  // Semantic states (static lightness, but text contrast should be handled)
  const semStates = {
    '--success': oklch(70, 0.15, 150),
    '--warning': oklch(85, 0.15, 90),
    '--error': oklch(60, 0.2, 30)
  };

  for (const [varName, color] of Object.entries(semStates)) {
    document.body.style.setProperty(varName, color);

    const lightness = parseFloat(color.match(/oklch\(([\d.]+)%/)[1]);
    const text = getTextColor(lightness);

    document.body.style.setProperty(`--text-on-${varName.slice(2)}`, text.main);
    document.body.style.setProperty(`--text-muted-on-${varName.slice(2)}`, text.muted);
  }
}


const selector = document.getElementById('base-color-input');
if (selector) {
  selector.addEventListener('input', (e) => setColor(e.target));
} else {
  console.error("Color input element not found!");
}

document.addEventListener('DOMContentLoaded', () => {
  const savedColor = localStorage.getItem('base-color');
  if (savedColor) {
    const input = document.getElementById('base-color-input');
    input.value = savedColor;
    setColor(input); // Trigger the theme logic again
  }
});