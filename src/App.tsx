import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraScanner } from './components/CameraScanner';
import { InteractivePrompts } from './components/InteractivePrompts';
import { AppraisalResultCard } from './components/AppraisalResultCard';
import { ClosetVault } from './components/ClosetVault';
import { MarketInsights } from './components/MarketInsights';
import { ScannedItem, DetectedPreview, AppraisalResult } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'closetly_items_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'vault' | 'insights'>('scan');
  const [activeScanStep, setActiveScanStep] = useState<'camera' | 'questions' | 'result'>('camera');

  // Closet items list: starts completely empty
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load from storage:', e);
    }
    return [];
  });

  // Active scan state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectedInfo, setDetectedInfo] = useState<DetectedPreview | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isAppraising, setIsAppraising] = useState<boolean>(false);
  const [appraisalResult, setAppraisalResult] = useState<AppraisalResult | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<{
    condition: string;
    size: string;
    packaging?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scannedItems));
    } catch (e) {
      console.warn('Failed to save closet to storage:', e);
    }
  }, [scannedItems]);

  // Handle image selected: immediately runs auto brand detection via Google Search visual lookup
  const handleImageSelected = async (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setErrorMessage(null);

    // Call fast AI auto-detect with Google Search
    setIsDetecting(true);
    try {
      const res = await fetch('/api/quick-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!res.ok) {
        throw new Error('Detection request failed');
      }

      const data = await res.json();
      setDetectedInfo(data);
    } catch (err: any) {
      console.warn('Auto-detect fallback:', err);
      setDetectedInfo({
        detectedBrand: '',
        detectedCategory: 'Clothing / Accessory',
        detectedItemName: '',
        suggestedSizeType: 'apparel_standard',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleBrandChange = (newBrand: string) => {
    setDetectedInfo((prev) => {
      const oldBrand = prev?.detectedBrand || '';
      let updatedDesc = prev?.resaleDescription;
      if (updatedDesc && oldBrand && newBrand) {
        updatedDesc = updatedDesc.split(oldBrand).join(newBrand);
      }
      return {
        detectedCategory: prev?.detectedCategory || 'Clothing / Accessory',
        detectedItemName: prev?.detectedItemName || '',
        suggestedSizeType: prev?.suggestedSizeType || 'apparel_standard',
        detectedBrand: newBrand,
        resaleDescription: updatedDesc,
      };
    });
  };

  const handleProceedToQuestions = () => {
    setActiveScanStep('questions');
  };

  const handleBackToPhoto = () => {
    setActiveScanStep('camera');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setDetectedInfo(null);
    setAppraisalResult(null);
    setActiveScanStep('camera');
  };

  // Submit questions and find actual brand sale price
  const handleAppraiseSubmit = async (answers: {
    category: string;
    brand: string;
    itemName: string;
    condition: string;
    conditionNotes: string;
    size: string;
    packaging: string;
  }) => {
    if (!selectedImage) return;
    setIsAppraising(true);
    setErrorMessage(null);
    setCurrentAnswers({
      condition: answers.condition,
      size: answers.size,
      packaging: answers.packaging,
    });

    try {
      const res = await fetch('/api/appraise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          category: answers.category,
          brand: answers.brand,
          itemName: answers.itemName,
          condition: answers.condition,
          conditionNotes: answers.conditionNotes,
          size: answers.size,
          packaging: answers.packaging,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to appraise item');
      }

      const resultData: AppraisalResult = await res.json();
      if (!resultData.resaleDescription && detectedInfo?.resaleDescription) {
        resultData.resaleDescription = detectedInfo.resaleDescription;
      }
      setAppraisalResult(resultData);
      setActiveScanStep('result');
    } catch (err: any) {
      console.error('Appraisal error:', err);
      setErrorMessage(
        err.message || 'Unable to check brand website pricing right now. Please try again.'
      );
    } finally {
      setIsAppraising(false);
    }
  };

  const handleSaveToCloset = (newItem: ScannedItem) => {
    setScannedItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
  };

  const handleDeleteItem = (id: string) => {
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleScanNewItem = () => {
    setSelectedImage(null);
    setDetectedInfo(null);
    setAppraisalResult(null);
    setCurrentAnswers(null);
    setErrorMessage(null);
    setActiveScanStep('camera');
    setActiveTab('scan');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 flex flex-col font-sans pb-20 selection:bg-amber-500/20">
      {/* Mobile Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scannedItems={scannedItems}
        onNewScan={handleScanNewItem}
      />

      {/* Main Mobile App Container */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-5">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 font-bold ml-2 hover:text-rose-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: SCAN & APPRAISE */}
        {activeTab === 'scan' && (
          <div>
            {/* Step 1: Camera or Upload */}
            {activeScanStep === 'camera' && (
              <div className="space-y-4">
                {!selectedImage && (
                  <div className="text-left space-y-1.5 pt-1">
                    <h1
                      style={{ color: '#000000', fontFamily: 'Verdana' }}
                      className="text-[28px] font-bold tracking-tight leading-tight"
                    >
                      Price Any Clothing or Accessory
                    </h1>
                    <p className="text-xs text-stone-500 font-normal leading-relaxed">
                      Instant brand sale lookup, condition adjustments, and real-time wardrobe valuation.
                    </p>
                  </div>
                )}

                <CameraScanner
                  selectedImage={selectedImage}
                  onImageSelected={handleImageSelected}
                  onClearImage={handleClearImage}
                  onProceedToQuestions={handleProceedToQuestions}
                  isDetecting={isDetecting}
                  detectedBrand={detectedInfo?.detectedBrand}
                  detectedItemName={detectedInfo?.detectedItemName}
                  visibleText={detectedInfo?.visibleText}
                  onBrandChange={handleBrandChange}
                />
              </div>
            )}

            {/* Step 2: 2 Quick Questions (Condition & Size) */}
            {activeScanStep === 'questions' && selectedImage && (
              <div>
                {isAppraising ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                      <RefreshCw className="h-7 w-7 animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Searching Brand Website...
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Looking up current sale prices for {detectedInfo?.detectedBrand || 'this brand'} and adjusting for condition & size.
                      </p>
                    </div>
                  </div>
                ) : (
                  <InteractivePrompts
                    imageSrc={selectedImage}
                    detectedInfo={detectedInfo}
                    onAppraiseSubmit={handleAppraiseSubmit}
                    onBackToPhoto={handleBackToPhoto}
                    isAppraising={isAppraising}
                  />
                )}
              </div>
            )}

            {/* Step 3: Appraisal Result */}
            {activeScanStep === 'result' && appraisalResult && selectedImage && (
              <AppraisalResultCard
                result={appraisalResult}
                imageSrc={selectedImage}
                condition={currentAnswers?.condition || 'Gently Used'}
                size={currentAnswers?.size || 'Standard'}
                packaging={currentAnswers?.packaging}
                onSaveToCloset={handleSaveToCloset}
                onScanAnother={handleScanNewItem}
                isSaved={scannedItems.some((i) => i.modelName === appraisalResult.modelName)}
              />
            )}
          </div>
        )}

        {/* TAB 2: MY CLOSET VAULT & ITEM COUNT */}
        {activeTab === 'vault' && (
          <ClosetVault
            scannedItems={scannedItems}
            onDeleteItem={handleDeleteItem}
            onScanNewItem={handleScanNewItem}
          />
        )}

        {/* TAB 3: PRICING TIPS */}
        {activeTab === 'insights' && <MarketInsights />}
      </main>
    </div>
  );
}
