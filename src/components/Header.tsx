import React from 'react';
import { Camera, Vault, TrendingUp, Sparkles, Flame } from 'lucide-react';
import { ScannedItem } from '../types';
import { ClosetlyLogo } from './ClosetlyLogo';

interface HeaderProps {
  activeTab: 'scan' | 'vault' | 'insights';
  setActiveTab: (tab: 'scan' | 'vault' | 'insights') => void;
  scannedItems: ScannedItem[];
  onNewScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  scannedItems,
  onNewScan,
}) => {
  const totalValue = scannedItems.reduce((acc, item) => acc + (item.estimatedResaleValue || 0), 0);
  const itemCount = scannedItems.length;

  return (
    <>
      {/* Top Mobile Bar - Sleek Glassmorphic Luxury Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
        <div className="mx-auto flex h-16 max-w-lg md:max-w-4xl items-center justify-between px-4">
          {/* Logo in top-left corner */}
          <button
            onClick={() => {
              setActiveTab('scan');
              onNewScan();
            }}
            className="flex items-center focus:outline-none transition-transform active:scale-95 py-1"
            title="Closetly Home"
          >
            <ClosetlyLogo size="md" className="hover:opacity-95 transition-opacity" />
          </button>

          {/* Quick Value Tracker in top-right corner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('vault')}
              className="flex items-center gap-2 rounded-full bg-stone-50/90 border border-stone-200/90 px-3.5 py-1.5 text-xs hover:border-stone-300 hover:bg-stone-100/90 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] group active:scale-95"
            >
              <span className="text-stone-500 font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="h-3 w-px bg-stone-300/80" />
              <span className="font-mono font-bold text-emerald-700 tabular-nums text-sm group-hover:scale-105 transition-transform">
                ${totalValue.toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar - Kept in same position with high-end tactile finish */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-stone-200/90 bg-white/95 backdrop-blur-xl pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="mx-auto grid max-w-lg grid-cols-3 h-16 items-center px-3">
          {/* Tab 1: Scan */}
          <button
            onClick={() => {
              setActiveTab('scan');
              onNewScan();
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all min-h-[48px] active:scale-95 ${
              activeTab === 'scan' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${activeTab === 'scan' ? 'bg-amber-50 text-amber-600 scale-105 shadow-2xs' : ''}`}>
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">Scan & Value</span>
          </button>

          {/* Tab 2: Closet Vault */}
          <button
            onClick={() => setActiveTab('vault')}
            className={`relative flex flex-col items-center justify-center py-1 transition-all min-h-[48px] active:scale-95 ${
              activeTab === 'vault' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-800'
            }`}
          >
            <div
              style={{ backgroundColor: '#ffffff' }}
              className={`p-1.5 rounded-xl transition-all duration-200 ${activeTab === 'vault' ? 'scale-105 shadow-2xs' : ''}`}
            >
              <Vault className="h-5 w-5" style={{ backgroundColor: '#ffffff', color: '#000000' }} />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              My Closet ({itemCount})
            </span>
            {itemCount > 0 && (
              <span className="absolute top-2 right-8 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Tab 3: Insights */}
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center py-1 transition-all min-h-[48px] active:scale-95 ${
              activeTab === 'insights' ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${activeTab === 'insights' ? 'bg-amber-50 text-amber-600 scale-105 shadow-2xs' : ''}`}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">Price Trends</span>
          </button>
        </div>
      </nav>
    </>
  );
};
