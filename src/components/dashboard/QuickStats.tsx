'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, CreditCard } from 'lucide-react';

export function QuickStats() {
  const stats = [
    {
      title: 'Target Bulanan',
      value: '75%',
      description: 'Rp 3.750.000 dari Rp 5.000.000',
      progress: 75,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Rata-rata Harian',
      value: 'Rp 125.000',
      description: 'Pengeluaran per hari',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      title: 'Kategori Tertinggi',
      value: 'Makanan',
      description: 'Rp 1.250.000 bulan ini',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Metode Pembayaran',
      value: 'Kartu Debit',
      description: '65% dari total transaksi',
      icon: CreditCard,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
            {stat.progress && (
              <Progress value={stat.progress} className="mt-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}