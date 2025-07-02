'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryStats = transactions.reduce((acc, transaction) => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          income: 0,
          expense: 0,
          total: 0,
          icon: category?.icon || '📦',
          color: category?.color || '#64748b'
        };
      }
      
      if (transaction.type === 'income') {
        acc[categoryName].income += transaction.amount;
      } else {
        acc[categoryName].expense += transaction.amount;
      }
      acc[categoryName].total += transaction.amount;
      
      return acc;
    }, {} as Record<string, any>);

    const categoryData = Object.values(categoryStats)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 8);

    // Monthly breakdown
    const monthlyStats = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const monthlyData = Object.values(monthlyStats)
      .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6);

    // Top expense categories for pie chart
    const expenseCategories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = allCategories.find(c => c.id === transaction.category);
        const categoryName = category?.name || transaction.category;
        
        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            value: 0,
            color: category?.color || '#64748b'
          };
        }
        acc[categoryName].value += transaction.amount;
        return acc;
      }, {} as Record<string, any>);

    const pieData = Object.values(expenseCategories)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 6);

    return {
      totalIncome,
      totalExpenses,
      categoryData,
      monthlyData,
      pieData,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categoryData.slice(0, 5).map((category: any, index: number) => {
              const percentage = stats.totalExpenses > 0 
                ? (category.expense / stats.totalExpenses) * 100 
                : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(category.expense)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expense Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tren Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}