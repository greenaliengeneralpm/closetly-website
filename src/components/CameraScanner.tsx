import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, AlertCircle, ArrowRight, X, Edit3, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { compressImage } from '../utils/imageUtils';

interface CameraScannerProps {
  onImageSelected: (imageSrc: string) => void;
  selectedImage: string | null;
  onClearImage: () => void;
  onProceedToQuestions: () => void;
  isDetecting: boolean;
  detectedBrand?: string;
  detectedItemName?: string;
  visibleText?: string;
  onBrandChange?: (newBrand: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onImageSelected,
  selectedImage,
  onClearImage,
  onProceedToQuestions,
  isDetecting,
  detectedBrand,
  detectedItemName,
  visibleText,
  onBrandChange,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isEditingBrand, setIsEditingBrand] = useState<boolean>(false);
  const [brandInput, setBrandInput] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (detectedBrand) {
      setBrandInput(detectedBrand);
    } else if (visibleText) {
      setBrandInput(visibleText);
    }
  }, [detectedBrand, visibleText]);

  // Launches direct camera capture input (native camera shutter on iOS & Android)
  const handleTakePhoto = () => {
    sound.playPop();
    setCameraError(null);
    cameraInputRef.current?.click();
  };

  const startCamera = async () => {
    sound.playPop();
    setCameraError(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Live camera stream unavailable:', err);
      // Fallback directly to native camera input
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setCameraError('Camera unavailable in current browser. Please use Upload Photo.');
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const flipCamera = () => {
    sound.playPop();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    sound.playPop();
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    stopCamera();
    try {
      const compressed = await compressImage(dataUrl, 1280, 0.85);
      onImageSelected(compressed);
    } catch {
      onImageSelected(dataUrl);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playPop();
      stopCamera();
      try {
        const compressed = await compressImage(file, 1280, 0.85);
        onImageSelected(compressed);
      } catch (err) {
        console.error('Image compression error, falling back to direct load:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            onImageSelected(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleSaveBrand = () => {
    sound.playPop();
    if (onBrandChange && brandInput.trim()) {
      onBrandChange(brandInput.trim());
    }
    setIsEditingBrand(false);
  };

  return (
    <div className="w-full max-w-md mx-auto" style={{ fontFamily: 'Verdana, sans-serif' }}>
      {/* 1. PHOTO SELECTED & DETECTING PREVIEW */}
      {selectedImage ? (
        <div className="rounded-2xl border border-stone-200/90 bg-white p-4 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner">
            <img
              src={selectedImage}
              alt="Scanned item preview"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Google Lens animated laser scanner effect while detecting */}
            {isDetecting && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#9485FF] to-transparent shadow-[0_0_18px_#9485FF] animate-bounce" />
                <div className="absolute inset-0 bg-[#9485FF]/10 animate-pulse backdrop-blur-2xs" />
              </div>
            )}

            <button
              onClick={() => {
                sound.playPop();
                onClearImage();
                stopCamera();
              }}
              className="absolute top-2.5 right-2.5 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-900 transition-colors backdrop-blur-md z-10 shadow-sm"
              title="Retake photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AI Auto-Detected Brand Card with 1-Tap Change & Shirt Text Detection */}
          <div className="rounded-xl bg-gradient-to-r from-amber-50/70 via-stone-50/60 to-white border border-amber-200/80 p-3.5 text-left space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>AI Brand & Text Detection</span>
              </span>
              {isDetecting ? (
                <span className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold">
                  <RefreshCw className="h-3 w-3 animate-spin text-amber-600" />
                  <span>Reading Shirt Text & Logos...</span>
                </span>
              ) : (
                !isEditingBrand && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setBrandInput(detectedBrand || visibleText || '');
                      setIsEditingBrand(true);
                    }}
                    className="flex items-center gap-1 text-[11px] text-amber-900 hover:text-amber-700 font-bold bg-white/95 border border-amber-200 px-2.5 py-0.5 rounded-md shadow-2xs active:scale-95 transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Change Brand</span>
                  </button>
                )
              )}
            </div>

            {isEditingBrand ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="Type brand from shirt/tag (e.g. Stüssy, Nike, Supreme)..."
                  autoFocus
                  className="flex-1 rounded-lg border border-amber-500 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveBrand();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveBrand}
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-2xs active:scale-95 transition-transform"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBrand(false)}
                  className="rounded-lg bg-slate-200 hover:bg-slate-300 p-1.5 text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{detectedBrand || visibleText || (isDetecting ? 'Scanning for brand & text...' : 'Unbranded / Custom')}</span>
                  {(detectedBrand || visibleText) && !isDetecting && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Detected
                    </span>
                  )}
                </div>
                {visibleText && visibleText !== detectedBrand && (
                  <div className="text-[11px] text-amber-800/90 font-medium mt-0.5">
                    Text read from item: <span className="font-bold">"{visibleText}"</span>
                  </div>
                )}
                {detectedItemName && (
                  <div className="text-xs text-slate-600 truncate mt-0.5">
                    {detectedItemName}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Big Button to Continue to Condition & Size Questions */}
          <button
            onClick={() => {
              sound.playPop();
              onProceedToQuestions();
            }}
            disabled={isDetecting}
            className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 font-bold text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span>Confirm Condition & Size</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : isCameraActive ? (
        /* 2. LIVE CAMERA VIEWFINDER (IF LIVE STREAMING ACTIVE) */
        <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-black shadow-xl">
          <div className="relative aspect-[4/3] w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {/* Viewfinder crosshairs */}
            <div className="pointer-events-none absolute inset-6 rounded-xl border border-white/40">
              <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-amber-400" />
            </div>

            {/* Shutter controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={flipCamera}
                className="rounded-full bg-slate-900/80 p-3 text-white backdrop-blur-md hover:bg-slate-900 transition-colors"
                title="Flip camera"
              >
                <RefreshCw className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-1 shadow-lg active:scale-95 transition-transform"
              >
                <div className="h-12 w-12 rounded-full border-2 border-slate-900 bg-amber-400" />
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. DEFAULT SCAN OPTIONS */
        <div className="space-y-4">
          {/* Direct Camera Shutter Input - Launches native camera shutter on mobile devices */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Standard File Upload Input (Library / Browse Files) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Quick Action Buttons - Stacked vertically and bigger */}
          <div className="flex flex-col gap-3.5">
            <button
              type="button"
              onClick={handleTakePhoto}
              style={{ backgroundColor: '#ffffff', borderColor: '#fdfeff' }}
              className="w-full min-h-[80px] flex items-center justify-center gap-3.5 rounded-2xl font-bold p-4 transition-all duration-200 active:scale-98 shadow-[0_4px_16px_rgba(15,23,42,0.12)] border group cursor-pointer"
            >
              <div
                style={{ backgroundColor: '#f5f5f4' }}
                className="p-2 rounded-xl bg-white/10 group-hover:bg-amber-500/20 text-amber-400 transition-colors"
              >
                <Camera className="h-6 w-6" style={{ color: '#000000' }} />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm sm:text-base font-extrabold tracking-tight" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                  Take Photo
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Capture garment or tag with camera
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                fileInputRef.current?.click();
              }}
              className="w-full min-h-[80px] flex items-center justify-center gap-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-bold p-4 transition-all duration-200 active:scale-98 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-stone-100 group-hover:bg-amber-50 text-stone-600 group-hover:text-amber-700 transition-colors">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm sm:text-base font-extrabold tracking-tight">
                  Upload Photo
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Select from gallery or files
                </span>
              </div>
            </button>
          </div>

          {cameraError && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
