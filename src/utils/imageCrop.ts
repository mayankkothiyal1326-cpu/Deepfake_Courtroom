export interface CropRect {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export function isSupportedImageFile(file: { type?: string; name?: string }): boolean {
  const mime = (file.type || '').toLowerCase();
  if (ACCEPTED_IMAGE_TYPES.includes(mime)) return true;
  const name = (file.name || '').toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(name);
}

/**
 * Computes a distortion-free square source crop rectangle from an image of any aspect ratio.
 * offsetX and offsetY are normalized in [-1, 1] (0 = centered).
 * zoom is in [1, 3] (1 = fit shortest side cleanly into square).
 */
export function computeCoverCropRect(
  naturalWidth: number,
  naturalHeight: number,
  zoom: number,
  offsetX: number,
  offsetY: number
): CropRect {
  const safeW = Math.max(1, naturalWidth);
  const safeH = Math.max(1, naturalHeight);
  const safeZoom = Math.min(3, Math.max(1, zoom));
  const clampedX = Math.min(1, Math.max(-1, offsetX));
  const clampedY = Math.min(1, Math.max(-1, offsetY));

  const baseSquare = Math.min(safeW, safeH);
  const cropSize = baseSquare / safeZoom;

  const maxPanX = Math.max(0, (safeW - cropSize) / 2);
  const maxPanY = Math.max(0, (safeH - cropSize) / 2);

  // Moving the image right (+offsetX) shifts the source window left (-dx)
  const centerX = safeW / 2 - clampedX * maxPanX;
  const centerY = safeH / 2 - clampedY * maxPanY;

  const sx = Math.max(0, Math.min(safeW - cropSize, centerX - cropSize / 2));
  const sy = Math.max(0, Math.min(safeH - cropSize, centerY - cropSize / 2));

  return {
    sx,
    sy,
    sWidth: cropSize,
    sHeight: cropSize,
  };
}

/**
 * Renders the selected square crop region to a compact 256x256 local data URL
 * so it displays crisply in circular avatars and fits comfortably in localStorage.
 */
export function exportCroppedAvatarDataUrl(
  image: HTMLImageElement,
  zoom: number,
  offsetX: number,
  offsetY: number,
  outputSize = 256
): string {
  const rect = computeCoverCropRect(
    image.naturalWidth,
    image.naturalHeight,
    zoom,
    offsetX,
    offsetY
  );
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize image cropper canvas.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    rect.sx,
    rect.sy,
    rect.sWidth,
    rect.sHeight,
    0,
    0,
    outputSize,
    outputSize
  );

  return canvas.toDataURL('image/jpeg', 0.86);
}
