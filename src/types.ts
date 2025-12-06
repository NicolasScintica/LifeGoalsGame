export type CategoryId =
  | 'career'
  | 'emotional'
  | 'health'
  | 'wealth'
  | 'relationships'
  | 'creativity';

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface MonthlyCategoryReview {
  id: string;
  year: number;
  month: number; // 1-12
  categoryId: CategoryId;
  xpScore: 0 | 1 | 2 | 3;
  whatIDid: string;
  whatImproved: string;
  whatFrustrated: string;
  nextMonthIntent: string;
}

export interface BonusQuest {
  id: string;
  date: string; // ISO date
  title: string;
  notes: string;
  xpAward: number; // 1-3
  categoryId?: CategoryId;
}

export type CapsuleEntryType = 'memory' | 'win' | 'lesson' | 'dream' | 'quote' | 'other';

export interface YearCapsuleEntry {
  id: string;
  date: string; // ISO
  year: number;
  categoryId?: CategoryId;
  type: CapsuleEntryType;
  tags: string[];
  content: string;
}

export interface CategoryGoal {
  id: string;
  year: number;
  categoryId: CategoryId;
  goalText: string;
}
