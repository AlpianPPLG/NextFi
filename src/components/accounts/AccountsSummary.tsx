'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  Award
} from 'lucide-react';
import { getAccountsSummary } from '@/components/data/dummy';

export function AccountsSummary() {
  const summary = getAccountsSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const creditUtilization = (summary.totalCreditUsed / summary.totalCreditLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Net Worth Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Total Kekayaan Bersih</h2>
              <p className="text-muted-foreground">
                Gabungan semua aset dikurangi kewajiban
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(summary.totalNetWorth)}
              </div>
              <div className="text-sm text-muted-foreground">
                {summary.accountsCount + summary.walletsCount + summary.investmentsCount} akun aktif
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bank Accounts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rekening Bank
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary.totalBankBalance)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {summary.accountsCount} akun
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Saldo total di semua bank
            </p>
          </CardContent>
        </Card>

        {/* Credit Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kartu Kredit
            </CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalCreditUsed)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {summary.cardsCount} kartu
              </Badge>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Utilisasi: {creditUtilization.toFixed(1)}%</span>
                <span>Limit: {formatCurrency(summary.totalCreditLimit)}</span>
              </div>
              <Progress value={creditUtilization} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* E-Wallets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              E-Wallet
            </CardTitle>
            <Smartphone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalEWalletBalance)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {summary.walletsCount} wallet
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Saldo digital wallet
            </p>
          </CardContent>
        </Card>

        {/* Investments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Investasi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summary.totalInvestmentValue)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge 
                variant={summary.totalInvestmentReturns >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {summary.totalInvestmentReturns >= 0 ? '+' : ''}
                {formatCurrency(summary.totalInvestmentReturns)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {summary.investmentsCount} portofolio aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liquidity Ratio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Rasio Likuiditas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-blue-600">
                {((summary.totalBankBalance + summary.totalEWalletBalance) / summary.totalCreditUsed).toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">
                Kemampuan bayar hutang jangka pendek
              </div>
              <Progress 
                value={Math.min(100, ((summary.totalBankBalance + summary.totalEWalletBalance) / summary.totalCreditUsed) * 20)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
              Tingkat Tabungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-green-600">
                {((summary.totalBankBalance / summary.totalNetWorth) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Persentase aset dalam bentuk tabungan
              </div>
              <Progress 
                value={(summary.totalBankBalance / summary.totalNetWorth) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Alokasi Investasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-purple-600">
                {((summary.totalInvestmentValue / summary.totalNetWorth) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Persentase aset dalam investasi
              </div>
              <Progress 
                value={(summary.totalInvestmentValue / summary.totalNetWorth) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            Insight Keuangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                💡 Diversifikasi Baik
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Portofolio Anda terdiversifikasi dengan baik antara cash, investasi, dan digital assets.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Utilisasi Kredit Sehat
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Utilisasi kartu kredit {creditUtilization.toFixed(1)}% masih dalam batas aman (30%).
              </p>
            </div>

            {summary.totalInvestmentReturns > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  📈 Investasi Menguntungkan
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Portofolio investasi memberikan return positif sebesar {formatCurrency(summary.totalInvestmentReturns)}.
                </p>
              </div>
            )}

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                🎯 Rekomendasi
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Pertimbangkan untuk meningkatkan alokasi investasi jangka panjang untuk pertumbuhan wealth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};