/**
 * Remove Blur Online - High-Performance Client-Side Image Deblurring & Sharpening Engine
 * 100% Free, 100% Client-Side, Zero Server Uploads.
 */

export interface DeblurOptions {
  amount: number;       // 0.0 - 3.0 (sharpening multiplier)
  radius: number;       // 1 - 5 (blur kernel radius in pixels)
  threshold: number;    // 0 - 25 (noise suppression threshold)
  contrast?: number;    // 0.8 - 1.4 (contrast adjustment)
  mode?: 'auto' | 'portrait' | 'document' | 'motion';
}

/**
 * Fast separable box blur (simulates Gaussian blur when run in 3 passes or single wide pass)
 */
function boxBlurHorizontal(
  src: Uint8ClampedArray,
  dest: Uint8ClampedArray,
  width: number,
  height: number,
  r: number
) {
  const iarr = 1 / (r + r + 1);
  for (let i = 0; i < height; i++) {
    const rowOffset = i * width * 4;
    let ti = rowOffset;
    let li = rowOffset;
    let ri = rowOffset + r * 4;

    const fvR = src[ti];
    const fvG = src[ti + 1];
    const fvB = src[ti + 2];

    const lvR = src[rowOffset + (width - 1) * 4];
    const lvG = src[rowOffset + (width - 1) * 4 + 1];
    const lvB = src[rowOffset + (width - 1) * 4 + 2];

    let valR = (r + 1) * fvR;
    let valG = (r + 1) * fvG;
    let valB = (r + 1) * fvB;

    for (let j = 0; j < r; j++) {
      valR += src[rowOffset + j * 4];
      valG += src[rowOffset + j * 4 + 1];
      valB += src[rowOffset + j * 4 + 2];
    }

    for (let j = 0; j <= r; j++) {
      valR += src[ri] - fvR;
      valG += src[ri + 1] - fvG;
      valB += src[ri + 2] - fvB;
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3]; // Preserve alpha
      ri += 4;
      ti += 4;
    }

    for (let j = r + 1; j < width - r; j++) {
      valR += src[ri] - src[li];
      valG += src[ri + 1] - src[li + 1];
      valB += src[ri + 2] - src[li + 2];
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3];
      ri += 4;
      li += 4;
      ti += 4;
    }

    for (let j = width - r; j < width; j++) {
      valR += lvR - src[li];
      valG += lvG - src[li + 1];
      valB += lvB - src[li + 2];
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3];
      li += 4;
      ti += 4;
    }
  }
}

function boxBlurTotal(
  src: Uint8ClampedArray,
  dest: Uint8ClampedArray,
  width: number,
  height: number,
  r: number
) {
  const iarr = 1 / (r + r + 1);
  for (let i = 0; i < width; i++) {
    let ti = i * 4;
    let li = ti;
    let ri = ti + r * width * 4;

    const fvR = src[ti];
    const fvG = src[ti + 1];
    const fvB = src[ti + 2];

    const lvOffset = i * 4 + (height - 1) * width * 4;
    const lvR = src[lvOffset];
    const lvG = src[lvOffset + 1];
    const lvB = src[lvOffset + 2];

    let valR = (r + 1) * fvR;
    let valG = (r + 1) * fvG;
    let valB = (r + 1) * fvB;

    for (let j = 0; j < r; j++) {
      const idx = i * 4 + j * width * 4;
      valR += src[idx];
      valG += src[idx + 1];
      valB += src[idx + 2];
    }

    for (let j = 0; j <= r; j++) {
      valR += src[ri] - fvR;
      valG += src[ri + 1] - fvG;
      valB += src[ri + 2] - fvB;
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3];
      ri += width * 4;
      ti += width * 4;
    }

    for (let j = r + 1; j < height - r; j++) {
      valR += src[ri] - src[li];
      valG += src[ri + 1] - src[li + 1];
      valB += src[ri + 2] - src[li + 2];
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3];
      li += width * 4;
      ri += width * 4;
      ti += width * 4;
    }

    for (let j = height - r; j < height; j++) {
      valR += lvR - src[li];
      valG += lvG - src[li + 1];
      valB += lvB - src[li + 2];
      dest[ti] = Math.round(valR * iarr);
      dest[ti + 1] = Math.round(valG * iarr);
      dest[ti + 2] = Math.round(valB * iarr);
      dest[ti + 3] = src[ti + 3];
      li += width * 4;
      ti += width * 4;
    }
  }
}

/**
 * Executes high-performance 2D Unsharp Mask + Luminance Adaptive Sharpening
 */
export function processUnblur(
  imageData: ImageData,
  options: DeblurOptions
): ImageData {
  const { width, height } = imageData;
  const src = imageData.data;
  const len = src.length;

  const radius = Math.max(1, Math.min(5, Math.round(options.radius || 2)));
  const amount = options.amount !== undefined ? options.amount : 1.4;
  const threshold = options.threshold !== undefined ? options.threshold : 3;
  const contrast = options.contrast !== undefined ? options.contrast : 1.0;

  // 1. Generate smoothed low-frequency image
  const temp = new Uint8ClampedArray(len);
  const blurred = new Uint8ClampedArray(len);

  boxBlurHorizontal(src, temp, width, height, radius);
  boxBlurTotal(temp, blurred, width, height, radius);

  // 2. Output buffer
  const outputData = new ImageData(width, height);
  const out = outputData.data;

  // Document mode adjustments
  const isDoc = options.mode === 'document';
  const isPortrait = options.mode === 'portrait';

  // 3. Process each pixel with Luminance Sharpening & Thresholding
  for (let i = 0; i < len; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    const a = src[i + 3];

    const br = blurred[i];
    const bg = blurred[i + 1];
    const bb = blurred[i + 2];

    // Compute luminance (ITU-R BT.601)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const lumBlur = 0.299 * br + 0.587 * bg + 0.114 * bb;

    // High frequency delta
    const diff = lum - lumBlur;

    // Noise suppression threshold
    let sharpDiff = 0;
    const absDiff = Math.abs(diff);

    if (absDiff > threshold) {
      // Soft transition past threshold to prevent noise banding
      const ramp = Math.min(1, (absDiff - threshold) / (threshold * 1.5 + 1));
      sharpDiff = diff * amount * ramp;
    }

    // Portrait mode: Protect midtone skin from harsh grain
    if (isPortrait && lum > 110 && lum < 210 && absDiff < 14) {
      sharpDiff *= 0.65;
    }

    // Document mode: Expand local contrast around edges
    if (isDoc) {
      if (lum < 160) {
        sharpDiff *= 1.25; // Enhance dark characters
      }
    }

    // Calculate sharpened RGB with luminance delta
    let nr = r + sharpDiff;
    let ng = g + sharpDiff;
    let nb = b + sharpDiff;

    // Optional Contrast enhancement
    if (contrast !== 1.0) {
      nr = (nr - 128) * contrast + 128;
      ng = (ng - 128) * contrast + 128;
      nb = (nb - 128) * contrast + 128;
    }

    // Clamp values to [0, 255]
    out[i] = nr < 0 ? 0 : nr > 255 ? 255 : (nr | 0);
    out[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : (ng | 0);
    out[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : (nb | 0);
    out[i + 3] = a;
  }

  return outputData;
}

/**
 * Contrast Adaptive Sharpening (CAS-like pass for micro-contrast enhancement)
 */
export function applyMicroContrast(
  imageData: ImageData,
  strength: number = 0.4
): ImageData {
  const { width, height } = imageData;
  const src = imageData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const up = ((y - 1) * width + x) * 4;
      const down = ((y + 1) * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;

      for (let c = 0; c < 3; c++) {
        const val = src[idx + c];
        const vUp = src[up + c];
        const vDown = src[down + c];
        const vLeft = src[left + c];
        const vRight = src[right + c];

        const minV = Math.min(val, vUp, vDown, vLeft, vRight);
        const maxV = Math.max(val, vUp, vDown, vLeft, vRight);

        // Adaptive peak limiter
        const delta = 4 * val - (vUp + vDown + vLeft + vRight);
        let res = val + delta * strength * 0.25;

        // Clamp to avoid haloing
        res = Math.max(minV, Math.min(maxV, res));
        dst[idx + c] = res | 0;
      }
      dst[idx + 3] = src[idx + 3];
    }
  }

  return output;
}
