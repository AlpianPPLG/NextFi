'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReportSummary } from '@/components/reports/ReportSummary';
import { MonthlyReport } from '@/components/reports/MonthlyReport';
import { CategoryReport } from '@/components/reports/CategoryReport';
import { YearlyReport } from '@/components/reports/YearlyReport';
import { CustomReport } from '@/components/reports/CustomReport';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { useTransactions } from '@/components/hooks/useTransaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar,
  PieChart,
  BarChart3,
  Settings,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('summary');
  
  const { allTransactions, financialSummary } = useTransactions();

  // Filter transactions based on report period
  const getFilteredTransactions = () => {
    const now = new Date();
    const filtered = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (reportPeriod) {
        case 'current-month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return transactionDate.getMonth() === lastMonth.getMonth() && 
                 transactionDate.getFullYear() === lastMonth.getFullYear();
        case 'current-quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
          return transactionQuarter === currentQuarter && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'current-year':
          return transactionDate.getFullYear() === now.getFullYear();
        case 'last-year':
          return transactionDate.getFullYear() === now.getFullYear() - 1;
        case 'all-time':
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  const exportReport = () => {
    const reportData = {
      period: reportPeriod,
      generated: new Date().toISOString(),
      summary: {
        totalTransactions: filteredTransactions.length,
        totalIncome: filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      },
      transactions: filteredTransactions
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-keuangan-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 lg:ml-64 p-4 lg:p-6">
            <EmptyReport />
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
                <FileText className="h-8 w-8 text-primary" />
                Laporan Keuangan
              </h1>
              <p className="text-muted-foreground">
                Laporan komprehensif dan analisis mendalam tentang kondisi keuangan Anda
              </p>
            </div>
            
            <div className="flex gap-2">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Bulan Ini</SelectItem>
                  <SelectItem value="last-month">Bulan Lalu</SelectItem>
                  <SelectItem value="current-quarter">Kuartal Ini</SelectItem>
                  <SelectItem value="current-year">Tahun Ini</SelectItem>
                  <SelectItem value="last-year">Tahun Lalu</SelectItem>
                  <SelectItem value="all-time">Semua Waktu</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={exportReport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Report Summary */}
          <ReportSummary 
            transactions={filteredTransactions} 
            period={reportPeriod}
          />

          {/* Report Tabs */}
          <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Ringkasan
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bulanan
              </TabsTrigger>
              <TabsTrigger value="category" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Kategori
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tahunan
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Statistik Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {filteredTransactions.filter(t => t.type === 'income').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Pemasukan</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                          {filteredTransactions.filter(t => t.type === 'expense').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Pengeluaran</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Rata-rata per transaksi:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(
                            filteredTransactions.length > 0 
                              ? filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length
                              : 0
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Transaksi terbesar:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(
                            Math.max(...filteredTransactions.map(t => t.amount), 0)
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Frekuensi transaksi:</span>
                        <span className="font-medium">
                          {reportPeriod === 'current-month' ? 
                            `${(filteredTransactions.length / new Date().getDate()).toFixed(1)}/hari` :
                            `${filteredTransactions.length} total`
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Indicators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Indikator Performa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tingkat Menabung</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, Math.max(0, 
                                  (filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                                   filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) /
                                  Math.max(1, filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)) * 100
                                ))}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {(
                              (filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                               filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) /
                              Math.max(1, filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)) * 100
                            ).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Kontrol Pengeluaran</span>
                        <span className="text-sm font-medium text-green-600">Baik</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Konsistensi Pemasukan</span>
                        <span className="text-sm font-medium text-blue-600">Stabil</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Diversifikasi Kategori</span>
                        <span className="text-sm font-medium text-purple-600">Seimbang</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <MonthlyReport transactions={filteredTransactions} />
            </TabsContent>

            <TabsContent value="category" className="space-y-6">
              <CategoryReport transactions={filteredTransactions} />
            </TabsContent>

            <TabsContent value="yearly" className="space-y-6">
              <YearlyReport transactions={allTransactions} />
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <CustomReport transactions={allTransactions} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}