import { Category } from '@/components/types/transaction';

export const expenseCategories: Category[] = [
  {
    id: 'food',
    name: 'Makanan & Minuman',
    icon: '🍽️',
    color: '#ef4444',
    type: 'expense'
  },
  {
    id: 'transport',
    name: 'Transportasi',
    icon: '🚗',
    color: '#3b82f6',
    type: 'expense'
  },
  {
    id: 'entertainment',
    name: 'Hiburan',
    icon: '🎬',
    color: '#8b5cf6',
    type: 'expense'
  },
  {
    id: 'shopping',
    name: 'Belanja',
    icon: '🛍️',
    color: '#ec4899',
    type: 'expense'
  },
  {
    id: 'health',
    name: 'Kesehatan',
    icon: '🏥',
    color: '#10b981',
    type: 'expense'
  },
  {
    id: 'education',
    name: 'Pendidikan',
    icon: '📚',
    color: '#f59e0b',
    type: 'expense'
  },
  {
    id: 'utilities',
    name: 'Tagihan',
    icon: '💡',
    color: '#6b7280',
    type: 'expense'
  },
  {
    id: 'other',
    name: 'Lainnya',
    icon: '📦',
    color: '#64748b',
    type: 'expense'
  }
];

export const incomeCategories: Category[] = [
  {
    id: 'salary',
    name: 'Gaji',
    icon: '💼',
    color: '#059669',
    type: 'income'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: '#0891b2',
    type: 'income'
  },
  {
    id: 'investment',
    name: 'Investasi',
    icon: '📈',
    color: '#7c3aed',
    type: 'income'
  },
  {
    id: 'business',
    name: 'Bisnis',
    icon: '🏢',
    color: '#dc2626',
    type: 'income'
  },
  {
    id: 'gift',
    name: 'Hadiah',
    icon: '🎁',
    color: '#ea580c',
    type: 'income'
  },
  {
    id: 'other-income',
    name: 'Lainnya',
    icon: '💰',
    color: '#16a34a',
    type: 'income'
  }
];

export const allCategories = [...expenseCategories, ...incomeCategories];