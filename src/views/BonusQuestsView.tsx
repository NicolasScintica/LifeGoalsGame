import { useMemo, useState } from 'react';
import type { BonusQuest, CategoryConfig, CategoryId } from '../types';
import { formatDate } from '../utils/date';

interface Props {
  categories: CategoryConfig[];
  bonusQuests: BonusQuest[];
  onAdd: (quest: Omit<BonusQuest, 'id'>) => void;
  onDelete: (id: string) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const BonusQuestsView = ({ categories, bonusQuests, onAdd, onDelete }: Props) => {
  const [form, setForm] = useState<Omit<BonusQuest, 'id'>>({
    date: todayIso(),
    title: '',
    notes: '',
    xpAward: 1,
    categoryId: undefined,
  });

  const sortedQuests = useMemo(
    () => [...bonusQuests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [bonusQuests]
  );

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, xpAward: Math.min(3, Math.max(1, Number(form.xpAward))) });
    setForm({ ...form, title: '', notes: '' });
  };

  return (
    <div className="stack">
      <div className="card">
        <h3>Add a bonus quest</h3>
        <div className="summary-row">
          <div className="stack">
            <label className="small-label">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="stack">
            <label className="small-label">Title</label>
            <input
              value={form.title}
              placeholder="Finished a mini-course, helped a friend..."
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="stack">
            <label className="small-label">XP</label>
            <input
              type="number"
              min={1}
              max={3}
              value={form.xpAward}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, xpAward: Math.min(3, Math.max(1, Number(e.target.value))) }))
              }
            />
          </div>
          <div className="stack">
            <label className="small-label">Category (optional)</label>
            <select
              value={form.categoryId ?? ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoryId: (e.target.value || undefined) as CategoryId }))
              }
            >
              <option value="">Unassigned</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="stack" style={{ marginTop: '0.5rem' }}>
          <label className="small-label">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            placeholder="What made this quest meaningful?"
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
          <div>
            <button className="primary" onClick={handleSubmit}>
              Add quest
            </button>
          </div>
        </div>
      </div>

      <div className="stack">
        <div className="section-heading">
          <h3>Quest log</h3>
          <span className="text-muted">Newest first</span>
        </div>
        <div className="entry-list">
          {sortedQuests.length === 0 && <p className="text-muted">No quests logged yet.</p>}
          {sortedQuests.map((quest) => {
            const category = quest.categoryId
              ? categories.find((c) => c.id === quest.categoryId)
              : undefined;
            return (
              <div className="entry-item" key={quest.id}>
                <div className="flex-between">
                  <div className="stack">
                    <strong>{quest.title}</strong>
                    <span className="text-muted">{formatDate(quest.date)}</span>
                  </div>
                  <div className="inline-input">
                    {category && <span className="badge">{category.label}</span>}
                    <span className="badge">+{quest.xpAward} XP</span>
                    <button className="ghost" onClick={() => onDelete(quest.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                {quest.notes && <p className="text-muted">{quest.notes}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BonusQuestsView;
