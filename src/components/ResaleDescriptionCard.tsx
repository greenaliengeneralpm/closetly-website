import React, { useState } from 'react';
import { Copy, Check, Sparkles, Edit2, FileText } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ResaleDescriptionCardProps {
  description?: string;
  isGenerating?: boolean;
  onDescriptionChange?: (newDesc: string) => void;
  brand?: string;
}

export const ResaleDescriptionCard: React.FC<ResaleDescriptionCardProps> = ({
  description = '',
  isGenerating = false,
  onDescriptionChange,
  brand,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(description);

  const handleCopy = async () => {
    const textToCopy = isEditing ? editText : description;
    if (!textToCopy) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure contexts / older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      sound.playPop();
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleSaveEdit = () => {
    sound.playPop();
    if (onDescriptionChange) {
      onDescriptionChange(editText);
    }
    setIsEditing(false);
  };

  if (isGenerating) {
    return (
      <div className="rounded-xl border border-stone-200/90 bg-stone-50/70 p-3.5 text-left space-y-2.5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Writing Resale Description...</span>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
            Vinted · Depop · eBay
          </span>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-4 bg-stone-200 rounded-md w-3/4" />
          <div className="h-3 bg-stone-200/70 rounded-md w-1/2" />
          <div className="h-3 bg-stone-200/70 rounded-md w-2/3" />
          <div className="h-3 bg-stone-200/70 rounded-md w-4/5" />
        </div>
      </div>
    );
  }

  if (!description && !editText) {
    return null;
  }

  return (
    <div className="rounded-xl border border-stone-200/90 bg-gradient-to-b from-stone-50/90 to-white p-3.5 text-left space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-amber-700" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700">
            Reselling Description
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 border border-amber-200">
            Ready to Paste
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setEditText(description);
                setIsEditing(true);
              }}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 p-1 rounded-md transition-colors"
              title="Edit description"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-stone-400 font-medium">
        Optimized for Vinted, Depop, eBay, Poshmark & Grailed
      </div>

      {isEditing ? (
        <div className="space-y-2 pt-1">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={7}
            className="w-full rounded-lg border border-amber-400 bg-white p-2.5 text-xs font-sans text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner leading-relaxed"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-md shadow-2xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-3 font-sans text-xs text-stone-800 whitespace-pre-line leading-relaxed shadow-inner selection:bg-amber-200">
          {description}
        </div>
      )}
    </div>
  );
};
