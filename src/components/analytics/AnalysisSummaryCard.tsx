'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Calendar,
  PieChart
} from 'lucide-react';
import { Transaction } from '@/components/types/transaction';

interface AnalysisSummaryCardProps {
  transactions: Transaction[];
  timeRange: string;
}

export function AnalysisSummaryCard({ transactions, timeRange }: AnalysisSummaryCardProps) {
  const analysis = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
    
    // Calculate average monthly values
    const monthsInRange = timeRange === '1month' ? 1 : 
                         timeRange === '3months' ? 3 :
                         timeRange === '6months' ? 6 :
                         timeRange === '1year' ? 12 : 6;
    
    const avgMonthlyIncome = totalIncome / monthsInRange;
    const avgMonthlyExpense = totalExpenses / monthsInRange;
    
    // Find biggest expense category
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const biggestCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingRate,
      avgMonthlyIncome,
      avgMonthlyExpense,
      biggestCategory: biggestCategory ? {
        name: biggestCategory[0],
        amount: biggestCategory[1],
        percentage: (biggestCategory[1] / totalExpenses) * 100
      } : null,
      transactionCount: transactions.length
    };
  }, [transactions, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '1month': return '1 Bulan Terakhir';
      case '3months': return '3 Bulan Terakhir';
      case '6months': return '6 Bulan Terakhir';
      case '1year': return '1 Tahun Terakhir';
      default: return 'Semua Waktu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Analisis Periode</h2>
              <p className="text-muted-foreground">{getTimeRangeLabel()}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{analysis.transactionCount}</div>
              <div className="text-sm text-muted-foreground">Total Transaksi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Bersih
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              analysis.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(analysis.balance)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {analysis.balance >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                {analysis.balance >= 0 ? 'Surplus' : 'Defisit'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saving Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tingkat Menabung
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analysis.savingRate.toFixed(1)}%
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, analysis.savingRate))} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target ideal: 20%
            </p>
          </CardContent>
        </Card>

        {/* Average Monthly Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata Pemasukan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analysis.avgMonthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per bulan
            </p>
          </CardContent>
        </Card>

        {/* Average Monthly Expense */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analysis.avgMonthlyExpense)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per bulan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biggest Expense Category */}
        {analysis.biggestCategory && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-600" />
                Kategori Pengeluaran Terbesar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">
                    {analysis.biggestCategory.name.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {analysis.biggestCategory.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analysis.biggestCategory.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Total: {formatCurrency(analysis.biggestCategory.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Health Indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Kesehatan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Kontrol Pengeluaran</span>
                <span className={`text-sm font-medium ${
                  analysis.savingRate > 20 ? 'text-green-600' : 
                  analysis.savingRate > 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analysis.savingRate > 20 ? 'Excellent' : 
                   analysis.savingRate > 10 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Stabilitas Pemasukan</span>
                <span className="text-sm font-medium text-blue-600">
                  {analysis.totalIncome > 0 ? 'Stable' : 'No Income'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Diversifikasi Pengeluaran</span>
                <span className="text-sm font-medium text-purple-600">
                  {analysis.biggestCategory && analysis.biggestCategory.percentage < 40 ? 'Balanced' : 'Concentrated'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}