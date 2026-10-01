import { ConditionOption } from '../types';

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    id: 'nwt',
    label: 'Brand New With Tags (NWT / In Box)',
    shortLabel: 'New with Tags',
    retentionEstimate: '95% – 105%',
    description: 'Never worn, handled with care. Factory tags attached, flawless condition, original packaging intact.',
    wearIndicators: ['Factory tags attached', 'Zero sole or leather creasing', 'Includes original box/packaging'],
  },
  {
    id: 'like_new',
    label: 'Like New / Pristine',
    shortLabel: 'Like New',
    retentionEstimate: '80% – 90%',
    description: 'Tried on or carried once indoors. No visible wear, scuffs, or stains. In virtually fresh condition.',
    wearIndicators: ['Immaculate hardware', 'Clean interior/soles', 'Microscopic or zero creasing'],
  },
  {
    id: 'gently_used',
    label: 'Gently Used / Excellent',
    shortLabel: 'Gently Used',
    retentionEstimate: '60% – 75%',
    description: 'Carefully worn with light signs of normal use. Well maintained, structurally sound, no flaws.',
    wearIndicators: ['Soft leather break-in', 'Minor surface hairline scratches', 'Subtle heel or fabric wear'],
  },
  {
    id: 'good_wear',
    label: 'Good / Minor Wear',
    shortLabel: 'Good Condition',
    retentionEstimate: '45% – 60%',
    description: 'Moderate regular wear. Minor surface scuffs, slight fading, or edge rubbing. Fully wearable and clean.',
    wearIndicators: ['Visible corner or sole wear', 'Mild patina or minor creasing', 'Clean overall structure'],
  },
  {
    id: 'fair_wear',
    label: 'Fair / Noticeable Wear',
    shortLabel: 'Fair Wear',
    retentionEstimate: '25% – 40%',
    description: 'Heavy wear, noticeable blemishes, or heavy creasing. Great for daily beaters or restoration.',
    wearIndicators: ['Deep creasing or heel drag', 'Discoloration or stains', 'Missing minor secondary tags'],
  },
];

export const CATEGORY_OPTIONS = [
  'Sneakers & Shoes',
  'Handbags & Purses',
  'Jackets & Outerwear',
  'Tops & Shirts',
  'Pants & Bottoms',
  'Watches',
  'Jewelry',
  'Hats & Headwear',
  'Sunglasses & Eyewear',
  'Belts & Small Leather Goods',
  'Other Fashion Accessory',
];

export const SIZES_BY_CATEGORY: Record<string, string[]> = {
  'Sneakers & Shoes': [
    'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5',
    'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5',
    'US 12', 'US 13', 'Women US 7', 'Women US 8',
  ],
  'Handbags & Purses': [
    'Micro / Nano (under 18cm)',
    'Mini (18–22cm)',
    'Small (23–26cm)',
    'Medium (27–32cm)',
    'Large / Jumbo (33cm+)',
    'Tote / Weekender',
  ],
  'Jackets & Outerwear': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '38R', '40R', '42R', '44R'],
  'Tops & Shirts': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'Pants & Bottoms': ['28W', '29W', '30W', '31W', '32W', '33W', '34W', '36W', '38W', 'S', 'M', 'L'],
  'Watches': ['36mm', '38mm', '39mm', '40mm', '41mm', '42mm', '44mm', '45mm+'],
  'Jewelry': ['Size 5', 'Size 6', 'Size 7', 'Size 8', 'Size 9', 'Size 10', 'Size 11', '16" Chain', '18" Chain', 'One Size'],
  'Hats & Headwear': ['One Size (Adjustable)', 'S/M', 'L/XL', '7 1/8', '7 1/4', '7 3/8', '7 1/2'],
  'Sunglasses & Eyewear': ['Standard (52-54mm)', 'Narrow (50mm)', 'Wide (55mm+)', 'One Size'],
  'Belts & Small Leather Goods': ['80cm / 32"', '85cm / 34"', '90cm / 36"', '95cm / 38"', '100cm / 40"', 'Compact Wallet', 'Long Wallet'],
  'Other Fashion Accessory': ['One Size', 'Small', 'Medium', 'Large'],
};

export const PACKAGING_EXTRAS = [
  { id: 'box', label: 'Original Box / Case', impact: '+5% to +10% Resale Value' },
  { id: 'dustbag', label: 'Original Dust Bag / Pouch', impact: '+3% to +6% Resale Value' },
  { id: 'receipt', label: 'Original Store Receipt / Invoice', impact: 'Speeds up verification & sale' },
  { id: 'auth_card', label: 'Authenticity Card / Papers', impact: 'Essential for luxury/watches' },
  { id: 'tags', label: 'Factory Price Tags Attached', impact: 'Authenticates unworn status' },
  { id: 'none', label: 'Item Only (No Packaging)', impact: 'Standard baseline valuation' },
];
