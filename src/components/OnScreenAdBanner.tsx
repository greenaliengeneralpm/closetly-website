import React from 'react';
import { ExternalLink } from 'lucide-react';

interface OnScreenAdBannerProps {
  /** Optional custom title for affiliate or sponsor */
  title?: string;
  subtitle?: string;
  sponsorName?: string;
  adUrl?: string;
  imageUrl?: string;
}

export const OnScreenAdBanner: React.FC<OnScreenAdBannerProps> = ({
  title = 'Verified Luxury Resale Comps',
  subtitle = 'Buy & sell authenticated sneakers, streetwear & designer bags.',
  sponsorName = 'Sponsored',
  adUrl = 'https://stockx.com',
  imageUrl,
}) => {
  return (
    <div className="w-full pt-2">
      <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-r from-stone-50 via-white to-amber-50/40 p-3.5 shadow-2xs text-left relative overflow-hidden transition-all hover:border-stone-300">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
            {sponsorName}
          </span>
          <span className="text-[10px] text-stone-400">Ad Placement</span>
        </div>

        <a
          href={adUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-3 group"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Sponsored Banner"
              className="h-12 w-12 rounded-xl object-cover border border-stone-200"
            />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-300/40 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-500/20 transition-colors">
              <span className="font-serif font-black text-sm text-amber-800">VAULT</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-stone-800 group-hover:text-amber-800 transition-colors truncate flex items-center gap-1">
              <span>{title}</span>
              <ExternalLink className="h-3 w-3 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </h4>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};
