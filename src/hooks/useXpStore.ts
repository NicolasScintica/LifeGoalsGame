import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories } from '../constants/categories';
import type {
  BonusQuest,
  CategoryGoal,
  CategoryId,
  MonthlyCategoryReview,
  YearCapsuleEntry,
} from '../types';
import { createId } from '../utils/id';

const STORAGE_KEY = 'xp_tracker_state_v1';

interface XpState {
  monthlyReviews: MonthlyCategoryReview[];
  bonusQuests: BonusQuest[];
  capsuleEntries: YearCapsuleEntry[];
  categoryGoals: CategoryGoal[];
}

const defaultState: XpState = {
  monthlyReviews: [],
  bonusQuests: [],
  capsuleEntries: [],
  categoryGoals: categories.map((c) => ({
    id: createId(),
    year: new Date().getFullYear(),
    categoryId: c.id,
    goalText: '',
  })),
};

const clampXpScore = (value: number): 0 | 1 | 2 | 3 => {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  return 3;
};

const clampQuestXp = (value: number): number => {
  if (value < 1) return 1;
  if (value > 3) return 3;
  return value;
};

const safeLoadState = (): XpState => {
  if (typeof window === 'undefined') return defaultState;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState;
  try {
    const parsed = JSON.parse(saved) as XpState;
    return {
      monthlyReviews: parsed.monthlyReviews ?? [],
      bonusQuests: parsed.bonusQuests ?? [],
      capsuleEntries: parsed.capsuleEntries ?? [],
      categoryGoals: parsed.categoryGoals ?? [],
    };
  } catch (e) {
    console.error('Failed to parse saved state', e);
    return defaultState;
  }
};

export const useXpStore = () => {
  const [state, setState] = useState<XpState>(() => safeLoadState());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const upsertMonthlyReview = useCallback(
    (
      year: number,
      month: number,
      categoryId: CategoryId,
      updates: Partial<Omit<MonthlyCategoryReview, 'year' | 'month' | 'categoryId'>> & { xpScore?: number }
    ) => {
      setState((prev) => {
        const existingIndex = prev.monthlyReviews.findIndex(
          (r) => r.year === year && r.month === month && r.categoryId === categoryId
        );
        const baseReview: MonthlyCategoryReview = {
          id: createId(),
          year,
          month,
          categoryId,
          xpScore: 0,
          whatIDid: '',
          whatImproved: '',
          whatFrustrated: '',
          nextMonthIntent: '',
        };

        const updatedReview: MonthlyCategoryReview = {
          ...(existingIndex >= 0 ? prev.monthlyReviews[existingIndex] : baseReview),
          ...updates,
          xpScore:
            updates.xpScore !== undefined
              ? clampXpScore(updates.xpScore)
              : existingIndex >= 0
              ? prev.monthlyReviews[existingIndex].xpScore
              : 0,
        } as MonthlyCategoryReview;

        const nextReviews = [...prev.monthlyReviews];
        if (existingIndex >= 0) {
          nextReviews[existingIndex] = updatedReview;
        } else {
          nextReviews.push(updatedReview);
        }

        return { ...prev, monthlyReviews: nextReviews };
      });
    },
    []
  );

  const deleteMonthlyReview = useCallback((id: string) => {
    setState((prev) => ({ ...prev, monthlyReviews: prev.monthlyReviews.filter((r) => r.id !== id) }));
  }, []);

  const setCategoryGoal = useCallback((year: number, categoryId: CategoryId, goalText: string) => {
    setState((prev) => {
      const existingIndex = prev.categoryGoals.findIndex(
        (g) => g.year === year && g.categoryId === categoryId
      );
      const goal: CategoryGoal = {
        id: existingIndex >= 0 ? prev.categoryGoals[existingIndex].id : createId(),
        year,
        categoryId,
        goalText,
      };
      const nextGoals = [...prev.categoryGoals];
      if (existingIndex >= 0) {
        nextGoals[existingIndex] = goal;
      } else {
        nextGoals.push(goal);
      }
      return { ...prev, categoryGoals: nextGoals };
    });
  }, []);

  const addBonusQuest = useCallback(
    (quest: Omit<BonusQuest, 'id'>) => {
      setState((prev) => ({
        ...prev,
        bonusQuests: [
          {
            ...quest,
            xpAward: clampQuestXp(quest.xpAward),
            id: createId(),
          },
          ...prev.bonusQuests,
        ],
      }));
    },
    []
  );

  const deleteBonusQuest = useCallback((id: string) => {
    setState((prev) => ({ ...prev, bonusQuests: prev.bonusQuests.filter((q) => q.id !== id) }));
  }, []);

  const addCapsuleEntry = useCallback(
    (entry: Omit<YearCapsuleEntry, 'id'>) => {
      setState((prev) => ({
        ...prev,
        capsuleEntries: [{ ...entry, id: createId() }, ...prev.capsuleEntries],
      }));
    },
    []
  );

  const deleteCapsuleEntry = useCallback((id: string) => {
    setState((prev) => ({ ...prev, capsuleEntries: prev.capsuleEntries.filter((c) => c.id !== id) }));
  }, []);

  const derived = useMemo(
    () => ({
      ...state,
    }),
    [state]
  );

  return {
    ...derived,
    upsertMonthlyReview,
    deleteMonthlyReview,
    setCategoryGoal,
    addBonusQuest,
    deleteBonusQuest,
    addCapsuleEntry,
    deleteCapsuleEntry,
  };
};
