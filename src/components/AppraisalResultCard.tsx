import React, { useState, useEffect } from 'react';
import { Check, ExternalLink, Sparkles, PlusCircle, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppraisalResult, ScannedItem } from '../types';
import { sound } from '../utils/soundEffects';
import { ResaleDescriptionCard } from './ResaleDescriptionCard';

interface AppraisalResultCardProps {
  result: AppraisalResult;
  imageSrc: string;
  condition: string;
  size: string;
  packaging?: string;
  onSaveToCloset: (item: ScannedItem) => void;
  onScanAnother: () => void;
  isSaved?: boolean;
}

export const AppraisalResultCard: React.FC<AppraisalResultCardProps> = ({
  result,
  imageSrc,
  condition,
  size,
  packaging,
  onSaveToCloset,
  onScanAnother,
  isSaved = false,
}) => {
  const [saved, setSaved] = useState<boolean>(isSaved);
  const [editableDescription, setEditableDescription] = useState<string>(
    result.resaleDescription || ''
  );

  const msrp = result.originalMSRP || 0;
  const brandSale = result.brandCurrentSalePrice || msrp;
  const targetResale = result.estimatedResaleValue || 0;

  // Addictive animated price count-up
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(true);

  useEffect(() => {
    let start = 0;
    const duration = 750;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(targetResale * ease);
      setDisplayPrice(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayPrice(targetResale);
        setIsCounting(false);
        sound.playChime();
        confetti({
          particleCount: 30,
          spread: 55,
          origin: { y: 0.45 },
          colors: ['#9385FF', '#f59e0b', '#10b981'],
        });
      }
    };

    requestAnimationFrame(animate);
  }, [targetResale]);

  const handleSave = () => {
    if (saved) return;
    const newItem: ScannedItem = {
      ...result,
      id: `item_${Date.now()}`,
      timestamp: Date.now(),
      imageUrl: imageSrc,
      condition,
      size,
      packaging,
      resaleDescription: editableDescription,
    };
    onSaveToCloset(newItem);
    setSaved(true);
    sound.playLevelUp();

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#9385FF', '#f59e0b', '#10b981', '#ffffff'],
    });
  };

  const isHighDemand = targetResale >= (msrp * 0.75);

  return (
    <div className="w-full max-w-md mx-auto text-left space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Item Header Preview with Badge */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 relative shadow-2xs">
          <img
            src={imageSrc}
            alt={result.modelName}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
              {result.brand}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-0.5">
              <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
              <span>Verified Comp</span>
            </span>
          </div>
          <h2 className="text-sm font-bold text-stone-900 truncate mt-0.5">
            {result.modelName}
          </h2>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
            <span>Size {size}</span>
            <span>·</span>
            <span>{condition}</span>
          </div>
        </div>
      </div>

      {/* 2. Big Estimated Resale Price Certificate Card */}
      <div className="relative rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/70 via-stone-50/40 to-white p-6 text-center space-y-3.5 shadow-[0_4px_24px_rgba(245,158,11,0.08)] overflow-hidden">
        {/* Subtle decorative gold sheen */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/15 blur-2xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-center gap-2">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-900/90">
            Estimated Resale Market Value
          </span>
          {isHighDemand && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
              <Flame className="h-3 w-3 text-amber-600 fill-amber-500" />
              <span>HIGH DEMAND</span>
            </span>
          )}
        </div>

        {/* Animated Counter with Editorial Typography */}
        <div className={`font-serif text-5xl sm:text-6xl font-bold text-stone-900 tracking-tight transition-transform ${isCounting ? 'scale-105' : 'scale-100'}`}>
          ${displayPrice.toLocaleString()}
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Comp Range: ${result.priceRange?.low || targetResale} – ${result.priceRange?.high || targetResale}
        </div>

        {/* Brand Retail vs Store Sale Price */}
        <div className="flex items-center justify-between rounded-xl bg-white border border-stone-200/90 p-3.5 text-xs shadow-2xs">
          <div className="text-left">
            <span className="text-stone-400 block text-[11px] font-medium">Brand Retail (MSRP)</span>
            <span className="font-mono font-bold text-stone-800 text-sm">${msrp.toLocaleString()}</span>
          </div>

          <div className="h-6 w-px bg-stone-200" />

          <div className="text-right">
            <span className="text-stone-400 block text-[11px] font-medium">Brand Online Store</span>
            <span className={`font-mono font-bold text-sm ${result.isCurrentlyOnSaleAtBrand ? 'text-amber-700 font-extrabold' : 'text-stone-800'}`}>
              ${brandSale.toLocaleString()}
              {result.isCurrentlyOnSaleAtBrand && ' (On Sale)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Simple 2-Card Explanation (Condition & Size) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 shadow-2xs hover:border-stone-300 transition-colors">
          <span className="text-stone-400 block text-[11px] font-medium">Condition Factor</span>
          <span className="font-bold text-amber-800 mt-0.5 block">{condition}</span>
          <span className="text-[11px] text-emerald-700 font-semibold leading-tight mt-1 block">
            {result.conditionFactor?.percentageRetained || 70}% value preserved
          </span>
        </div>

        <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 shadow-2xs hover:border-stone-300 transition-colors">
          <span className="text-stone-400 block text-[11px] font-medium">Size Liquidity</span>
          <span className="font-bold text-purple-900 mt-0.5 block">Size {size}</span>
          <span className="text-[11px] text-purple-700 font-semibold leading-tight mt-1 block">
            {result.sizeFactor?.demandRating || 'Active Demand'}
          </span>
        </div>
      </div>

      {/* 4. Short Summary */}
      <div className="rounded-xl border border-stone-200/90 bg-white p-3.5 text-xs text-stone-600 leading-relaxed shadow-2xs">
        {result.valuationSummary}
      </div>

      {/* 5. Brand Website Comps Link */}
      {result.webSources && result.webSources.length > 0 && (
        <a
          href={result.webSources[0].uri}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-amber-200/90 bg-amber-50/70 p-3 text-xs text-amber-900 font-bold hover:bg-amber-100/70 transition-colors shadow-2xs"
        >
          <span className="truncate">View on {result.brand} Official Store</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-2 text-amber-700" />
        </a>
      )}

      {/* 6. Resale Listing Description Card with 1-click Copy */}
      <ResaleDescriptionCard
        description={editableDescription}
        onDescriptionChange={setEditableDescription}
        brand={result.brand}
      />

      {/* 7. Primary Mobile Actions - Kept in exact same position with elevated tactile polish */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] ${
            saved
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-lg'
          }`}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Added to Your Closetly Vault</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Add +${targetResale.toLocaleString()} to My Closet Value</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            sound.playPop();
            onScanAnother();
          }}
          className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs active:scale-98 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
          <span>Scan Next Item</span>
        </button>
      </div>
    </div>
  );
};
