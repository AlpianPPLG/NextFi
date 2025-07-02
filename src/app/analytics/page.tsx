'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnalysisSummaryCard } from '@/components/analytics/AnalysisSummaryCard';
import { IncomeVsExpenseChart } from '@/components/analytics/IncomeVsExpenseChart';
import { CategorySummary } from '@/components/analytics/CategorySummary';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { ExpenseBreakdown } from '@/components/analytics/ExpenseBreakdown';
import { EmptyAnalysis } from '@/components/analytics/EmptyAnalysis';
import { useTransactions } from '@/components/hooks/useTransaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');
  const [analysisType, setAnalysisType] = useState('overview');
  
  const { allTransactions, financialSummary } = useTransactions();

  // Filter transactions based on time range
  const getFilteredTransactions = () => {
    const now = new Date();
    const filtered = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const diffTime = now.getTime() - transactionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case '1month':
          return diffDays <= 30;
        case '3months':
          return diffDays <= 90;
        case '6months':
          return diffDays <= 180;
        case '1year':
          return diffDays <= 365;
        case 'all':
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  if (filteredTransactions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 lg:ml-64 p-4 lg:p-6">
            <EmptyAnalysis />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Analisis Keuangan
              </h1>
              <p className="text-muted-foreground">
                Insight mendalam tentang pola keuangan dan tren pengeluaran Anda
              </p>
            </div>
            
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Bulan</SelectItem>
                  <SelectItem value="3months">3 Bulan</SelectItem>
                  <SelectItem value="6months">6 Bulan</SelectItem>
                  <SelectItem value="1year">1 Tahun</SelectItem>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Cards */}
          <AnalysisSummaryCard 
            transactions={filteredTransactions} 
            timeRange={timeRange}
          />

          {/* Analysis Tabs */}
          <Tabs value={analysisType} onValueChange={setAnalysisType} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Kategori
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tren
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeVsExpenseChart transactions={filteredTransactions} />
                <MonthlyTrendChart transactions={filteredTransactions} />
              </div>
              <ExpenseBreakdown transactions={filteredTransactions} />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategorySummary transactions={filteredTransactions} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <MonthlyTrendChart transactions={filteredTransactions} detailed={true} />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Analisis Pola Pengeluaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(filteredTransactions.filter(t => t.type === 'expense').length / 
                            Math.max(1, Math.ceil((new Date().getTime() - new Date(Math.min(...filteredTransactions.map(t => new Date(t.date).getTime()))).getTime()) / (1000 * 60 * 60 * 24 * 7))))}
                        </div>
                        <div className="text-sm text-muted-foreground">Transaksi/Minggu</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {filteredTransactions.length > 0 ? 
                            Math.round(filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / 
                            filteredTransactions.filter(t => t.type === 'expense').length).toLocaleString('id-ID') : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Rata-rata/Transaksi</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {filteredTransactions.length > 0 ? 
                            Math.round((filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                            filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) / 
                            Math.max(1, Math.ceil((new Date().getTime() - new Date(Math.min(...filteredTransactions.map(t => new Date(t.date).getTime()))).getTime()) / (1000 * 60 * 60 * 24 * 30)))).toLocaleString('id-ID') : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Saving/Bulan</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      Rekomendasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                        💡 Optimasi Pengeluaran
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Kategori "Makanan & Minuman" menghabiskan 35% dari total pengeluaran. 
                        Pertimbangkan untuk memasak di rumah lebih sering.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        📊 Target Saving
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Dengan pola saat ini, Anda bisa menabung 20% lebih banyak dengan 
                        mengurangi pengeluaran hiburan sebesar 15%.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        ✅ Pencapaian
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Selamat! Pengeluaran transportasi Anda turun 25% dibanding bulan lalu.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Financial Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-muted-foreground/20"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.78)}`}
                            className="text-green-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">78</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Saving Rate</span>
                          <span className="font-medium text-green-600">Good</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Spending Control</span>
                          <span className="font-medium text-blue-600">Excellent</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Budget Adherence</span>
                          <span className="font-medium text-amber-600">Fair</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}