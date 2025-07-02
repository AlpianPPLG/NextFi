'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';

interface CategorySummaryProps {
  transactions: Transaction[];
}

export function CategorySummary({ transactions }: CategorySummaryProps) {
  const categoryAnalysis = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryStats = expenseTransactions.reduce((acc, transaction) => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          count: 0,
          icon: category?.icon || '📦',
          color: category?.color || '#64748b',
          percentage: 0,
          avgAmount: 0
        };
      }
      
      acc[categoryName].amount += transaction.amount;
      acc[categoryName].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate percentages and averages
    Object.values(categoryStats).forEach((category: any) => {
      category.percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
      category.avgAmount = category.amount / category.count;
    });

    const sortedCategories = Object.values(categoryStats)
      .sort((a: any, b: any) => b.amount - a.amount);

    return {
      categories: sortedCategories,
      totalExpenses,
      topCategory: sortedCategories[0] || null,
      categoryCount: sortedCategories.length
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const pieData = categoryAnalysis.categories.slice(0, 6).map((cat: any) => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {categoryAnalysis.categoryCount}
              </div>
              <div className="text-sm text-muted-foreground">Kategori Aktif</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(categoryAnalysis.totalExpenses)}
              </div>
              <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
            </div>
          </CardContent>
        </Card>

        {categoryAnalysis.topCategory && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-lg mb-1">{categoryAnalysis.topCategory.icon}</div>
                <div className="font-semibold">{categoryAnalysis.topCategory.name}</div>
                <div className="text-sm text-muted-foreground">
                  {categoryAnalysis.topCategory.percentage.toFixed(1)}% dari total
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryAnalysis.categories.slice(0, 8)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category List */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryAnalysis.categories.map((category: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.count} transaksi • Rata-rata: {formatCurrency(category.avgAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}