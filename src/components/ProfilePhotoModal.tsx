import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Move, Trash2, Upload, X, ZoomIn } from 'lucide-react';
import { AvatarId } from '../types/courtroom';
import {
  computeCoverCropRect,
  exportCroppedAvatarDataUrl,
  isSupportedImageFile,
} from '../utils/imageCrop';
import { JudgeAvatar } from './JudgeAvatar';

interface ProfilePhotoModalProps {
  open: boolean;
  currentPhoto: string | null;
  fallbackAvatar: AvatarId;
  judgeName?: string;
  onSavePhoto: (dataUrl: string | null) => void;
  onClose: () => void;
}

const PREVIEW_SIZE = 200;

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  open,
  currentPhoto,
  fallbackAvatar,
  judgeName = 'Judge',
  onSavePhoto,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);

  const [draftSourceUrl, setDraftSourceUrl] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setDraftSourceUrl(null);
    setImageReady(false);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setError('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Load selected file into an HTMLImageElement for live circular crop preview
  useEffect(() => {
    if (!draftSourceUrl) {
      loadedImageRef.current = null;
      setImageReady(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      loadedImageRef.current = img;
      setImageReady(true);
      setError('');
    };
    img.onerror = () => {
      loadedImageRef.current = null;
      setImageReady(false);
      setError('Could not read that image. Please choose a JPG, PNG, or WEBP photo.');
    };
    img.src = draftSourceUrl;
  }, [draftSourceUrl]);

  // Draw crisp live circular preview whenever zoom or pan changes
  useEffect(() => {
    if (!imageReady || !loadedImageRef.current || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = loadedImageRef.current;
    const rect = computeCoverCropRect(
      img.naturalWidth,
      img.naturalHeight,
      zoom,
      offsetX,
      offsetY
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      img,
      rect.sx,
      rect.sy,
      rect.sWidth,
      rect.sHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [imageReady, zoom, offsetX, offsetY]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset value so picking the same photo again triggers onChange
    e.target.value = '';
    if (!file) return;

    if (!isSupportedImageFile(file)) {
      setError('Please select a JPG, JPEG, PNG, or WEBP image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('That image is larger than 15 MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
        setDraftSourceUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Could not open that file from your device.');
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imageReady) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragStartRef.current) return;
    const dx = (e.clientX - dragStartRef.current.clientX) / (PREVIEW_SIZE / 2);
    const dy = (e.clientY - dragStartRef.current.clientY) / (PREVIEW_SIZE / 2);
    setOffsetX(Math.max(-1, Math.min(1, dragStartRef.current.startOffsetX + dx)));
    setOffsetY(Math.max(-1, Math.min(1, dragStartRef.current.startOffsetY + dy)));
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  const handleSave = () => {
    if (!loadedImageRef.current) return;
    try {
      const cropped = exportCroppedAvatarDataUrl(
        loadedImageRef.current,
        zoom,
        offsetX,
        offsetY,
        256
      );
      onSavePhoto(cropped);
      onClose();
    } catch {
      setError('Could not save photo. Please try a different image.');
    }
  };

  const handleRemove = () => {
    onSavePhoto(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 space-y-5 shadow-2xl my-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Camera size={20} className="text-[#E5B85C]" />
            <h2
              id="photo-modal-title"
              className="font-display text-lg font-semibold text-[#F1F5F9]"
            >
              Judge Profile Photo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo dialog"
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1C2632]"
          >
            <X size={19} />
          </button>
        </div>

        {/* Native Device Gallery / File Picker Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          aria-label="Select profile photo from device"
          className="hidden"
        />

        {/* Circular Preview Area */}
        <div className="flex flex-col items-center space-y-3">
          {imageReady ? (
            <>
              <div className="relative rounded-full overflow-hidden border-2 border-[#E5B85C] bg-[#0B0F14] w-[200px] h-[200px] touch-none select-none">
                <canvas
                  ref={previewCanvasRef}
                  width={PREVIEW_SIZE}
                  height={PREVIEW_SIZE}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                />
              </div>
              <p className="text-xs text-[#B7C2D0] inline-flex items-center gap-1.5">
                <Move size={13} className="text-[#E5B85C]" />
                <span>Drag photo or use sliders below to adjust framing</span>
              </p>
            </>
          ) : (
            <div className="py-3 flex flex-col items-center space-y-3">
              <JudgeAvatar
                avatar={fallbackAvatar}
                photoDataUrl={currentPhoto}
                alt={`${judgeName} current profile photo`}
                size="lg"
                className="w-28 h-28"
              />
              <p className="text-xs text-[#94A3B8] text-center max-w-xs">
                {currentPhoto
                  ? 'Your current photo is saved privately on this device.'
                  : 'Choose a photo from your gallery or device. Saved locally on your device only.'}
              </p>
            </div>
          )}
        </div>

        {/* Simple Crop & Reposition Controls */}
        {imageReady && (
          <div className="rounded-xl bg-[#111720] border border-[#303B49] p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-[#B7C2D0] mb-1">
                <label htmlFor="avatar-zoom-slider" className="inline-flex items-center gap-1.5">
                  <ZoomIn size={14} className="text-[#E5B85C]" />
                  <span>Zoom</span>
                </label>
                <span className="font-mono tabular-nums">{zoom.toFixed(1)}x</span>
              </div>
              <input
                id="avatar-zoom-slider"
                type="range"
                min={1}
                max={2.5}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#E5B85C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="avatar-pan-x"
                  className="block text-xs text-[#B7C2D0] mb-1"
                >
                  Left / Right
                </label>
                <input
                  id="avatar-pan-x"
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full accent-[#E5B85C]"
                />
              </div>
              <div>
                <label
                  htmlFor="avatar-pan-y"
                  className="block text-xs text-[#B7C2D0] mb-1"
                >
                  Up / Down
                </label>
                <input
                  id="avatar-pan-y"
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-[#E5B85C]"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="text-xs font-medium text-[#E05252]">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors"
          >
            <Upload size={16} className="text-[#E5B85C]" />
            <span>
              {imageReady || currentPhoto ? 'Choose Different Photo' : 'Choose Photo from Device'}
            </span>
          </button>

          {imageReady && (
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-[#4CC38A] text-[#0B0F14] text-sm font-semibold hover:bg-[#3fb17b] transition-colors"
            >
              <Check size={17} />
              <span>Save Profile Photo</span>
            </button>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            {currentPhoto ? (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-xs font-semibold text-[#E05252] hover:bg-[#E05252] hover:text-white transition-colors"
              >
                <Trash2 size={14} />
                <span>Remove Photo</span>
              </button>
            ) : (
              <span className="text-[11px] text-[#94A3B8]">JPG, PNG, WEBP · Stored locally</span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 rounded-xl border border-[#303B49] text-xs font-medium text-[#B7C2D0] hover:text-[#F1F5F9]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
