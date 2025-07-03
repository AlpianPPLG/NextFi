'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2,
  Plus,
  CreditCard,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dummyCreditCards, type CreditCard as CreditCardType } from '@/components/data/dummy';

export function CreditCardsList() {
  const [cards] = useState<CreditCardType[]>(dummyCreditCards);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleBalanceVisibility = (cardId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(cardId)) {
      newHidden.delete(cardId);
    } else {
      newHidden.add(cardId);
    }
    setHiddenBalances(newHidden);
  };

  const copyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💎';
      case 'amex': return '🏆';
      default: return '💳';
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Kartu Kredit
          </CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kartu
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cards.map((card) => {
            const utilizationPercentage = (card.used / card.limit) * 100;
            const daysUntilDue = getDaysUntilDue(card.dueDate);
            
            return (
              <div
                key={card.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${card.color}20` }}
                    >
                      {getCardTypeIcon(card.cardType)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{card.name}</h3>
                        <Badge variant="outline" className="uppercase">
                          {card.cardType}
                        </Badge>
                        {!card.isActive && (
                          <Badge variant="destructive">Tidak Aktif</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{card.bank}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {card.cardNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyCardNumber(card.cardNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
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
                        <CreditCard className="mr-2 h-4 w-4" />
                        Lihat Tagihan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Credit Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Penggunaan Kredit</span>
                    <div className="flex items-center gap-2">
                      {hiddenBalances.has(card.id) ? (
                        <span className="text-sm font-medium">••••••••</span>
                      ) : (
                        <span className={`text-sm font-medium ${getUtilizationColor(utilizationPercentage)}`}>
                          {utilizationPercentage.toFixed(1)}%
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleBalanceVisibility(card.id)}
                      >
                        {hiddenBalances.has(card.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Progress value={utilizationPercentage} className="h-2" />
                  
                  {!hiddenBalances.has(card.id) && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Terpakai:</span>
                        <div className="font-medium text-red-600">
                          {formatCurrency(card.used)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tersedia:</span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(card.available)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Limit:</span>
                        <div className="font-medium">
                          {formatCurrency(card.limit)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Due Date & Payment */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Jatuh tempo: {new Date(card.dueDate).toLocaleDateString('id-ID')}
                      </span>
                      {daysUntilDue <= 7 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {daysUntilDue} hari lagi
                        </Badge>
                      )}
                    </div>
                    
                    {!hiddenBalances.has(card.id) && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Pembayaran minimum:</div>
                        <div className="font-medium text-orange-600">
                          {formatCurrency(card.minimumPayment)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}