'use client';

import { 
  Home, 
  History, 
  PieChart, 
  Settings, 
  CreditCard,
  TrendingUp,
  X,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: History, label: 'Riwayat Transaksi', href: '/history' },
  { icon: PieChart, label: 'Analisis', href: '/analytics' },
  { icon: TrendingUp, label: 'Laporan', href: '/reports' },
  { icon: CreditCard, label: 'Kartu & Akun', href: '/accounts' },
  { icon: Settings, label: 'Pengaturan', href: '/settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Reduced width and better positioning */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header - Only show on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">💰</span>
            </div>
            <h2 className="font-bold text-lg">Finance Tracker</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo for desktop - Add top padding to align with navbar */}
        <div className="hidden lg:flex items-center gap-2 p-4 pt-6 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">💰</span>
          </div>
          <h2 className="font-bold text-lg">Finance Tracker</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 text-sm",
                  pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={onClose}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Upgrade to Pro Section - Fixed at Bottom */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                Upgrade ke Pro
              </h3>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 leading-relaxed">
              Dapatkan fitur analisis lanjutan dan laporan detail
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 text-xs h-8"
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade Sekarang
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}