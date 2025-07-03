'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  CreditCard, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    // General
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Transaction Notifications
    transactionAlerts: true,
    largeTransactionAlert: true,
    largeTransactionThreshold: 1000000,
    dailySummary: true,
    weeklySummary: true,
    monthlySummary: true,
    
    // Budget & Goals
    budgetAlerts: true,
    budgetThreshold: 80,
    goalReminders: true,
    savingGoalProgress: true,
    
    // Bills & Payments
    billReminders: true,
    billReminderDays: 3,
    creditCardDue: true,
    creditCardDueDays: 7,
    
    // Investment
    investmentAlerts: true,
    marketUpdates: false,
    portfolioSummary: true,
    
    // Security
    securityAlerts: true,
    loginAlerts: true,
    suspiciousActivity: true,
    
    // Timing
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    weekendNotifications: false
  });

  const handleNotificationChange = (key: string, value: any) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const notificationChannels = [
    { key: 'pushNotifications', label: 'Push Notifications', icon: Bell, description: 'Notifikasi langsung di aplikasi' },
    { key: 'emailNotifications', label: 'Email', icon: Mail, description: 'Notifikasi melalui email' },
    { key: 'smsNotifications', label: 'SMS', icon: Smartphone, description: 'Notifikasi melalui SMS' }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Saluran Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationChannels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <div key={channel.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{channel.label}</Label>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications[channel.key as keyof typeof notifications] as boolean}
                  onCheckedChange={(checked) => handleNotificationChange(channel.key, checked)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Transaction Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Notifikasi Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Transaksi</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi untuk setiap transaksi baru
              </p>
            </div>
            <Switch
              checked={notifications.transactionAlerts}
              onCheckedChange={(checked) => handleNotificationChange('transactionAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Transaksi Besar</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi khusus untuk transaksi di atas batas tertentu
              </p>
            </div>
            <Switch
              checked={notifications.largeTransactionAlert}
              onCheckedChange={(checked) => handleNotificationChange('largeTransactionAlert', checked)}
            />
          </div>

          {notifications.largeTransactionAlert && (
            <div className="ml-6 space-y-2">
              <Label>Batas Transaksi Besar</Label>
              <Select 
                value={notifications.largeTransactionThreshold.toString()} 
                onValueChange={(value) => handleNotificationChange('largeTransactionThreshold', parseInt(value))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500000">Rp 500.000</SelectItem>
                  <SelectItem value="1000000">Rp 1.000.000</SelectItem>
                  <SelectItem value="2500000">Rp 2.500.000</SelectItem>
                  <SelectItem value="5000000">Rp 5.000.000</SelectItem>
                  <SelectItem value="10000000">Rp 10.000.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ringkasan Harian</Label>
              <p className="text-sm text-muted-foreground">
                Ringkasan transaksi setiap hari
              </p>
            </div>
            <Switch
              checked={notifications.dailySummary}
              onCheckedChange={(checked) => handleNotificationChange('dailySummary', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ringkasan Mingguan</Label>
              <p className="text-sm text-muted-foreground">
                Ringkasan transaksi setiap minggu
              </p>
            </div>
            <Switch
              checked={notifications.weeklySummary}
              onCheckedChange={(checked) => handleNotificationChange('weeklySummary', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ringkasan Bulanan</Label>
              <p className="text-sm text-muted-foreground">
                Ringkasan transaksi setiap bulan
              </p>
            </div>
            <Switch
              checked={notifications.monthlySummary}
              onCheckedChange={(checked) => handleNotificationChange('monthlySummary', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget & Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Budget & Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Budget</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi saat mendekati batas budget
              </p>
            </div>
            <Switch
              checked={notifications.budgetAlerts}
              onCheckedChange={(checked) => handleNotificationChange('budgetAlerts', checked)}
            />
          </div>

          {notifications.budgetAlerts && (
            <div className="ml-6 space-y-2">
              <Label>Batas Alert Budget (%)</Label>
              <Select 
                value={notifications.budgetThreshold.toString()} 
                onValueChange={(value) => handleNotificationChange('budgetThreshold', parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="70">70%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pengingat Target</Label>
              <p className="text-sm text-muted-foreground">
                Pengingat untuk mencapai target keuangan
              </p>
            </div>
            <Switch
              checked={notifications.goalReminders}
              onCheckedChange={(checked) => handleNotificationChange('goalReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progress Target Menabung</Label>
              <p className="text-sm text-muted-foreground">
                Update progress target menabung
              </p>
            </div>
            <Switch
              checked={notifications.savingGoalProgress}
              onCheckedChange={(checked) => handleNotificationChange('savingGoalProgress', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bills & Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tagihan & Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pengingat Tagihan</Label>
              <p className="text-sm text-muted-foreground">
                Pengingat untuk tagihan yang akan jatuh tempo
              </p>
            </div>
            <Switch
              checked={notifications.billReminders}
              onCheckedChange={(checked) => handleNotificationChange('billReminders', checked)}
            />
          </div>

          {notifications.billReminders && (
            <div className="ml-6 space-y-2">
              <Label>Pengingat Berapa Hari Sebelumnya</Label>
              <Select 
                value={notifications.billReminderDays.toString()} 
                onValueChange={(value) => handleNotificationChange('billReminderDays', parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hari</SelectItem>
                  <SelectItem value="3">3 hari</SelectItem>
                  <SelectItem value="5">5 hari</SelectItem>
                  <SelectItem value="7">7 hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Jatuh Tempo Kartu Kredit</Label>
              <p className="text-sm text-muted-foreground">
                Pengingat pembayaran kartu kredit
              </p>
            </div>
            <Switch
              checked={notifications.creditCardDue}
              onCheckedChange={(checked) => handleNotificationChange('creditCardDue', checked)}
            />
          </div>

          {notifications.creditCardDue && (
            <div className="ml-6 space-y-2">
              <Label>Pengingat Berapa Hari Sebelumnya</Label>
              <Select 
                value={notifications.creditCardDueDays.toString()} 
                onValueChange={(value) => handleNotificationChange('creditCardDueDays', parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 hari</SelectItem>
                  <SelectItem value="5">5 hari</SelectItem>
                  <SelectItem value="7">7 hari</SelectItem>
                  <SelectItem value="10">10 hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Notifikasi Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Keamanan</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi untuk masalah keamanan
              </p>
            </div>
            <Switch
              checked={notifications.securityAlerts}
              onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alert Login</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi saat ada login dari perangkat baru
              </p>
            </div>
            <Switch
              checked={notifications.loginAlerts}
              onCheckedChange={(checked) => handleNotificationChange('loginAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Aktivitas Mencurigakan</Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi untuk aktivitas yang tidak biasa
              </p>
            </div>
            <Switch
              checked={notifications.suspiciousActivity}
              onCheckedChange={(checked) => handleNotificationChange('suspiciousActivity', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jam Tenang
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Aktifkan Jam Tenang</Label>
              <p className="text-sm text-muted-foreground">
                Tidak ada notifikasi pada jam tertentu
              </p>
            </div>
            <Switch
              checked={notifications.quietHoursEnabled}
              onCheckedChange={(checked) => handleNotificationChange('quietHoursEnabled', checked)}
            />
          </div>

          {notifications.quietHoursEnabled && (
            <div className="ml-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mulai</Label>
                <Select 
                  value={notifications.quietHoursStart} 
                  onValueChange={(value) => handleNotificationChange('quietHoursStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Selesai</Label>
                <Select 
                  value={notifications.quietHoursEnd} 
                  onValueChange={(value) => handleNotificationChange('quietHoursEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifikasi Weekend</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi di akhir pekan
              </p>
            </div>
            <Switch
              checked={notifications.weekendNotifications}
              onCheckedChange={(checked) => handleNotificationChange('weekendNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}