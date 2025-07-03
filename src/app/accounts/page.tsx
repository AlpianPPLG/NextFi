'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AccountsSummary } from '@/components/accounts/AccountsSummary';
import { BankAccountsList } from '@/components/accounts/BankAccountsList';
import { CreditCardsList } from '@/components/accounts/CreditCardsList';
import { EWalletsList } from '@/components/accounts/EWalletsList';
import { InvestmentsList } from '@/components/accounts/InvestmentsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Building, 
  Smartphone, 
  TrendingUp,
  PieChart,
} from 'lucide-react';

export default function AccountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <CreditCard className="h-8 w-8 text-primary" />
                Kartu & Akun
              </h1>
              <p className="text-muted-foreground">
                Kelola semua akun bank, kartu kredit, e-wallet, dan investasi Anda
              </p>
            </div>
          </div>

          {/* Accounts Summary */}
          <AccountsSummary />

          {/* Accounts Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Bank
              </TabsTrigger>
              <TabsTrigger value="credit" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Kredit
              </TabsTrigger>
              <TabsTrigger value="ewallet" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                E-Wallet
              </TabsTrigger>
              <TabsTrigger value="investment" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Investasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BankAccountsList />
                <CreditCardsList />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EWalletsList />
                <InvestmentsList />
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-6">
              <BankAccountsList />
            </TabsContent>

            <TabsContent value="credit" className="space-y-6">
              <CreditCardsList />
            </TabsContent>

            <TabsContent value="ewallet" className="space-y-6">
              <EWalletsList />
            </TabsContent>

            <TabsContent value="investment" className="space-y-6">
              <InvestmentsList />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}