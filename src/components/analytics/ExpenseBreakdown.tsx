'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ExpenseBreakdownProps {
  transactions: Transaction[];
}

export function ExpenseBreakdown({ transactions }: ExpenseBreakdownProps) {
  const breakdownData = useMemo(() => {
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth.getMonth() && 
             transactionDate.getFullYear() === currentMonth.getFullYear() &&
             t.type === 'expense';
    });
    
    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === lastMonth.getMonth() && 
             transactionDate.getFullYear() === lastMonth.getFullYear() &&
             t.type === 'expense';
    });

    const currentTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const lastTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown for current month
    const categoryBreakdown = currentMonthTransactions.reduce((acc, transaction) => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          current: 0,
          last: 0,
          icon: category?.icon || '📦',
          color: category?.color || '#64748b',
          transactions: 0
        };
      }
      
      acc[categoryName].current += transaction.amount;
      acc[categoryName].transactions += 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Add last month data
    lastMonthTransactions.forEach(transaction => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName].last += transaction.amount;
      } else {
        categoryBreakdown[categoryName] = {
          name: categoryName,
          current: 0,
          last: transaction.amount,
          icon: category?.icon || '📦',
          color: category?.color || '#64748b',
          transactions: 0
        };
      }
    });

    // Calculate percentages and changes
    const categories = Object.values(categoryBreakdown).map((cat: any) => ({
      ...cat,
      percentage: currentTotal > 0 ? (cat.current / currentTotal) * 100 : 0,
      change: cat.last > 0 ? ((cat.current - cat.last) / cat.last) * 100 : 0,
      value: cat.current // For pie chart
    })).sort((a: any, b: any) => b.current - a.current);

    // Pie chart data
    const pieData = categories.filter((cat: any) => cat.current > 0).map((cat: any) => ({
      name: cat.name,
      value: cat.current,
      color: cat.color
    }));

    return {
      categories,
      currentTotal,
      lastTotal,
      totalChange: lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0,
      pieData
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name || payload[0].payload.name}</p>
          <p>{formatCurrency(payload[0].value || payload[0].payload.value)}</p>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (change < -5) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 5) return 'text-red-600';
    if (change < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown Pengeluaran Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(breakdownData.currentTotal)}
              </div>
              <div className="text-sm text-muted-foreground">Bulan Ini</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(breakdownData.lastTotal)}
              </div>
              <div className="text-sm text-muted-foreground">Bulan Lalu</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${
                getTrendColor(breakdownData.totalChange)
              }`}>
                {getTrendIcon(breakdownData.totalChange)}
                {Math.abs(breakdownData.totalChange).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Perubahan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdownData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breakdownData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Bulan Ini vs Bulan Lalu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData.categories.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" fill="#ef4444" name="Bulan Ini" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="last" fill="#94a3b8" name="Bulan Lalu" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {breakdownData.categories.slice(0, 8).map((category: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.transactions} transaksi
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.current)}</div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(category.change)}
                      <span className={`text-sm ${getTrendColor(category.change)}`}>
                        {Math.abs(category.change).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={category.percentage} className="flex-1 h-2" />
                  <Badge variant="outline" className="text-xs">
                    {category.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Category Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Grid Kategori Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {breakdownData.categories.slice(0, 12).map((category: any, index: number) => (
              <div 
                key={index} 
                className="relative p-4 rounded-lg border-2 transition-all hover:scale-105"
                style={{ 
                  borderColor: category.color,
                  backgroundColor: `${category.color}10`
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="text-xs font-medium truncate">{category.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {category.percentage.toFixed(1)}%
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 h-1 rounded-b-lg transition-all"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}