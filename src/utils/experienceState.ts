export type ExperienceStepId =
  | 'envelope'
  | 'birthday_reveal'
  | 'flower_bloom'
  | 'gift_reveal'
  | 'final_state';

export interface StepCameraPose {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export interface StepSceneTargets {
  envelopeOpacity: number;
  flapOpenRatio: number; // 0 = closed, 1 = fully open
  cardRiseRatio: number; // 0 = inside, 1 = risen
  bouquetScale: number; // 0 = hidden, 1 = full bloom
  bouquetOffsetX: number;
  bouquetOffsetZ: number;
  giftBoxScale: number; // 0 = hidden, 1 = visible
  giftBoxOpenRatio: number; // 0 = closed with ribbon, 1 = open revealing QR card
  petalDriftSpeed: number;
}

export interface ExperienceStepConfig {
  stepNumber: 1 | 2 | 3 | 4 | 5;
  id: ExperienceStepId;
  name: string;
  shortLabel: string;
  durationSeconds: number | null; // null = stays until closed
  autoAdvanceMs: number | null; // auto transition duration if applicable
  kicker?: string;
  heading: string;
  subheading?: string;
  wishesText?: string;
  scriptText?: string;
  primaryActionLabel?: string;
  camera: StepCameraPose;
  sceneTargets: StepSceneTargets;
}

export const RECIPIENT_INFO = {
  name: 'Putri Hanan Latifah',
  shortName: 'Putri',
  birthday: '22 November 2003',
  formattedBirthday: '22 · 11 · 2003',
  wishes:
    'May your year ahead be filled with warm mornings, gentle laughter, and every quiet happiness your heart has been wishing for.',
} as const;

export const COLOR_PALETTE = {
  background: '#F8F3EE',
  surface: '#FFFDF9',
  primary: '#C77B87',
  text: '#463A38',
  muted: '#A99A91',
  accent: '#D9B4AA',
} as const;

export const EXPERIENCE_STEPS: readonly ExperienceStepConfig[] = [
  {
    stepNumber: 1,
    id: 'envelope',
    name: 'Envelope',
    shortLabel: '1. Envelope',
    durationSeconds: 3,
    autoAdvanceMs: null,
    kicker: 'For',
    heading: 'Putri Hanan Latifah',
    subheading: 'A little surprise for you',
    primaryActionLabel: 'Open',
    camera: {
      position: [0, 3.45, 4.65],
      lookAt: [0, 0.38, 0.1],
      fov: 38,
    },
    sceneTargets: {
      envelopeOpacity: 1,
      flapOpenRatio: 0,
      cardRiseRatio: 0,
      bouquetScale: 0,
      bouquetOffsetX: 0,
      bouquetOffsetZ: -0.8,
      giftBoxScale: 0,
      giftBoxOpenRatio: 0,
      petalDriftSpeed: 0.35,
    },
  },
  {
    stepNumber: 2,
    id: 'birthday_reveal',
    name: 'Birthday Reveal',
    shortLabel: '2. Card',
    durationSeconds: 3,
    autoAdvanceMs: 5500,
    heading: 'Happy Birthday, Putri.',
    subheading: '22 November',
    wishesText: RECIPIENT_INFO.wishes,
    primaryActionLabel: 'See Your Flowers',
    camera: {
      position: [0, 2.95, 4.25],
      lookAt: [0, 0.72, 0.05],
      fov: 37,
    },
    sceneTargets: {
      envelopeOpacity: 1,
      flapOpenRatio: 1,
      cardRiseRatio: 1,
      bouquetScale: 0,
      bouquetOffsetX: 0,
      bouquetOffsetZ: -0.8,
      giftBoxScale: 0,
      giftBoxOpenRatio: 0,
      petalDriftSpeed: 0.5,
    },
  },
  {
    stepNumber: 3,
    id: 'flower_bloom',
    name: 'Flower Bloom',
    shortLabel: '3. Bouquet',
    durationSeconds: 5,
    autoAdvanceMs: null,
    kicker: 'Happy Birthday',
    heading: 'Putri Hanan Latifah',
    scriptText: 'For Putri',
    primaryActionLabel: 'Open Your Gift',
    camera: {
      position: [0, 2.35, 4.55],
      lookAt: [0, 1.02, 0],
      fov: 38,
    },
    sceneTargets: {
      envelopeOpacity: 0,
      flapOpenRatio: 1,
      cardRiseRatio: 1,
      bouquetScale: 1,
      bouquetOffsetX: 0,
      bouquetOffsetZ: 0,
      giftBoxScale: 0,
      giftBoxOpenRatio: 0,
      petalDriftSpeed: 0.65,
    },
  },
  {
    stepNumber: 4,
    id: 'gift_reveal',
    name: 'Gift Reveal',
    shortLabel: '4. Gift Box',
    durationSeconds: 4,
    autoAdvanceMs: 3600,
    scriptText: 'A Little Surprise for You',
    heading: 'A little something for you',
    primaryActionLabel: 'Reveal QR Code',
    camera: {
      position: [0.15, 2.55, 4.05],
      lookAt: [0, 0.72, 0.15],
      fov: 36,
    },
    sceneTargets: {
      envelopeOpacity: 0,
      flapOpenRatio: 1,
      cardRiseRatio: 1,
      bouquetScale: 0.88,
      bouquetOffsetX: -1.15,
      bouquetOffsetZ: -0.65,
      giftBoxScale: 1,
      giftBoxOpenRatio: 1,
      petalDriftSpeed: 0.4,
    },
  },
  {
    stepNumber: 5,
    id: 'final_state',
    name: 'Final State',
    shortLabel: '5. Gift QR',
    durationSeconds: null,
    autoAdvanceMs: null,
    kicker: 'Hope You Have a Wonderful Day',
    heading: 'Scan to receive your gift.',
    subheading: 'A little something for you',
    camera: {
      position: [-0.35, 2.45, 4.35],
      lookAt: [-0.25, 0.85, 0],
      fov: 37,
    },
    sceneTargets: {
      envelopeOpacity: 0,
      flapOpenRatio: 1,
      cardRiseRatio: 1,
      bouquetScale: 0.92,
      bouquetOffsetX: -1.35,
      bouquetOffsetZ: -0.35,
      giftBoxScale: 0.95,
      giftBoxOpenRatio: 1,
      petalDriftSpeed: 0.18,
    },
  },
] as const;

export function getStepConfig(stepId: ExperienceStepId): ExperienceStepConfig {
  const found = EXPERIENCE_STEPS.find((s) => s.id === stepId);
  return found ?? EXPERIENCE_STEPS[0];
}

export function getStepByNumber(stepNumber: number): ExperienceStepConfig {
  const clamped = Math.max(1, Math.min(5, Math.round(stepNumber)));
  return EXPERIENCE_STEPS[clamped - 1];
}

export function getNextStepId(currentStepId: ExperienceStepId): ExperienceStepId {
  const idx = EXPERIENCE_STEPS.findIndex((s) => s.id === currentStepId);
  if (idx < 0 || idx >= EXPERIENCE_STEPS.length - 1) {
    return 'final_state';
  }
  return EXPERIENCE_STEPS[idx + 1].id;
}

export function skipToGiftStep(): ExperienceStepId {
  return 'final_state';
}

export function parseInitialStepFromSearch(search: string): ExperienceStepId {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const autostart = params.get('autostart');
  const stepParam = params.get('step');

  if (stepParam) {
    const byId = EXPERIENCE_STEPS.find((s) => s.id === stepParam);
    if (byId) return byId.id;
    const num = Number(stepParam);
    if (!Number.isNaN(num) && num >= 1 && num <= 5) {
      return getStepByNumber(num).id;
    }
  }

  if (autostart === '1' || autostart === 'true') {
    return 'flower_bloom';
  }

  return 'envelope';
}

export function computeExponentialDamp(
  current: number,
  target: number,
  lambda: number,
  dtSeconds: number,
): number {
  if (dtSeconds <= 0 || lambda <= 0) return current;
  const factor = 1 - Math.exp(-lambda * dtSeconds);
  return current + (target - current) * factor;
}

export function calculateTotalLeadInDurationSeconds(): number {
  return EXPERIENCE_STEPS.reduce((acc, step) => {
    return acc + (step.durationSeconds ?? 0);
  }, 0);
}

export interface QrValidationResult {
  valid: boolean;
  error?: string;
}

export function validateQrImageFile(file: {
  name: string;
  type: string;
  size: number;
}): QrValidationResult {
  if (!file || !file.name) {
    return { valid: false, error: 'Please select an image file.' };
  }
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
  const hasValidMime = allowedTypes.includes(file.type);
  const hasValidExt = /\.(png|jpe?g|webp|svg)$/i.test(file.name);
  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error: 'Unsupported format. Please select a PNG, JPG, WebP, or SVG QR image.',
    };
  }
  if (file.size <= 0) {
    return { valid: false, error: 'The selected image file is empty.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image file must be under 10 MB.' };
  }
  return { valid: true };
}
