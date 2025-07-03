'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { DataSettings } from '@/components/settings/DataSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Palette, 
  Shield, 
  Bell,
  Database,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
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
                <Settings className="h-8 w-8 text-primary" />
                Pengaturan
              </h1>
              <p className="text-muted-foreground">
                Kelola preferensi dan konfigurasi aplikasi finance tracker Anda
              </p>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Tampilan
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Keamanan
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifikasi
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Tentang
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <DataSettings />
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Tentang Aplikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-primary-foreground font-bold text-2xl">💰</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Personal Finance Tracker</h2>
                      <p className="text-muted-foreground">Versi 1.0.0</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Fitur Utama</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Pencatatan transaksi otomatis</li>
                        <li>• Analisis keuangan mendalam</li>
                        <li>• Laporan komprehensif</li>
                        <li>• Manajemen akun & kartu</li>
                        <li>• Backup & sinkronisasi</li>
                        <li>• Keamanan tingkat enterprise</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Teknologi</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Next.js 15</li>
                        <li>• React 19</li>
                        <li>• TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Radix UI</li>
                        <li>• Recharts</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1,250+</div>
                        <div className="text-sm text-muted-foreground">Transaksi Tercatat</div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">15</div>
                        <div className="text-sm text-muted-foreground">Akun Terhubung</div>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-muted-foreground">Backup Tersimpan</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>© 2024 Personal Finance Tracker. Dibuat dengan ❤️ untuk mengelola keuangan Anda.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}