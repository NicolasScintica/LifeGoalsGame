import { CategoryConfig } from '../types';

export const categories: CategoryConfig[] = [
  { id: 'career', label: 'Career & Skills', icon: '💼', color: '#2563eb' },
  { id: 'emotional', label: 'Emotional & Mental', icon: '🧘', color: '#8b5cf6' },
  { id: 'health', label: 'Health & Body', icon: '🏋️', color: '#16a34a' },
  { id: 'wealth', label: 'Wealth & Money', icon: '💰', color: '#eab308' },
  { id: 'relationships', label: 'Relationships & Connection', icon: '🫶', color: '#f97316' },
  { id: 'creativity', label: 'Creativity & Projects', icon: '🎥', color: '#ec4899' },
];

export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  (typeof categories)[number]['id'],
  CategoryConfig
>;
