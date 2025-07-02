import { useState, useEffect, useMemo } from 'react';
import { Transaction, FinancialSummary, ChartData, MonthlyData } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';
import { useLocalStorage } from './useLocalStorage';

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [filter, setFilter] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    dateRange: 'all' as 'all' | 'week' | 'month' | 'year'
  });

  // Generate sample data on first load
  useEffect(() => {
    if (transactions.length === 0) {
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 5000000,
          category: 'salary',
          description: 'Gaji Bulanan',
          date: '2024-01-15',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'expense',
          amount: 150000,
          category: 'food',
          description: 'Makan siang',
          date: '2024-01-16',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'expense',
          amount: 50000,
          category: 'transport',
          description: 'Bensin motor',
          date: '2024-01-16',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          type: 'income',
          amount: 1500000,
          category: 'freelance',
          description: 'Project website',
          date: '2024-01-18',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          type: 'expense',
          amount: 200000,
          category: 'entertainment',
          description: 'Nonton bioskop',
          date: '2024-01-20',
          createdAt: new Date().toISOString()
        }
      ];
      setTransactions(sampleTransactions);
    }
  }, [transactions.length, setTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const typeMatch = filter.type === 'all' || transaction.type === filter.type;
      const categoryMatch = filter.category === 'all' || transaction.category === filter.category;
      
      let dateMatch = true;
      if (filter.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const diffTime = now.getTime() - transactionDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filter.dateRange) {
          case 'week':
            dateMatch = diffDays <= 7;
            break;
          case 'month':
            dateMatch = diffDays <= 30;
            break;
          case 'year':
            dateMatch = diffDays <= 365;
            break;
        }
      }
      
      return typeMatch && categoryMatch && dateMatch;
    });
  }, [transactions, filter]);

  const financialSummary: FinancialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const expenseChartData: ChartData[] = useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = allCategories.find(c => c.id === categoryId);
      return {
        name: category?.name || categoryId,
        value: amount,
        color: category?.color || '#64748b'
      };
    });
  }, [transactions]);

  const monthlyData: MonthlyData[] = useMemo(() => {
    const monthlyStats = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, MonthlyData>);

    return Object.values(monthlyStats).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    financialSummary,
    expenseChartData,
    monthlyData,
    filter,
    setFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}