import { useEffect, useMemo, useState } from 'react';
import type { CapsuleEntryType, CategoryConfig, CategoryId, YearCapsuleEntry } from '../types';
import { formatDate, formatMonthLabel } from '../utils/date';

interface Props {
  categories: CategoryConfig[];
  entries: YearCapsuleEntry[];
  onAdd: (entry: Omit<YearCapsuleEntry, 'id'>) => void;
  onDelete: (id: string) => void;
  year: number;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const entryTypes: { value: CapsuleEntryType; label: string; icon: string }[] = [
  { value: 'memory', label: 'Memory', icon: '🧠' },
  { value: 'win', label: 'Win', icon: '🏆' },
  { value: 'lesson', label: 'Lesson', icon: '📘' },
  { value: 'dream', label: 'Dream', icon: '💭' },
  { value: 'quote', label: 'Quote', icon: '📝' },
  { value: 'other', label: 'Other', icon: '✨' },
];

const YearCapsuleView = ({ categories, entries, onAdd, onDelete, year }: Props) => {
  const [form, setForm] = useState<Omit<YearCapsuleEntry, 'id'>>({
    date: todayIso(),
    year,
    categoryId: undefined,
    type: 'memory',
    tags: [],
    content: '',
  });
  const [filters, setFilters] = useState<{
    year: number | 'all';
    type: CapsuleEntryType | 'all';
    category: CategoryId | 'all';
    search: string;
  }>({ year: 'all', type: 'all', category: 'all', search: '' });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleSubmit = () => {
    if (!form.content.trim()) return;
    onAdd({ ...form, year });
    setForm({ ...form, content: '', tags: [], date: todayIso(), type: 'memory', categoryId: undefined });
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, year }));
  }, [year]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => (filters.year === 'all' ? true : entry.year === filters.year))
      .filter((entry) => (filters.type === 'all' ? true : entry.type === filters.type))
      .filter((entry) => (filters.category === 'all' ? true : entry.categoryId === filters.category))
      .filter((entry) => {
        const term = filters.search.toLowerCase();
        if (!term) return true;
        return (
          entry.content.toLowerCase().includes(term) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, filters]);

  const grouped = useMemo(() => {
    const map = new Map<number, YearCapsuleEntry[]>();
    filteredEntries.forEach((entry) => {
      const month = new Date(entry.date).getMonth() + 1;
      const bucket = map.get(month) ?? [];
      bucket.push(entry);
      map.set(month, bucket);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filteredEntries]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const tagsAsString = form.tags.join(', ');

  return (
    <div className="stack">
      <div className="card">
        <h3>Add to your capsule</h3>
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
            <label className="small-label">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as CapsuleEntryType }))}
            >
              {entryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
          <div className="stack">
            <label className="small-label">Tags (comma separated)</label>
            <input
              value={tagsAsString}
              placeholder="joy, travel, idea"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>
        </div>
        <div className="stack" style={{ marginTop: '0.5rem' }}>
          <label className="small-label">Content</label>
          <textarea
            rows={3}
            value={form.content}
            placeholder="Drop a memory, lesson, quote, or small win."
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          />
          <div>
            <button className="primary" onClick={handleSubmit}>
              Add entry
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <h3>Filters</h3>
          <span className="text-muted">Search by year, type, category, or tags</span>
        </div>
        <div className="filter-bar">
          <select
            value={filters.year === 'all' ? 'all' : filters.year}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                year: e.target.value === 'all' ? 'all' : Number(e.target.value),
              }))
            }
          >
            <option value="all">All years</option>
            {Array.from(new Set(entries.map((e) => e.year))).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
          >
            <option value="all">All types</option>
            {entryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: (e.target.value as CategoryId | 'all') }))
            }
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            placeholder="Search content or tags"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="stack">
        {grouped.length === 0 && <p className="text-muted">No capsule entries yet.</p>}
        {grouped.map(([month, monthEntries]) => (
          <div key={month} className="card">
            <div className="section-heading">
              <h3>{formatMonthLabel(month)}</h3>
              <span className="text-muted">{monthEntries.length} item(s)</span>
            </div>
            <div className="entry-list">
              {monthEntries.map((entry) => {
                const typeConfig = entryTypes.find((t) => t.value === entry.type)!;
                const category = entry.categoryId
                  ? categories.find((c) => c.id === entry.categoryId)
                  : undefined;
                const isExpanded = expanded.has(entry.id);
                return (
                  <div className="entry-item" key={entry.id}>
                    <div className="flex-between">
                      <div className="stack">
                        <strong>
                          {typeConfig.icon} {typeConfig.label}
                        </strong>
                        <span className="text-muted">{formatDate(entry.date)}</span>
                      </div>
                      <div className="inline-input">
                        {category && <span className="badge">{category.label}</span>}
                        <button className="ghost" onClick={() => toggleExpanded(entry.id)}>
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button className="ghost" onClick={() => onDelete(entry.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.35rem' }}>
                      {entry.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {isExpanded ? (
                      <p>{entry.content}</p>
                    ) : (
                      <p className="text-muted">
                        {entry.content.length > 160
                          ? `${entry.content.slice(0, 160)}...`
                          : entry.content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearCapsuleView;
