'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';
import { PieChart as PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';

interface CategoryReportProps {
  transactions: Transaction[];
}

export function CategoryReport({ transactions }: CategoryReportProps) {
  const categoryAnalysis = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Expense categories analysis
    const expenseStats = expenseTransactions.reduce((acc, transaction) => {
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
          avgAmount: 0,
          maxAmount: 0,
          minAmount: Infinity
        };
      }
      
      acc[categoryName].amount += transaction.amount;
      acc[categoryName].count += 1;
      acc[categoryName].maxAmount = Math.max(acc[categoryName].maxAmount, transaction.amount);
      acc[categoryName].minAmount = Math.min(acc[categoryName].minAmount, transaction.amount);
      
      return acc;
    }, {} as Record<string, any>);

    // Income categories analysis
    const incomeStats = incomeTransactions.reduce((acc, transaction) => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          count: 0,
          icon: category?.icon || '💰',
          color: category?.color || '#10b981',
          percentage: 0,
          avgAmount: 0
        };
      }
      
      acc[categoryName].amount += transaction.amount;
      acc[categoryName].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate percentages and averages
    Object.values(expenseStats).forEach((category: any) => {
      category.percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
      category.avgAmount = category.amount / category.count;
      if (category.minAmount === Infinity) category.minAmount = 0;
    });

    Object.values(incomeStats).forEach((category: any) => {
      category.percentage = totalIncome > 0 ? (category.amount / totalIncome) * 100 : 0;
      category.avgAmount = category.amount / category.count;
    });

    const sortedExpenseCategories = Object.values(expenseStats)
      .sort((a: any, b: any) => b.amount - a.amount);

    const sortedIncomeCategories = Object.values(incomeStats)
      .sort((a: any, b: any) => b.amount - a.amount);

    return {
      expenseCategories: sortedExpenseCategories,
      incomeCategories: sortedIncomeCategories,
      totalExpenses,
      totalIncome,
      topExpenseCategory: sortedExpenseCategories[0] || null,
      topIncomeCategory: sortedIncomeCategories[0] || null
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const expensePieData = categoryAnalysis.expenseCategories.slice(0, 8).map((cat: any) => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color
  }));

  const incomePieData = categoryAnalysis.incomeCategories.slice(0, 6).map((cat: any) => ({
    name: cat.name,
    value: cat.amount,
    color: cat.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name || payload[0].payload.name}</p>
          <p style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value || payload[0].payload.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {categoryAnalysis.expenseCategories.length}
            </div>
            <div className="text-sm text-muted-foreground">Kategori Pengeluaran</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {categoryAnalysis.incomeCategories.length}
            </div>
            <div className="text-sm text-muted-foreground">Kategori Pemasukan</div>
          </CardContent>
        </Card>

        {categoryAnalysis.topExpenseCategory && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg mb-1">{categoryAnalysis.topExpenseCategory.icon}</div>
              <div className="font-semibold text-sm">{categoryAnalysis.topExpenseCategory.name}</div>
              <div className="text-xs text-muted-foreground">
                {categoryAnalysis.topExpenseCategory.percentage.toFixed(1)}% pengeluaran
              </div>
            </CardContent>
          </Card>
        )}

        {categoryAnalysis.topIncomeCategory && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg mb-1">{categoryAnalysis.topIncomeCategory.icon}</div>
              <div className="font-semibold text-sm">{categoryAnalysis.topIncomeCategory.name}</div>
              <div className="text-xs text-muted-foreground">
                {categoryAnalysis.topIncomeCategory.percentage.toFixed(1)}% pemasukan
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-red-600" />
              Distribusi Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Income Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-600" />
              Distribusi Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Perbandingan Kategori Pengeluaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAnalysis.expenseCategories.slice(0, 10)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              Detail Kategori Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categoryAnalysis.expenseCategories.map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.count} transaksi
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
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>Rata-rata: {formatCurrency(category.avgAmount)}</div>
                    <div>Max: {formatCurrency(category.maxAmount)}</div>
                    <div>Min: {formatCurrency(category.minAmount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Categories Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Detail Kategori Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categoryAnalysis.incomeCategories.map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.count} transaksi
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
                  <div className="text-xs text-muted-foreground">
                    Rata-rata: {formatCurrency(category.avgAmount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}