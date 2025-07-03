'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2,
  Plus,
  Building,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dummyBankAccounts, type BankAccount } from '@/components/data/dummy';

export function BankAccountsList() {
  const [accounts] = useState<BankAccount[]>(dummyBankAccounts);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number, currency: string = 'IDR') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleBalanceVisibility = (accountId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(accountId)) {
      newHidden.delete(accountId);
    } else {
      newHidden.add(accountId);
    }
    setHiddenBalances(newHidden);
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    // You could add a toast notification here
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Giro';
      case 'savings': return 'Tabungan';
      case 'investment': return 'Investasi';
      default: return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-800';
      case 'savings': return 'bg-green-100 text-green-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Rekening Bank
          </CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Rekening
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {account.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{account.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={getAccountTypeColor(account.type)}
                      >
                        {getAccountTypeLabel(account.type)}
                      </Badge>
                      {!account.isActive && (
                        <Badge variant="destructive">Tidak Aktif</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{account.bank}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {account.accountNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyAccountNumber(account.accountNumber)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Transaksi terakhir: {new Date(account.lastTransaction).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {hiddenBalances.has(account.id) ? (
                        <span className="text-lg font-bold">••••••••</span>
                      ) : (
                        <span className="text-lg font-bold" style={{ color: account.color }}>
                          {formatCurrency(account.balance, account.currency)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleBalanceVisibility(account.id)}
                      >
                        {hiddenBalances.has(account.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {account.currency}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Lihat Transaksi
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}