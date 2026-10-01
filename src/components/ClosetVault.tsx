import React, { useState, useMemo } from 'react';
import { 
  Vault, 
  Trash2, 
  Camera, 
  Search, 
  Share2,
  Check,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { ScannedItem } from '../types';
import { sound } from '../utils/soundEffects';
import { ResaleDescriptionCard } from './ResaleDescriptionCard';

interface ClosetVaultProps {
  scannedItems: ScannedItem[];
  onDeleteItem: (id: string) => void;
  onScanNewItem: () => void;
  onLoadSeedItems?: () => void;
}

export const ClosetVault: React.FC<ClosetVaultProps> = ({
  scannedItems,
  onDeleteItem,
  onScanNewItem,
}) => {
  const [search, setSearch] = useState<string>('');
  const [inspectItem, setInspectItem] = useState<ScannedItem | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const totalValue = useMemo(
    () => scannedItems.reduce((acc, item) => acc + (item.estimatedResaleValue || 0), 0),
    [scannedItems]
  );
  const totalMSRP = useMemo(
    () => scannedItems.reduce((acc, item) => acc + (item.originalMSRP || 0), 0),
    [scannedItems]
  );
  const averageValue = scannedItems.length > 0 ? Math.round(totalValue / scannedItems.length) : 0;

  // Addictive Collector Tier calculation
  const nextMilestone = useMemo(() => {
    if (totalValue < 1000) {
      return { target: 1000, title: 'Curator Tier', progress: Math.min((totalValue / 1000) * 100, 100) };
    }
    if (totalValue < 3000) {
      return { target: 3000, title: 'Connoisseur Tier', progress: Math.min(((totalValue - 1000) / 2000) * 100, 100) };
    }
    if (totalValue < 10000) {
      return { target: 10000, title: 'Grail Vault Tier', progress: Math.min(((totalValue - 3000) / 7000) * 100, 100) };
    }
    return { target: 25000, title: 'Museum Master Tier', progress: Math.min(((totalValue - 10000) / 15000) * 100, 100) };
  }, [totalValue]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return scannedItems;
    const q = search.toLowerCase();
    return scannedItems.filter(
      (item) =>
        item.brand.toLowerCase().includes(q) ||
        item.modelName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [scannedItems, search]);

  const handleShareFlex = () => {
    const text = `🏆 My Closetly Vault is currently valued at $${totalValue.toLocaleString()} across ${scannedItems.length} items! Appraise yours at Closetly.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    sound.playChime();
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto text-left space-y-4 pb-20">
      {/* 1. BIG TOTAL WARDROBE VALUE CARD */}
      <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-br from-white via-amber-50/30 to-stone-50/50 p-5 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-amber-600" />
            <span>Total Wardrobe Value</span>
          </span>

          {scannedItems.length > 0 && (
            <button
              onClick={handleShareFlex}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-700 bg-white/95 border border-amber-200 px-3 py-1 rounded-full shadow-2xs active:scale-95 transition-all"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3 text-amber-600" />
                  <span>Flex Stats</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          ${totalValue.toLocaleString()}
        </div>

        {/* Milestone Progression Bar */}
        {scannedItems.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-500 font-medium">
                Next: <strong className="text-stone-800 font-semibold">{nextMilestone.title}</strong>
              </span>
              <span className="font-mono font-bold text-amber-800">
                ${Math.max(0, nextMilestone.target - totalValue).toLocaleString()} to unlock
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-200/90 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(6, nextMilestone.progress)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-around border-t border-stone-200/90 pt-3 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px] font-medium">Items</span>
            <span className="font-bold text-stone-900 text-sm">{scannedItems.length}</span>
          </div>

          <div className="h-6 w-px bg-stone-200" />

          <div>
            <span className="text-stone-400 block text-[11px] font-medium">Avg / Piece</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">
              ${averageValue.toLocaleString()}
            </span>
          </div>

          <div className="h-6 w-px bg-stone-200" />

          <div>
            <span className="text-stone-400 block text-[11px] font-medium">Original Retail</span>
            <span className="font-bold text-stone-700 text-sm font-mono">
              ${totalMSRP.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Search & Scan CTA */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your items..."
            className="w-full rounded-xl border border-stone-200/90 bg-white pl-8 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xs transition-all"
          />
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onScanNewItem();
          }}
          style={{ backgroundColor: '#1fee05' }}
          className="min-h-[38px] flex items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold text-slate-950 shadow-sm transition-all active:scale-95"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Scan Next</span>
        </button>
      </div>

      {/* 3. Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-stone-200/90 bg-white p-8 text-center space-y-3 shadow-2xs">
          <Vault className="h-10 w-10 text-stone-300 mx-auto" />
          <div className="font-bold text-stone-900 text-sm">
            {scannedItems.length === 0 ? 'Your Closet Vault is Empty' : 'No items match your search'}
          </div>
          <p className="text-xs text-stone-500">
            {scannedItems.length === 0
              ? 'Scan shoes, bags, or clothes to calculate your full wardrobe value.'
              : 'Try searching another keyword.'}
          </p>

          {scannedItems.length === 0 && (
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playPop();
                  onScanNewItem();
                }}
                style={{ backgroundColor: '#1fee05' }}
                className="w-full rounded-xl py-3 text-xs font-bold text-slate-950 hover:opacity-90 active:scale-98 shadow-sm transition-colors"
              >
                Scan Your First Item
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3.5 rounded-xl border border-stone-200/90 bg-white p-3 hover:bg-stone-50/80 transition-all shadow-2xs group"
            >
              {/* Thumbnail */}
              <div 
                onClick={() => {
                  sound.playPop();
                  setInspectItem(item);
                }}
                className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 cursor-pointer shadow-2xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.modelName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Info */}
              <div 
                onClick={() => {
                  sound.playPop();
                  setInspectItem(item);
                }}
                className="flex-1 min-w-0 cursor-pointer text-left"
              >
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
                  {item.brand}
                </div>
                <div className="text-xs font-bold text-stone-900 truncate">
                  {item.modelName}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Size {item.size} · {item.condition}
                </div>
              </div>

              {/* Price & Delete */}
              <div className="text-right shrink-0 flex flex-col items-end">
                <span className="font-serif font-bold text-stone-900 text-sm tabular-nums">
                  ${item.estimatedResaleValue?.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1 text-stone-300 hover:text-rose-600 transition-colors mt-1"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Item Detail Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-2xl">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner">
              <img
                src={inspectItem.imageUrl}
                alt={inspectItem.modelName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase text-amber-800">
                {inspectItem.brand}
              </span>
              <h3 className="font-bold text-stone-900 text-base">{inspectItem.modelName}</h3>
              <div className="text-xs text-stone-500 mt-0.5">
                Size {inspectItem.size} · {inspectItem.condition}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-stone-50 border border-stone-200/90 p-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Brand Retail</span>
                <span className="font-bold text-stone-800">${inspectItem.originalMSRP?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px] font-medium">Est. Resale</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  ${inspectItem.estimatedResaleValue?.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {inspectItem.valuationSummary}
            </p>

            {/* Resale Description */}
            {inspectItem.resaleDescription && (
              <ResaleDescriptionCard
                description={inspectItem.resaleDescription}
                brand={inspectItem.brand}
              />
            )}

            <button
              onClick={() => setInspectItem(null)}
              className="w-full rounded-xl bg-stone-100 hover:bg-stone-200 py-2.5 text-xs font-bold text-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
