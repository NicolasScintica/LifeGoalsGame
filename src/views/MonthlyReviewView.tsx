import { useMemo } from 'react';
import type { CategoryConfig, CategoryId, MonthlyCategoryReview } from '../types';
import { formatMonthLabel } from '../utils/date';

interface Props {
  year: number;
  month: number;
  categories: CategoryConfig[];
  monthlyReviews: MonthlyCategoryReview[];
  onMonthChange: (month: number) => void;
  onUpdateReview: (
    year: number,
    month: number,
    categoryId: CategoryId,
    updates: Partial<Omit<MonthlyCategoryReview, 'year' | 'month' | 'categoryId'>>
  ) => void;
}

const xpValues: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

const MonthlyReviewView = ({
  year,
  month,
  categories,
  monthlyReviews,
  onMonthChange,
  onUpdateReview,
}: Props) => {
  const reviewsForMonth = useMemo(
    () =>
      categories.map((category) => {
        const review = monthlyReviews.find(
          (r) => r.year === year && r.month === month && r.categoryId === category.id
        );
        return (
          review ?? {
            id: `${year}-${month}-${category.id}`,
            year,
            month,
            categoryId: category.id,
            xpScore: 0,
            whatIDid: '',
            whatImproved: '',
            whatFrustrated: '',
            nextMonthIntent: '',
          }
        );
      }),
    [categories, month, monthlyReviews, year]
  );

  const summary = useMemo(() => {
    const totalXp = reviewsForMonth.reduce((acc, r) => acc + r.xpScore, 0);
    const sorted = [...reviewsForMonth].sort((a, b) => b.xpScore - a.xpScore);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    return {
      totalXp,
      strongest,
      weakest,
    };
  }, [reviewsForMonth]);

  return (
    <div className="stack">
      <div className="inline-input" style={{ gap: '1rem' }}>
        <div className="stack" style={{ minWidth: '160px' }}>
          <label className="small-label">Month</label>
          <select value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {formatMonthLabel(idx + 1)}
              </option>
            ))}
          </select>
        </div>
        <div className="stack">
          <p className="text-muted">
            Rate each category from 0-3 XP and jot a few notes. Scores and notes save instantly.
          </p>
        </div>
      </div>

      <div className="card-grid">
        {reviewsForMonth.map((review) => {
          const category = categories.find((c) => c.id === review.categoryId)!;
          return (
            <div className="card" key={review.categoryId}>
              <div className="card-header">
                <div className="chip" style={{ background: `${category.color}14` }}>
                  <span>{category.icon}</span>
                  <strong style={{ color: category.color }}>{category.label}</strong>
                </div>
                <span className="badge">{review.xpScore} XP</span>
              </div>

              <div className="stack">
                <span className="small-label">XP score</span>
                <div className="xp-buttons">
                  {xpValues.map((value) => (
                    <button
                      key={value}
                      className={value === review.xpScore ? 'xp-button active' : 'xp-button'}
                      onClick={() => onUpdateReview(year, month, category.id, { xpScore: value })}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <label className="small-label">What did I do this month?</label>
                <textarea
                  rows={2}
                  value={review.whatIDid}
                  placeholder="Projects, habits, experiments"
                  onChange={(e) =>
                    onUpdateReview(year, month, category.id, { whatIDid: e.target.value })
                  }
                />

                <label className="small-label">What improved?</label>
                <textarea
                  rows={2}
                  value={review.whatImproved}
                  placeholder="Wins and micro-improvements"
                  onChange={(e) =>
                    onUpdateReview(year, month, category.id, { whatImproved: e.target.value })
                  }
                />

                <label className="small-label">What frustrated me?</label>
                <textarea
                  rows={2}
                  value={review.whatFrustrated}
                  placeholder="Stuck points or friction"
                  onChange={(e) =>
                    onUpdateReview(year, month, category.id, { whatFrustrated: e.target.value })
                  }
                />

                <label className="small-label">Next month, I want to...</label>
                <textarea
                  rows={2}
                  value={review.nextMonthIntent}
                  placeholder="One tiny intention"
                  onChange={(e) =>
                    onUpdateReview(year, month, category.id, { nextMonthIntent: e.target.value })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="summary-row">
          <div className="stack">
            <span className="small-label">Total XP this month</span>
            <strong>{summary.totalXp}</strong>
          </div>
          <div className="stack">
            <span className="small-label">Strongest category</span>
            <strong>
              {summary.strongest
                ? `${categories.find((c) => c.id === summary.strongest?.categoryId)?.label}`
                : '—'}
            </strong>
          </div>
          <div className="stack">
            <span className="small-label">Weakest category</span>
            <strong>
              {summary.weakest
                ? `${categories.find((c) => c.id === summary.weakest?.categoryId)?.label}`
                : '—'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReviewView;
