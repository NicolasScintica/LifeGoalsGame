import { useMemo } from 'react';
import type {
  BonusQuest,
  CategoryConfig,
  CategoryGoal,
  CategoryId,
  MonthlyCategoryReview,
} from '../types';

interface Props {
  year: number;
  categories: CategoryConfig[];
  monthlyReviews: MonthlyCategoryReview[];
  bonusQuests: BonusQuest[];
  categoryGoals: CategoryGoal[];
  onGoalChange: (year: number, categoryId: CategoryId, goal: string) => void;
}

const getLabelForAverage = (avg: number) => {
  if (avg >= 2.5) return 'Breakthrough';
  if (avg >= 2.0) return 'Growing';
  if (avg >= 1.0) return 'Stable';
  return 'Needs love';
};

const GoalField = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
}) => (
  <div className="stack">
    <span className="small-label">Anchor goal</span>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Anchor goal"
    />
  </div>
);

const DashboardView = ({
  year,
  categories,
  monthlyReviews,
  bonusQuests,
  categoryGoals,
  onGoalChange,
}: Props) => {
  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const reviewsForYear = monthlyReviews.filter(
        (r) => r.year === year && r.categoryId === category.id
      );
      const monthsWithReview = new Set(reviewsForYear.map((r) => r.month)).size;
      const monthlyXpTotal = reviewsForYear.reduce((acc, r) => acc + r.xpScore, 0);

      const bonusXp = bonusQuests
        .filter((q) => q.categoryId === category.id && new Date(q.date).getFullYear() === year)
        .reduce((acc, q) => acc + q.xpAward, 0);

      const average = monthsWithReview > 0 ? monthlyXpTotal / monthsWithReview : 0;
      return {
        category,
        monthlyXpTotal,
        bonusXp,
        totalXp: monthlyXpTotal + bonusXp,
        average,
        label: getLabelForAverage(average),
      };
    });
  }, [bonusQuests, categories, monthlyReviews, year]);

  const summary = useMemo(() => {
    const totalXp = categoryStats.reduce((acc, s) => acc + s.totalXp, 0);
    const most = [...categoryStats].sort((a, b) => b.totalXp - a.totalXp)[0];
    const least = [...categoryStats].sort((a, b) => a.totalXp - b.totalXp)[0];
    return {
      totalXp,
      most,
      least,
    };
  }, [categoryStats]);

  return (
    <div className="stack">
      <p className="text-muted">Quick glance for {year}</p>
      <div className="card-grid">
        {categoryStats.map((stat) => {
          const goal = categoryGoals.find(
            (g) => g.categoryId === stat.category.id && g.year === year
          );
          return (
            <div className="card" key={stat.category.id}>
              <div className="card-header">
                <div className="chip" style={{ background: `${stat.category.color}14` }}>
                  <span>{stat.category.icon}</span>
                  <strong style={{ color: stat.category.color }}>{stat.category.label}</strong>
                </div>
                <span className="badge">{stat.totalXp} XP</span>
              </div>

              <GoalField
                value={goal?.goalText ?? ''}
                placeholder={`Goal for ${year}`}
                onChange={(text) => onGoalChange(year, stat.category.id, text)}
              />

              <div className="summary-row" style={{ marginTop: '0.75rem' }}>
                <div className="stack">
                  <span className="small-label">Monthly XP</span>
                  <strong>{stat.monthlyXpTotal}</strong>
                </div>
                <div className="stack">
                  <span className="small-label">Bonus XP</span>
                  <strong>{stat.bonusXp}</strong>
                </div>
                <div className="stack">
                  <span className="small-label">Average per month</span>
                  <strong>{stat.average.toFixed(2)}</strong>
                  <span className="text-muted">{stat.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="summary-row">
          <div className="stack">
            <span className="small-label">Total XP this year</span>
            <strong>{summary.totalXp}</strong>
          </div>
          <div className="stack">
            <span className="small-label">Most leveled up category</span>
            <strong>{summary.most ? summary.most.category.label : '—'}</strong>
          </div>
          <div className="stack">
            <span className="small-label">Category that needs attention</span>
            <strong>{summary.least ? summary.least.category.label : '—'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
