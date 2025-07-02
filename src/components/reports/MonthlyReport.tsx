'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { Calendar, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface MonthlyReportProps {
  transactions: Transaction[];
}

export function MonthlyReport({ transactions }: MonthlyReportProps) {
  const monthlyData = useMemo(() => {
    const monthlyStats = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthLabel,
          income: 0, 
          expense: 0, 
          net: 0,
          savingRate: 0,
          transactionCount: 0,
          incomeCount: 0,
          expenseCount: 0
        };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
        acc[monthKey].incomeCount += 1;
      } else {
        acc[monthKey].expense += transaction.amount;
        acc[monthKey].expenseCount += 1;
      }
      
      acc[monthKey].transactionCount += 1;
      acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense;
      acc[monthKey].savingRate = acc[monthKey].income > 0 
        ? (acc[monthKey].net / acc[monthKey].income) * 100 
        : 0;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyStats)
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
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
              {entry.name}: {
                entry.dataKey === 'savingRate' 
                  ? `${entry.value.toFixed(1)}%`
                  : formatCurrency(entry.value)
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  return (
    <div className="space-y-6">
      {/* Monthly Comparison */}
      {currentMonth && previousMonth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Perbandingan Bulan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Pemasukan</span>
                    <div className="flex items-center gap-2">
                      {currentMonth.income >= previousMonth.income ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentMonth.income >= previousMonth.income ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {previousMonth.income > 0 ? 
                          `${(((currentMonth.income - previousMonth.income) / previousMonth.income) * 100).toFixed(1)}%` :
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(currentMonth.income)}</div>
                  <div className="text-xs text-muted-foreground">
                    Bulan lalu: {formatCurrency(previousMonth.income)}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Pengeluaran</span>
                    <div className="flex items-center gap-2">
                      {currentMonth.expense <= previousMonth.expense ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentMonth.expense <= previousMonth.expense ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {previousMonth.expense > 0 ? 
                          `${(((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100).toFixed(1)}%` :
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(currentMonth.expense)}</div>
                  <div className="text-xs text-muted-foreground">
                    Bulan lalu: {formatCurrency(previousMonth.expense)}
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
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold text-purple-600">
                  {currentMonth.savingRate.toFixed(1)}%
                </div>
                <Progress value={Math.max(0, Math.min(100, currentMonth.savingRate))} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  Target: 20% | Bulan lalu: {previousMonth.savingRate.toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Aktivitas Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Transaksi</span>
                  <span className="font-medium">{currentMonth.transactionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pemasukan</span>
                  <span className="font-medium text-green-600">{currentMonth.incomeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pengeluaran</span>
                  <span className="font-medium text-red-600">{currentMonth.expenseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rata-rata/hari</span>
                  <span className="font-medium">
                    {(currentMonth.transactionCount / new Date().getDate()).toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Saving Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Tingkat Menabung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="savingRate" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    name="Tingkat Menabung"
                  />
                  {/* Target line at 20% */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 20} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target (20%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performa Bulanan Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Bulan</th>
                  <th className="text-right p-2">Pemasukan</th>
                  <th className="text-right p-2">Pengeluaran</th>
                  <th className="text-right p-2">Net</th>
                  <th className="text-right p-2">Saving Rate</th>
                  <th className="text-right p-2">Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.slice(-6).map((month: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{month.month}</td>
                    <td className="p-2 text-right text-green-600">
                      {formatCurrency(month.income)}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      {formatCurrency(month.expense)}
                    </td>
                    <td className={`p-2 text-right font-medium ${
                      month.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(month.net)}
                    </td>
                    <td className={`p-2 text-right font-medium ${
                      month.savingRate >= 20 ? 'text-green-600' : 
                      month.savingRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {month.savingRate.toFixed(1)}%
                    </td>
                    <td className="p-2 text-right">{month.transactionCount}</td>
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