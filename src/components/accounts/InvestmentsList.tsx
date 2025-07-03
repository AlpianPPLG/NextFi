'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dummyInvestments, type Investment } from '@/components/data/dummy';

export function InvestmentsList() {
  const [investments] = useState<Investment[]>(dummyInvestments);
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const toggleBalanceVisibility = (investmentId: string) => {
    const newHidden = new Set(hiddenBalances);
    if (newHidden.has(investmentId)) {
      newHidden.delete(investmentId);
    } else {
      newHidden.add(investmentId);
    }
    setHiddenBalances(newHidden);
  };

  const getInvestmentTypeLabel = (type: string) => {
    switch (type) {
      case 'stocks': return 'Saham';
      case 'mutual_fund': return 'Reksadana';
      case 'crypto': return 'Kripto';
      case 'bonds': return 'Obligasi';
      default: return type;
    }
  };

  const getInvestmentTypeColor = (type: string) => {
    switch (type) {
      case 'stocks': return 'bg-blue-100 text-blue-800';
      case 'mutual_fund': return 'bg-green-100 text-green-800';
      case 'crypto': return 'bg-orange-100 text-orange-800';
      case 'bonds': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnColor = (returns: number) => {
    if (returns > 0) return 'text-green-600';
    if (returns < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getReturnIcon = (returns: number) => {
    if (returns > 0) return <TrendingUp className="h-4 w-4" />;
    if (returns < 0) return <TrendingDown className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portofolio Investasi
          </CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Investasi
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${investment.color}20` }}
                  >
                    {investment.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{investment.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={getInvestmentTypeColor(investment.type)}
                      >
                        {getInvestmentTypeLabel(investment.type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{investment.platform}</p>
                    
                    <p className="text-xs text-muted-foreground">
                      Update terakhir: {new Date(investment.lastUpdate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {hiddenBalances.has(investment.id) ? (
                        <span className="text-lg font-bold">••••••••</span>
                      ) : (
                        <span className="text-lg font-bold" style={{ color: investment.color }}>
                          {formatCurrency(investment.currentValue)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleBalanceVisibility(investment.id)}
                      >
                        {hiddenBalances.has(investment.id) ? (
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buka Platform
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

              {/* Investment Details */}
              {!hiddenBalances.has(investment.id) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Modal:</span>
                      <div className="font-medium">
                        {formatCurrency(investment.totalInvested)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nilai Saat Ini:</span>
                      <div className="font-medium">
                        {formatCurrency(investment.currentValue)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Keuntungan/Kerugian:</span>
                      <div className={`font-medium flex items-center gap-1 ${getReturnColor(investment.returns)}`}>
                        {getReturnIcon(investment.returns)}
                        {investment.returns >= 0 ? '+' : ''}{formatCurrency(investment.returns)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Return:</span>
                      <div className={`font-medium flex items-center gap-1 ${getReturnColor(investment.returns)}`}>
                        {getReturnIcon(investment.returns)}
                        {investment.returnsPercentage >= 0 ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}