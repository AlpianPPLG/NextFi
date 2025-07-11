'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function EmptyAnalysis() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Belum Ada Data untuk Dianalisis</h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Untuk melihat analisis keuangan yang mendalam, Anda perlu memiliki 
            beberapa transaksi terlebih dahulu. Mulai dengan menambahkan 
            transaksi pemasukan dan pengeluaran Anda.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Tambah Transaksi Pertama
              </Button>
            </Link>
            
            <Link href="/history">
              <Button variant="outline" className="w-full gap-2">
                <TrendingUp className="h-4 w-4" />
                Lihat Riwayat Transaksi
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Tips untuk Analisis yang Baik
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
              <li>• Tambahkan transaksi secara rutin</li>
              <li>• Gunakan kategori yang konsisten</li>
              <li>• Catat semua pemasukan dan pengeluaran</li>
              <li>• Review analisis setiap bulan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}