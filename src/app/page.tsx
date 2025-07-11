'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ChartView } from '@/components/dashboard/ChartView';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { useTransactions } from '@/components/hooks/useTransaction';
import { toast } from 'sonner';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    transactions,
    financialSummary,
    expenseChartData,
    monthlyData,
    filter,
    setFilter,
    addTransaction,
    deleteTransaction
  } = useTransactions();

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
    toast.success('Transaksi berhasil ditambahkan!');
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaksi berhasil dihapus!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64 p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Selamat datang kembali! Berikut ringkasan keuangan Anda.
              </p>
            </div>
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>

          {/* Balance Cards */}
          <BalanceCard summary={financialSummary} />

          {/* Quick Stats */}
          <QuickStats />

          {/* Charts */}
          <ChartView 
            expenseData={expenseChartData} 
            monthlyData={monthlyData} 
          />

          {/* Recent Transactions */}
          <TransactionList
            transactions={transactions.slice(0, 10)}
            filter={filter}
            onFilterChange={setFilter}
            onDelete={handleDeleteTransaction}
          />
        </main>
      </div>
    </div>
  );
}
