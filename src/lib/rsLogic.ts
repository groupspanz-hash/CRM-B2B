import { ActivityType, RelationshipLevel, CustomerStatus } from '../types';
import { ACTIVITY_POINTS, RS_LEVELS } from '../constants';
import { differenceInDays } from 'date-fns';

export const calculateRSLevel = (score: number): RelationshipLevel => {
  const sortedLevels = [...RS_LEVELS].sort((a, b) => b.min - a.min);
  for (const level of sortedLevels) {
    if (score >= level.min) return level.label as RelationshipLevel;
  }
  return 'Cold';
};

export const calculateProbabilityFromRS = (score: number, status: CustomerStatus): number => {
  if (status === 'Deal') return 100;
  if (status === 'Menolak') return 0;
  
  if (score < 50) return 15; // Stranger / Acquaintance range
  if (score < 100) return 40; // Warm Contact range
  if (score < 200) return 75; // Trusted range
  return 90; // Loyal range
};

export const getPointsForActivity = (type: ActivityType): number => {
  return ACTIVITY_POINTS[type] || 0;
};

export const calculateTimeDecay = (score: number, lastActivityDate: Date | null): number => {
  if (!lastActivityDate) return score;
  
  const daysSinceLastActivity = differenceInDays(new Date(), lastActivityDate);
  
  if (daysSinceLastActivity >= 60) return 0;
  if (daysSinceLastActivity >= 30) return Math.max(0, score - 15);
  if (daysSinceLastActivity >= 14) return Math.max(0, score - 5);
  
  return score;
};
