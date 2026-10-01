export interface ConditionOption {
  id: string;
  label: string;
  shortLabel: string;
  retentionEstimate: string;
  description: string;
  wearIndicators: string[];
}

export interface SizeOption {
  id: string;
  label: string;
  demandTag?: 'High Demand' | 'Average' | 'Rare';
}

export interface WebSource {
  title: string;
  uri: string;
}

export interface ResalePlatformEstimate {
  platform: string;
  suggestedListPrice: number;
  estimatedPayout: number;
}

export interface ConditionFactor {
  conditionGrade: string;
  percentageRetained: number;
  explanation: string;
}

export interface SizeFactor {
  size: string;
  demandRating: string;
  impactNote: string;
}

export interface AppraisalResult {
  brand: string;
  modelName: string;
  category: string;
  brandOfficialWebsite?: string;
  originalMSRP: number;
  brandCurrentSalePrice?: number;
  isCurrentlyOnSaleAtBrand?: boolean;
  estimatedResaleValue: number;
  priceRange: {
    low: number;
    high: number;
  };
  conditionFactor: ConditionFactor;
  sizeFactor: SizeFactor;
  valuationSummary: string;
  retailPriceSourceNote?: string;
  confidenceScore?: number;
  topResalePlatforms?: ResalePlatformEstimate[];
  authenticitySignals?: string[];
  webSources?: WebSource[];
  resaleDescription?: string;
}

export interface ScannedItem extends AppraisalResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  condition: string;
  conditionNotes?: string;
  size: string;
  packaging?: string;
  resaleDescription?: string;
}

export interface DetectedPreview {
  detectedBrand: string;
  detectedCategory: string;
  detectedItemName: string;
  detectedColor?: string;
  suggestedSizeType: string;
  confidenceScore?: number;
  visibleText?: string;
  observedEvidence?: string;
  resaleDescription?: string;
}

export interface ClosetStats {
  totalItems: number;
  totalEstimatedValue: number;
  totalOriginalRetail: number;
  averageItemValue: number;
  valueRetentionRate: number;
  highestValuedItem: ScannedItem | null;
  categoryBreakdown: { [category: string]: { count: number; totalValue: number } };
}
