'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';

interface YearlyReportProps {
  transactions: Transaction[];
}

export function YearlyReport({ transactions }: YearlyReportProps) {
  const yearlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear())))
      .sort((a, b) => b - a)
      .slice(0, 5); // Last 5 years

    const yearlyStats = years.map(year => {
      const yearTransactions = transactions.filter(t => new Date(t.date).getFullYear() === year);
      
      const income = yearTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = yearTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const net = income - expense;
      const savingRate = income > 0 ? (net / income) * 100 : 0;

      // Monthly breakdown for current year
      const monthlyBreakdown = year === currentYear ? 
        Array.from({ length: 12 }, (_, month) => {
          const monthTransactions = yearTransactions.filter(t => 
            new Date(t.date).getMonth() === month
          );
          
          const monthIncome = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const monthExpense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            month: new Date(year, month).toLocaleDateString('id-ID', { month: 'short' }),
            income: monthIncome,
            expense: monthExpense,
            net: monthIncome - monthExpense
          };
        }) : [];

      return {
        year,
        income,
        expense,
        net,
        savingRate,
        transactionCount: yearTransactions.length,
        monthlyBreakdown,
        avgMonthlyIncome: income / 12,
        avgMonthlyExpense: expense / 12
      };
    });

    return yearlyStats;
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

  const currentYearData = yearlyData.find(y => y.year === new Date().getFullYear());
  const lastYearData = yearlyData.find(y => y.year === new Date().getFullYear() - 1);

  return (
    <div className="space-y-6">
      {/* Yearly Comparison */}
      {currentYearData && lastYearData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Tahun Ini vs Tahun Lalu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Pemasukan</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(currentYearData.income)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tahun lalu: {formatCurrency(lastYearData.income)}
                  </div>
                  <div className={`text-xs ${
                    currentYearData.income >= lastYearData.income ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lastYearData.income > 0 ? 
                      `${(((currentYearData.income - lastYearData.income) / lastYearData.income) * 100).toFixed(1)}%` :
                      'N/A'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Pengeluaran</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(currentYearData.expense)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tahun lalu: {formatCurrency(lastYearData.expense)}
                  </div>
                  <div className={`text-xs ${
                    currentYearData.expense <= lastYearData.expense ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lastYearData.expense > 0 ? 
                      `${(((currentYearData.expense - lastYearData.expense) / lastYearData.expense) * 100).toFixed(1)}%` :
                      'N/A'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Tingkat Menabung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {currentYearData.savingRate.toFixed(1)}%
                </div>
                <Progress value={Math.max(0, Math.min(100, currentYearData.savingRate))} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Tahun lalu: {lastYearData.savingRate.toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Performa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transaksi</span>
                  <span className="font-medium">{currentYearData.transactionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rata-rata/bulan</span>
                  <span className="font-medium">
                    {(currentYearData.transactionCount / 12).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className={`font-medium ${
                    currentYearData.savingRate >= 20 ? 'text-green-600' : 
                    currentYearData.savingRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {currentYearData.savingRate >= 20 ? 'Excellent' : 
                     currentYearData.savingRate >= 10 ? 'Good' : 'Fair'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Yearly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Tahunan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" fill="#6366f1" name="Net" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Current Year Monthly Breakdown */}
      {currentYearData && currentYearData.monthlyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Bulanan {currentYearData.year}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentYearData.monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Pemasukan"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stackId="2" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="Pengeluaran"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yearly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Performa Tahunan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tahun</th>
                  <th className="text-right p-2">Pemasukan</th>
                  <th className="text-right p-2">Pengeluaran</th>
                  <th className="text-right p-2">Net</th>
                  <th className="text-right p-2">Saving Rate</th>
                  <th className="text-right p-2">Transaksi</th>
                  <th className="text-right p-2">Avg/Bulan</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((year, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{year.year}</td>
                    <td className="p-2 text-right text-green-600">
                      {formatCurrency(year.income)}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      {formatCurrency(year.expense)}
                    </td>
                    <td className={`p-2 text-right font-medium ${
                      year.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(year.net)}
                    </td>
                    <td className={`p-2 text-right font-medium ${
                      year.savingRate >= 20 ? 'text-green-600' : 
                      year.savingRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {year.savingRate.toFixed(1)}%
                    </td>
                    <td className="p-2 text-right">{year.transactionCount}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(year.avgMonthlyExpense)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}