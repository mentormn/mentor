import { FormalTier, TierConfig } from '../types';

export const TIER_CONFIGS: Record<FormalTier, TierConfig> = {
  JUNIOR_MENTOR: {
    tier: 'JUNIOR_MENTOR',
    titleEn: 'Junior Mentor',
    titleMn: 'Дагалдан Ментор',
    minXp: 0,
    minClasses: 1,
    minStudents: 1,
    colorHex: '#3B82F6',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    description: 'Initial peer mentor guiding their first cohort of students through a focused sprint.',
  },
  SENIOR_MENTOR: {
    tier: 'SENIOR_MENTOR',
    titleEn: 'Senior Mentor',
    titleMn: 'Ахлах Ментор',
    minXp: 150,
    minClasses: 3,
    minStudents: 6,
    colorHex: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Experienced mentor with verified deliverable approvals and multiple completed sprint cohorts.',
  },
  MASTER_MENTOR: {
    tier: 'MASTER_MENTOR',
    titleEn: 'Master Mentor',
    titleMn: 'Мастер Ментор',
    minXp: 500,
    minClasses: 10,
    minStudents: 25,
    colorHex: '#8B5CF6',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    description: 'High-impact educator recognized for advanced curriculum mastery and significant rural knowledge transfer.',
  },
  NATIONAL_LAUREATE: {
    tier: 'NATIONAL_LAUREATE',
    titleEn: 'National Laureate Mentor',
    titleMn: 'Үндэсний Лауреат Ментор',
    minXp: 1500,
    minClasses: 25,
    minStudents: 60,
    colorHex: '#F59E0B',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
    description: 'Highest national civic distinction co-certified by the Ministry of Education for nationwide pedagogical leadership.',
  },
};

const TIER_ORDER: FormalTier[] = [
  'JUNIOR_MENTOR',
  'SENIOR_MENTOR',
  'MASTER_MENTOR',
  'NATIONAL_LAUREATE',
];

/**
 * Deterministically computes the mentor's tier based on XP, completed classes, and total students.
 */
export function calculateMentorTier(
  xp: number,
  completedClasses: number,
  studentsMentored: number
): FormalTier {
  if (
    xp >= TIER_CONFIGS.NATIONAL_LAUREATE.minXp &&
    completedClasses >= TIER_CONFIGS.NATIONAL_LAUREATE.minClasses &&
    studentsMentored >= TIER_CONFIGS.NATIONAL_LAUREATE.minStudents
  ) {
    return 'NATIONAL_LAUREATE';
  }
  if (
    xp >= TIER_CONFIGS.MASTER_MENTOR.minXp &&
    completedClasses >= TIER_CONFIGS.MASTER_MENTOR.minClasses &&
    studentsMentored >= TIER_CONFIGS.MASTER_MENTOR.minStudents
  ) {
    return 'MASTER_MENTOR';
  }
  if (
    xp >= TIER_CONFIGS.SENIOR_MENTOR.minXp &&
    completedClasses >= TIER_CONFIGS.SENIOR_MENTOR.minClasses &&
    studentsMentored >= TIER_CONFIGS.SENIOR_MENTOR.minStudents
  ) {
    return 'SENIOR_MENTOR';
  }
  return 'JUNIOR_MENTOR';
}

/**
 * Returns progression toward the next formal tier.
 */
export function getNextTierProgress(
  currentXp: number,
  currentTier: FormalTier
): {
  nextTier: FormalTier | null;
  progressPercent: number;
  xpNeeded: number;
  nextTierConfig: TierConfig | null;
} {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex === TIER_ORDER.length - 1) {
    return {
      nextTier: null,
      progressPercent: 100,
      xpNeeded: 0,
      nextTierConfig: null,
    };
  }

  const nextTierKey = TIER_ORDER[currentIndex + 1];
  const nextConfig = TIER_CONFIGS[nextTierKey];
  const currentConfig = TIER_CONFIGS[currentTier];

  const xpRange = nextConfig.minXp - currentConfig.minXp;
  const currentProgress = Math.max(0, currentXp - currentConfig.minXp);
  const progressPercent = Math.min(100, Math.round((currentProgress / xpRange) * 100));
  const xpNeeded = Math.max(0, nextConfig.minXp - currentXp);

  return {
    nextTier: nextTierKey,
    progressPercent,
    xpNeeded,
    nextTierConfig: nextConfig,
  };
}

/**
 * Calculates XP earned when a sprint class finishes and deliverables are approved.
 * Base XP + per-student XP + deliverable bonus.
 */
export function calculateSprintXp(
  seatsCount: number,
  durationWeeks: number,
  deliverablesApprovedCount: number
): number {
  const baseSessionXp = durationWeeks * 20; // 20 XP per week
  const studentXp = seatsCount * 15;        // 15 XP per student taught
  const deliverableXp = deliverablesApprovedCount * 25; // 25 XP per verified deliverable
  return baseSessionXp + studentXp + deliverableXp;
}
