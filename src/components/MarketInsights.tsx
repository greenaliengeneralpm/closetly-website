import React from 'react';
import { Sparkles, TrendingUp, Tag } from 'lucide-react';

export const MarketInsights: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto text-left space-y-4 pb-20">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
          Valuation Intelligence
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          How live brand catalog data, condition multipliers, and sizing determine resale pricing.
        </p>
      </div>

      {/* 1. Brand Price Rule */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-4 space-y-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
          <Tag className="h-4 w-4 text-amber-600" />
          <span>1. Official Brand Sale Comp Check</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          We query the brand's official store first. If Nike, Coach, or Zara currently discounts the item by 25%, resale estimates dynamically adjust so you price competitively against retail.
        </p>
      </div>

      {/* 2. Condition Guide */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-4 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>2. Condition Retention Scale</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-800 font-medium">🏷️ Brand New (With Tags / Box)</span>
            <span className="font-mono font-bold text-emerald-700">100% of retail</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-800 font-medium">✨ Like New (Worn 1-2 times)</span>
            <span className="font-mono font-bold text-emerald-700">80% – 90%</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-800 font-medium">👍 Gently Used (Standard wear)</span>
            <span className="font-mono font-bold text-amber-700">60% – 75%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-800 font-medium">📦 Well Worn (Heavy creasing/scuffs)</span>
            <span className="font-mono font-bold text-stone-400">30% – 45%</span>
          </div>
        </div>
      </div>

      {/* 3. Size Rule */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-4 space-y-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2 text-xs font-extrabold text-blue-800">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span>3. Sizing Liquidity & Demand</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          High-volume standard sizes (Men's US 9–10.5, Women's 7–8, and Medium/Large apparel) turn over fastest on Grailed, StockX, and Depop, holding peak cash liquidity.
        </p>
      </div>
    </div>
  );
};
