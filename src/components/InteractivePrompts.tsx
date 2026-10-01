import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Sparkles, Edit3, X } from 'lucide-react';
import { CONDITION_OPTIONS, SIZES_BY_CATEGORY, PACKAGING_EXTRAS } from '../data/questionData';
import { DetectedPreview } from '../types';
import { sound } from '../utils/soundEffects';

interface InteractivePromptsProps {
  imageSrc: string;
  detectedInfo: DetectedPreview | null;
  onAppraiseSubmit: (answers: {
    category: string;
    brand: string;
    itemName: string;
    condition: string;
    conditionNotes: string;
    size: string;
    packaging: string;
  }) => void;
  onBackToPhoto: () => void;
  isAppraising: boolean;
}

export const InteractivePrompts: React.FC<InteractivePromptsProps> = ({
  imageSrc,
  detectedInfo,
  onAppraiseSubmit,
  onBackToPhoto,
  isAppraising,
}) => {
  // Simple 2-step prompt flow on mobile: 1 = Condition, 2 = Size & Extras
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Auto-detected Brand with instant 1-tap edit
  const [brand, setBrand] = useState<string>(detectedInfo?.detectedBrand || detectedInfo?.visibleText || '');
  const [isEditingBrand, setIsEditingBrand] = useState<boolean>(!detectedInfo?.detectedBrand && !detectedInfo?.visibleText);
  const [editBrandText, setEditBrandText] = useState<string>(detectedInfo?.detectedBrand || detectedInfo?.visibleText || '');

  const [category, setCategory] = useState<string>(detectedInfo?.detectedCategory || 'Clothing / Accessory');
  const [itemName, setItemName] = useState<string>(detectedInfo?.detectedItemName || '');

  // Keep synced if detectedInfo updates asynchronously
  React.useEffect(() => {
    if (detectedInfo?.detectedBrand) {
      setBrand(detectedInfo.detectedBrand);
      setEditBrandText(detectedInfo.detectedBrand);
      setIsEditingBrand(false);
    } else if (detectedInfo?.visibleText) {
      setBrand(detectedInfo.visibleText);
      setEditBrandText(detectedInfo.visibleText);
      setIsEditingBrand(false);
    }
    if (detectedInfo?.detectedCategory) {
      setCategory(detectedInfo.detectedCategory);
    }
    if (detectedInfo?.detectedItemName) {
      setItemName(detectedInfo.detectedItemName);
    }
  }, [detectedInfo]);

  // Question answers
  const [selectedCondition, setSelectedCondition] = useState<string>('gently_used');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [customSize, setCustomSize] = useState<string>('');
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>(['box']);

  const availableSizes = SIZES_BY_CATEGORY[category] || ['S', 'M', 'L', 'XL'];

  const saveEditedBrand = () => {
    sound.playPop();
    if (editBrandText.trim()) {
      setBrand(editBrandText.trim());
    }
    setIsEditingBrand(false);
  };

  const handleNext = () => {
    sound.playPop();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      submitValuation();
    }
  };

  const submitValuation = () => {
    const activeCondition = CONDITION_OPTIONS.find((c) => c.id === selectedCondition);
    const finalSize = customSize.trim() || selectedSize;
    const finalPackaging = selectedPackaging
      .map((id) => PACKAGING_EXTRAS.find((p) => p.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    onAppraiseSubmit({
      category,
      brand: brand || 'Unbranded',
      itemName: itemName || 'Fashion Item',
      condition: activeCondition?.label || 'Gently Used / Excellent',
      conditionNotes: '',
      size: finalSize,
      packaging: finalPackaging || 'Item only',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto text-left space-y-4 pb-20">
      {/* 1. AUTO-DETECTED BRAND CARD WITH 1-TAP EDIT */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-2xs">
            <img
              src={imageSrc}
              alt="Item thumbnail"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span>AI Detected Brand</span>
              </span>

              {!isEditingBrand && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setEditBrandText(brand);
                    setIsEditingBrand(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-700 bg-amber-50/80 border border-amber-200 px-2.5 py-0.5 rounded-md shadow-2xs active:scale-95 transition-all"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Change</span>
                </button>
              )}
            </div>

            {isEditingBrand ? (
              <div className="space-y-2 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editBrandText}
                    onChange={(e) => setEditBrandText(e.target.value)}
                    placeholder="Enter brand name..."
                    autoFocus
                    className="flex-1 rounded-lg border border-amber-500 bg-white px-2.5 py-1 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditedBrand();
                    }}
                  />
                  <button
                    onClick={saveEditedBrand}
                    className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 shadow-2xs active:scale-95"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingBrand(false)}
                    className="rounded-lg bg-stone-100 hover:bg-stone-200 px-2 py-1 text-xs text-stone-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Quick brand chips for instant 1-tap select */}
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  <span className="text-[10px] text-stone-400 font-medium">Quick Pick:</span>
                  {['Nike', 'Stüssy', 'Supreme', 'Essentials', 'Carhartt', 'Ralph Lauren', 'Zara', 'Gucci'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setBrand(b);
                        setEditBrandText(b);
                        setIsEditingBrand(false);
                      }}
                      className="text-[10px] font-semibold bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 px-2 py-0.5 rounded-md border border-stone-200 transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                onClick={() => {
                  sound.playPop();
                  setEditBrandText(brand);
                  setIsEditingBrand(true);
                }}
                className="mt-0.5 truncate font-bold text-sm text-stone-900 cursor-pointer flex items-center gap-1.5"
              >
                <span>{brand || 'Tap to enter brand'}</span>
                {!brand && (
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                    + Add
                  </span>
                )}
                {brand && (
                  <span className="text-xs font-normal text-stone-500">· {category}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Pill Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-500">
        <span className="font-bold text-amber-800">
          Step {currentStep} of 2
        </span>
        <span className="font-medium">{currentStep === 1 ? 'Condition Rating' : 'Size & Extras'}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className={`h-1.5 rounded-full transition-colors duration-300 ${currentStep >= 1 ? 'bg-amber-500' : 'bg-stone-200'}`} />
        <div className={`h-1.5 rounded-full transition-colors duration-300 ${currentStep >= 2 ? 'bg-amber-500' : 'bg-stone-200'}`} />
      </div>

      {/* QUESTION 1: CONDITION */}
      {currentStep === 1 && (
        <div className="space-y-3 pt-1">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              What condition is it in?
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Select the condition for an accurate resale multiplier.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'nwt', emoji: '🏷️', title: 'Brand New (With Tags)', sub: 'Never worn, flawless in box/tags', val: '100% value' },
              { id: 'like_new', emoji: '✨', title: 'Like New (Mint)', sub: 'Worn 1-2 times, crisp & clean', val: '85% value' },
              { id: 'gently_used', emoji: '👍', title: 'Gently Used', sub: 'Minor normal wear, carefully kept', val: '70% value' },
              { id: 'good_wear', emoji: '👌', title: 'Good Condition', sub: 'Noticeable wear or minor scuffs', val: '50% value' },
              { id: 'fair_wear', emoji: '📦', title: 'Well Worn', sub: 'Heavy wear, creasing or stains', val: '35% value' },
            ].map((c) => {
              const isSelected = selectedCondition === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedCondition(c.id);
                  }}
                  className={`w-full min-h-[54px] flex items-center justify-between rounded-xl border p-3.5 text-left transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 shadow-[0_2px_8px_rgba(245,158,11,0.12)] ring-1 ring-amber-500'
                      : 'border-stone-200/90 bg-white hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-stone-900">{c.title}</div>
                      <div className="text-[11px] text-stone-500">{c.sub}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {c.val}
                    </span>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-slate-950'
                          : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* QUESTION 2: SIZE & EXTRAS */}
      {currentStep === 2 && (
        <div className="space-y-4 pt-1">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              What size is it?
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              High-demand sizes command premium secondary prices.
            </p>
          </div>

          {/* Sizing Chips */}
          <div className="grid grid-cols-4 gap-2">
            {availableSizes.slice(0, 8).map((size) => {
              const isSelected = selectedSize === size && !customSize;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedSize(size);
                    setCustomSize('');
                  }}
                  className={`min-h-[46px] rounded-xl border p-2 text-center text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.25)]'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Custom Size field */}
          <div>
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Or enter custom size (e.g. US 10.5, Medium, 34w)..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xs focus:outline-none transition-all"
            />
          </div>

          {/* Simple packaging question */}
          <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 space-y-2.5 shadow-2xs">
            <span className="text-xs font-bold text-stone-800 block">
              Includes original packaging?
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'box', label: '📦 Original Box / Dustbag' },
                { id: 'receipt', label: '🧾 Store Receipt' },
              ].map((p) => {
                const isChecked = selectedPackaging.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      if (isChecked) {
                        setSelectedPackaging(selectedPackaging.filter((i) => i !== p.id));
                      } else {
                        setSelectedPackaging([...selectedPackaging, p.id]);
                      }
                    }}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all active:scale-95 ${
                      isChecked
                        ? 'border-amber-400 bg-amber-50/80 text-stone-900 font-semibold shadow-2xs'
                        : 'border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isChecked && <Check className="h-3 w-3 text-amber-600 font-bold" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM THUMB ACTIONS */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            if (currentStep === 1) onBackToPhoto();
            else setCurrentStep(1);
          }}
          className="min-h-[50px] rounded-xl border border-stone-200 bg-white px-4 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isAppraising}
          className="flex-1 min-h-[50px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-bold text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {currentStep === 1 ? (
            <>
              <span>Next: Select Size</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Find Real Brand Sale Price</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
