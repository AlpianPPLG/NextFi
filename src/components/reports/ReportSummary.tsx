'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Transaction } from '@/components/types/transaction';

interface ReportSummaryProps {
  transactions: Transaction[];
  period: string;
}

export function ReportSummary({ transactions, period }: ReportSummaryProps) {
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
    
    // Calculate period-specific metrics
    const getPeriodDays = () => {
      switch (period) {
        case 'current-month': return new Date().getDate();
        case 'last-month': return 30;
        case 'current-quarter': return 90;
        case 'current-year': return new Date().getDayOfYear();
        case 'last-year': return 365;
        default: return 30;
      }
    };

    const periodDays = getPeriodDays();
    const dailyAvgIncome = totalIncome / periodDays;
    const dailyAvgExpense = totalExpenses / periodDays;

    // Financial health score calculation
    const healthScore = Math.min(100, Math.max(0, 
      (savingRate * 0.4) + 
      (totalIncome > 0 ? 30 : 0) + 
      (totalExpenses < totalIncome ? 30 : 0)
    ));

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingRate,
      dailyAvgIncome,
      dailyAvgExpense,
      healthScore,
      transactionCount: transactions.length,
      incomeCount: transactions.filter(t => t.type === 'income').length,
      expenseCount: transactions.filter(t => t.type === 'expense').length
    };
  }, [transactions, period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'current-month': return 'Bulan Ini';
      case 'last-month': return 'Bulan Lalu';
      case 'current-quarter': return 'Kuartal Ini';
      case 'current-year': return 'Tahun Ini';
      case 'last-year': return 'Tahun Lalu';
      default: return 'Semua Waktu';
    }
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', icon: Clock };
    return { label: 'Needs Attention', color: 'text-red-600', icon: AlertTriangle };
  };

  const healthStatus = getHealthStatus(summary.healthScore);

  return (
    <div className="space-y-6">
      {/* Period Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Laporan {getPeriodLabel()}</h2>
              <p className="text-muted-foreground">
                Ringkasan keuangan untuk periode {getPeriodLabel().toLowerCase()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{summary.transactionCount}</div>
              <div className="text-sm text-muted-foreground">Total Transaksi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pemasukan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalIncome)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {summary.incomeCount} transaksi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rata-rata: {formatCurrency(summary.dailyAvgIncome)}/hari
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {summary.expenseCount} transaksi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rata-rata: {formatCurrency(summary.dailyAvgExpense)}/hari
            </p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Bersih
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.balance)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {summary.balance >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className="text-xs text-muted-foreground">
                {summary.balance >= 0 ? 'Surplus' : 'Defisit'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tingkat menabung: {summary.savingRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        {/* Financial Health Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skor Kesehatan
            </CardTitle>
            <healthStatus.icon className={`h-4 w-4 ${healthStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthStatus.color}`}>
              {summary.healthScore.toFixed(0)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${healthStatus.color}`}
              >
                {healthStatus.label}
              </Badge>
            </div>
            <Progress value={summary.healthScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saving Rate Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Analisis Menabung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {summary.savingRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Tingkat Menabung</div>
            </div>
            
            <Progress value={Math.max(0, Math.min(100, summary.savingRate))} className="h-3" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Target ideal:</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${
                  summary.savingRate >= 20 ? 'text-green-600' : 
                  summary.savingRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {summary.savingRate >= 20 ? 'Excellent' : 
                   summary.savingRate >= 10 ? 'Good' : 'Perlu Perbaikan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Potensi tabungan:</span>
                <span className="font-medium">
                  {formatCurrency(summary.balance > 0 ? summary.balance : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Pola Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rata-rata harian</span>
                <span className="font-medium">{formatCurrency(summary.dailyAvgExpense)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Frekuensi transaksi</span>
                <span className="font-medium">
                  {(summary.expenseCount / Math.max(1, summary.transactionCount) * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Kontrol pengeluaran</span>
                <Badge variant={summary.totalExpenses <= summary.totalIncome ? "default" : "destructive"}>
                  {summary.totalExpenses <= summary.totalIncome ? "Terkendali" : "Berlebihan"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Efisiensi keuangan</span>
                <span className={`font-medium ${
                  summary.savingRate > 15 ? 'text-green-600' : 
                  summary.savingRate > 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {summary.savingRate > 15 ? 'Efisien' : 
                   summary.savingRate > 5 ? 'Cukup' : 'Perlu Optimasi'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.savingRate < 10 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-sm font-medium text-red-800 dark:text-red-200">
                  ⚠️ Tingkatkan Tabungan
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Tingkat menabung Anda di bawah 10%. Coba kurangi pengeluaran non-esensial.
                </div>
              </div>
            )}
            
            {summary.balance < 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-sm font-medium text-red-800 dark:text-red-200">
                  🚨 Defisit Keuangan
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Pengeluaran melebihi pemasukan. Segera evaluasi dan kurangi pengeluaran.
                </div>
              </div>
            )}
            
            {summary.savingRate >= 20 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Keuangan Sehat
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Tingkat menabung Anda sangat baik! Pertahankan pola ini.
                </div>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                💡 Tips Optimasi
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Review pengeluaran bulanan dan identifikasi area yang bisa dihemat.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}