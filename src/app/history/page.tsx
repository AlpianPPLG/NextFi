'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useTransactions } from '@/components/hooks/useTransaction';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    allTransactions,
    financialSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions();

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
    toast.success('Transaksi berhasil ditambahkan!');
  };

  const handleUpdateTransaction = (id: string, updates: any) => {
    updateTransaction(id, updates);
    toast.success('Transaksi berhasil diperbarui!');
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
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
              <p className="text-muted-foreground">
                Kelola dan pantau semua transaksi keuangan Anda
              </p>
            </div>
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>

          {/* Transaction History Component */}
          <TransactionHistory
            transactions={allTransactions}
            summary={financialSummary}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </main>
      </div>
    </div>
  );
}