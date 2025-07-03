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
  Smartphone,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dummyEWallets, type EWallet } from '@/components/data/dummy';

export function EWalletsList() {
  const [wallets] = useState<EWallet[]>(dummyEWallets);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleBalanceVisibility = (walletId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(walletId)) {
      newHidden.delete(walletId);
    } else {
      newHidden.add(walletId);
    }
    setHiddenBalances(newHidden);
  };

  const copyPhoneNumber = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            E-Wallet
          </CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah E-Wallet
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${wallet.color}20` }}
                  >
                    {wallet.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{wallet.name}</h3>
                      {!wallet.isActive && (
                        <Badge variant="destructive">Tidak Aktif</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{wallet.provider}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {wallet.phoneNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyPhoneNumber(wallet.phoneNumber)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Top up terakhir: {new Date(wallet.lastTopUp).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {hiddenBalances.has(wallet.id) ? (
                        <span className="text-lg font-bold">••••••••</span>
                      ) : (
                        <span className="text-lg font-bold" style={{ color: wallet.color }}>
                          {formatCurrency(wallet.balance)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleBalanceVisibility(wallet.id)}
                      >
                        {hiddenBalances.has(wallet.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
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
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Top Up
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowDownCircle className="mr-2 h-4 w-4" />
                        Transfer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    Top Up
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowDownCircle className="h-4 w-4" />
                    Transfer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}