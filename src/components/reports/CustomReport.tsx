'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '@/components/types/transaction';
import { allCategories } from '@/components/data/categories';
import { Settings, Download, Filter, Calendar } from 'lucide-react';

interface CustomReportProps {
  transactions: Transaction[];
}

export function CustomReport({ transactions }: CustomReportProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'chart'>('summary');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const filteredData = useMemo(() => {
    let filtered = transactions;

    // Date filter
    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateTo));
    }

    // Type filter
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(t => selectedCategories.includes(t.category));
    }

    // Amount filter
    if (minAmount) {
      filtered = filtered.filter(t => t.amount >= Number(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(t => t.amount <= Number(maxAmount));
    }

    return filtered;
  }, [transactions, dateFrom, dateTo, selectedCategories, transactionType, minAmount, maxAmount]);

  const reportData = useMemo(() => {
    const totalIncome = filteredData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryStats = filteredData.reduce((acc, transaction) => {
      const category = allCategories.find(c => c.id === transaction.category);
      const categoryName = category?.name || transaction.category;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          count: 0,
          icon: category?.icon || '📦',
          color: category?.color || '#64748b',
          type: transaction.type
        };
      }
      
      acc[categoryName].amount += transaction.amount;
      acc[categoryName].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    const categories = Object.values(categoryStats)
      .sort((a: any, b: any) => b.amount - a.amount);

    // Monthly breakdown
    const monthlyStats = filteredData.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const monthlyData = Object.values(monthlyStats)
      .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: filteredData.length,
      categories,
      monthlyData,
      avgTransaction: filteredData.length > 0 ? 
        filteredData.reduce((sum, t) => sum + t.amount, 0) / filteredData.length : 0
    };
  }, [filteredData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const exportCustomReport = () => {
    const reportData = {
      filters: {
        dateFrom,
        dateTo,
        selectedCategories,
        transactionType,
        minAmount,
        maxAmount
      },
      data: filteredData,
      summary: {
        totalIncome: reportData.totalIncome,
        totalExpenses: reportData.totalExpenses,
        balance: reportData.balance,
        transactionCount: reportData.transactionCount
      },
      generated: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <div className="space-y-6">
      {/* Filter Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Konfigurasi Laporan Custom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">Tanggal Mulai</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Tanggal Selesai</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Transaction Type and Report Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipe Transaksi</Label>
              <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Transaksi</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipe Laporan</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Ringkasan</SelectItem>
                  <SelectItem value="detailed">Detail</SelectItem>
                  <SelectItem value="chart">Grafik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAmount">Jumlah Minimum</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxAmount">Jumlah Maksimum</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="Tidak terbatas"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label>Kategori</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {allCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label htmlFor={category.id} className="text-sm">
                    {category.icon} {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={exportCustomReport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Laporan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setSelectedCategories([]);
                setTransactionType('all');
                setMinAmount('');
                setMaxAmount('');
              }}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dateFrom && (
              <Badge variant="outline">
                Dari: {new Date(dateFrom).toLocaleDateString('id-ID')}
              </Badge>
            )}
            {dateTo && (
              <Badge variant="outline">
                Sampai: {new Date(dateTo).toLocaleDateString('id-ID')}
              </Badge>
            )}
            {transactionType !== 'all' && (
              <Badge variant="outline">
                Tipe: {transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </Badge>
            )}
            {selectedCategories.length > 0 && (
              <Badge variant="outline">
                Kategori: {selectedCategories.length} dipilih
              </Badge>
            )}
            {minAmount && (
              <Badge variant="outline">
                Min: {formatCurrency(Number(minAmount))}
              </Badge>
            )}
            {maxAmount && (
              <Badge variant="outline">
                Max: {formatCurrency(Number(maxAmount))}
              </Badge>
            )}
            <Badge variant="default">
              {reportData.transactionCount} transaksi ditemukan
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportType === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.totalIncome)}
              </div>
              <div className="text-sm text-muted-foreground">Total Pemasukan</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(reportData.totalExpenses)}
              </div>
              <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold ${
                reportData.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(reportData.balance)}
              </div>
              <div className="text-sm text-muted-foreground">Saldo Bersih</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(reportData.avgTransaction)}
              </div>
              <div className="text-sm text-muted-foreground">Rata-rata Transaksi</div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Tanggal</th>
                    <th className="text-left p-2">Deskripsi</th>
                    <th className="text-left p-2">Kategori</th>
                    <th className="text-left p-2">Tipe</th>
                    <th className="text-right p-2">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 50).map((transaction, index) => {
                    const category = allCategories.find(c => c.id === transaction.category);
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-2">{transaction.description}</td>
                        <td className="p-2">
                          {category?.icon} {category?.name || transaction.category}
                        </td>
                        <td className="p-2">
                          <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </Badge>
                        </td>
                        <td className={`p-2 text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredData.length > 50 && (
                <div className="text-center p-4 text-muted-foreground">
                  Menampilkan 50 dari {filteredData.length} transaksi
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.categories.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {reportData.categories.slice(0, 8).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                    <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}