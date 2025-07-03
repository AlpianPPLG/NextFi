'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  HardDrive,
  Cloud,
  Shield,
  AlertTriangle
} from 'lucide-react';

export function DataSettings() {
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    cloudSync: true,
    dataRetention: '2years',
    exportFormat: 'json',
    compressionEnabled: true
  });

  const [storageInfo] = useState({
    used: 45.2, // MB
    total: 100, // MB
    transactions: 1250,
    attachments: 15,
    backups: 8
  });

  const handleSettingChange = (key: string, value: any) => {
    setDataSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    // Export data logic
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Import data logic
    console.log('Importing data...');
  };

  const handleDeleteAllData = () => {
    // Delete all data logic
    console.log('Deleting all data...');
  };

  const handleCreateBackup = () => {
    // Create backup logic
    console.log('Creating backup...');
  };

  const handleRestoreBackup = () => {
    // Restore backup logic
    console.log('Restoring backup...');
  };

  const backupFrequencies = [
    { value: 'daily', label: 'Harian' },
    { value: 'weekly', label: 'Mingguan' },
    { value: 'monthly', label: 'Bulanan' },
    { value: 'manual', label: 'Manual' }
  ];

  const retentionPeriods = [
    { value: '6months', label: '6 Bulan' },
    { value: '1year', label: '1 Tahun' },
    { value: '2years', label: '2 Tahun' },
    { value: '5years', label: '5 Tahun' },
    { value: 'forever', label: 'Selamanya' }
  ];

  const exportFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'pdf', label: 'PDF' }
  ];

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Penggunaan Penyimpanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Digunakan: {storageInfo.used} MB</span>
              <span>Total: {storageInfo.total} MB</span>
            </div>
            <Progress value={(storageInfo.used / storageInfo.total) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{storageInfo.transactions}</div>
              <div className="text-xs text-muted-foreground">Transaksi</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">{storageInfo.attachments}</div>
              <div className="text-xs text-muted-foreground">Lampiran</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{storageInfo.backups}</div>
              <div className="text-xs text-muted-foreground">Backup</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Pengaturan Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Otomatis</Label>
              <p className="text-sm text-muted-foreground">
                Backup data secara otomatis sesuai jadwal
              </p>
            </div>
            <Switch
              checked={dataSettings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
            />
          </div>

          {dataSettings.autoBackup && (
            <div className="ml-6 space-y-4">
              <div className="space-y-2">
                <Label>Frekuensi Backup</Label>
                <Select 
                  value={dataSettings.backupFrequency} 
                  onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backupFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sinkronisasi Cloud</Label>
              <p className="text-sm text-muted-foreground">
                Sinkronkan data dengan cloud storage
              </p>
            </div>
            <Switch
              checked={dataSettings.cloudSync}
              onCheckedChange={(checked) => handleSettingChange('cloudSync', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Kompresi Data</Label>
              <p className="text-sm text-muted-foreground">
                Kompres backup untuk menghemat ruang
              </p>
            </div>
            <Switch
              checked={dataSettings.compressionEnabled}
              onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Periode Penyimpanan</Label>
            <Select 
              value={dataSettings.dataRetention} 
              onValueChange={(value) => handleSettingChange('dataRetention', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {retentionPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateBackup} className="gap-2">
              <Database className="h-4 w-4" />
              Buat Backup Sekarang
            </Button>
            <Button variant="outline" onClick={handleRestoreBackup} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Import & Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Format Export</Label>
              <Select 
                value={dataSettings.exportFormat} 
                onValueChange={(value) => handleSettingChange('exportFormat', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" onClick={handleImportData} className="gap-2">
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📋 Format yang Didukung
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>JSON:</strong> Format lengkap dengan metadata</li>
              <li>• <strong>CSV:</strong> Kompatibel dengan Excel dan Google Sheets</li>
              <li>• <strong>Excel:</strong> Format spreadsheet dengan multiple sheets</li>
              <li>• <strong>PDF:</strong> Laporan yang siap cetak</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privasi Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🔒 Data Anda Aman
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Data dienkripsi end-to-end</li>
              <li>• Backup disimpan dengan enkripsi AES-256</li>
              <li>• Tidak ada data yang dibagikan ke pihak ketiga</li>
              <li>• Anda memiliki kontrol penuh atas data</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              ⚠️ Perhatian
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Pastikan untuk membuat backup secara berkala. Data yang hilang tidak dapat dipulihkan tanpa backup.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Zona Berbahaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Hapus Semua Data
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Tindakan ini akan menghapus semua data termasuk transaksi, akun, dan pengaturan. 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Hapus Semua Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus semua data secara permanen termasuk:
                    <br />• Semua transaksi
                    <br />• Semua akun dan kartu
                    <br />• Semua pengaturan
                    <br />• Semua backup lokal
                    <br /><br />
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAllData}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ya, Hapus Semua
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}