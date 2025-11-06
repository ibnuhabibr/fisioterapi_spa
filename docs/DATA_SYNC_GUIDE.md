# 🔄 Panduan Sinkronisasi Data Production & Local

## 📋 Overview
Dokumen ini menjelaskan cara menyinkronkan data di **Vercel Production** dengan **Local Development Environment** agar keduanya menggunakan seed data yang sama dan konsisten.

---

## 🎯 Kapan Perlu Sinkronisasi?

Anda perlu melakukan sinkronisasi data ketika:
- ✅ Data production sudah tidak sesuai dengan data development
- ✅ Anda ingin memulai testing dengan data bersih
- ✅ Ada perubahan struktur data di `mockData.js`
- ✅ Terjadi bug/inkonsistensi data (seperti payment status issue)
- ✅ Setelah deploy fitur baru yang memerlukan data fresh

---

## 📦 Data Seed Terbaru (November 2025)

### Konten Seed Data:
```javascript
// src/data/mockData.js

✓ 4 Pasien
  - Anisa Putri (Reguler)
  - Bima Aditya (Premium)
  - Cindy Maharani (Reguler)
  - Daffa Primatama (Corporate)

✓ 4 Pegawai/Terapis
  - dr. Maria Oktaviani (Fisioterapis Senior)
  - Yudha Pratama, S.Ft (Fisioterapis)
  - Farah Nuraini (Terapis Baby Spa)
  - Reno Dwipa (Administrasi)

✓ 4 Layanan
  - Fisioterapi Anak (Rp 250.000)
  - Fisioterapi Ortopedi (Rp 320.000)
  - Baby Spa Basic (Rp 180.000)
  - Baby Massage + Sensory (Rp 450.000)

✓ 4 Kunjungan
  - VIS-001: Anisa Putri (Terjadwal, Belum Bayar)
  - VIS-002: Bima Aditya (Selesai, Lunas) ✅
  - VIS-003: Cindy Maharani (Terjadwal, DP 50%)
  - VIS-004: Daffa Primatama (Terjadwal, Belum Bayar)

✓ 4 Transaksi (UPDATED)
  - TRX-001: Oktober - Rp 320.000 (Lunas) ✅
  - TRX-002: Oktober - Rp 315.000 (DP)
  - TRX-003: November - Rp 250.000 (Lunas) ✅ [NEW]
  - TRX-004: November - Rp 160.000 (DP) [NEW]
```

**Total Pendapatan November 2025:** Rp 410.000 (TRX-003 + TRX-004)

---

## 🚀 Metode Sinkronisasi

### **Metode 1: Reset via UI (Recommended)**

Ini cara **paling mudah dan aman** untuk user non-technical:

#### Step-by-Step:

1. **Buka Production Site**
   ```
   https://[your-project].vercel.app
   ```

2. **Login ke Sistem**
   - Klik menu "⚙️ Pengaturan" di navbar
   - Atau akses langsung: `/pengaturan`

3. **Klik Tombol Reset**
   - Scroll ke atas halaman Pengaturan
   - Klik tombol merah **"🔄 Reset ke Data Awal"**
   - Konfirmasi dialog dengan klik "OK"

4. **Verifikasi Hasil**
   - Kembali ke Dashboard
   - Cek **"Pendapatan Bulan Ini"** → harus **Rp 410.000**
   - Cek **"Status Pembayaran"** → harus ada 3 kunjungan outstanding
   - Cek **"Pendapatan Terbaru"** → harus ada 2 transaksi November

**✅ Done!** Data production sekarang sama dengan local.

---

### **Metode 2: Manual via Browser Console (Advanced)**

Untuk developer yang ingin reset tanpa login:

#### Step-by-Step:

1. **Buka Production Site**
   ```
   https://[your-project].vercel.app
   ```

2. **Buka Developer Tools**
   - Windows/Linux: `F12` atau `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

3. **Buka Tab "Console"**

4. **Jalankan Script Reset**
   ```javascript
   // Clear localStorage
   localStorage.clear();
   
   // Reload page
   window.location.reload();
   ```

5. **Verifikasi**
   - Setelah reload, sistem akan otomatis load seed data
   - Cek Dashboard untuk konfirmasi data

**✅ Done!** Data production direset ke seed data.

---

### **Metode 3: Deploy Fresh Build (Full Reset)**

Untuk reset sempurna dengan build terbaru:

#### Step-by-Step:

1. **Local: Ensure Latest Code**
   ```bash
   git pull origin main
   npm install
   npm run build  # Verify build success
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "sync: update seed data & reset production"
   git push origin main
   ```

3. **Vercel Auto-Deploy**
   - Vercel akan otomatis detect push
   - Build time: ~1-2 minutes
   - Deploy otomatis setelah build success

4. **Reset Production localStorage**
   - Buka production site
   - Gunakan Metode 1 atau Metode 2 untuk clear localStorage

**✅ Done!** Production memiliki code terbaru + data fresh.

---

## 🔍 Cara Verifikasi Data Sudah Sinkron

### Checklist Verifikasi:

#### 1. Dashboard Metrics
```
✓ Total Pasien Aktif: 4
✓ Pendapatan Bulan Ini: Rp 410.000
✓ Tenaga Terapis: 2 (dari 4 pegawai)
✓ Rata-rata Progress: 55%
```

#### 2. Pendapatan Terbaru (Transaksi)
```
✓ TRX-003: Anisa Putri - Rp 250.000 (Lunas) - Nov 2
✓ TRX-004: Daffa Primatama - Rp 160.000 (DP) - Nov 3
✓ TRX-002: Cindy Maharani - Rp 315.000 (DP) - Oct 15
✓ TRX-001: Bima Aditya - Rp 320.000 (Lunas) - Oct 18
```

#### 3. Status Pembayaran (Outstanding)
```
✓ 3 kunjungan membutuhkan tindak lanjut pembayaran:
  - Anisa Putri (Belum Bayar) [After TRX-003, should be empty or Lunas]
  - Cindy Maharani (DP 50%)
  - Daffa Primatama (Belum Bayar) [After TRX-004, should be DP 50%]
```

**⚠️ Note:** Jika Anda sudah membuat TRX-003 dan TRX-004, maka:
- Anisa Putri seharusnya **NOT** muncul di "Status Pembayaran" (karena Lunas)
- Daffa Primatama seharusnya muncul dengan badge **DP 50%**

#### 4. Master Data
```
✓ Master Pasien: 4 pasien
✓ Master Pegawai: 4 pegawai
✓ Master Layanan: 4 layanan
✓ Kunjungan: 4 kunjungan
```

---

## 🎯 Testing Scenario (After Sync)

### Scenario: Create New Transaction to Test Auto-Sync

1. **Buka Halaman Transaksi**
   ```
   https://[your-project].vercel.app/transaksi
   ```

2. **Buat Transaksi Baru**
   - Pilih kunjungan: **Anisa Putri** (VIS-001)
   - Amount: **Rp 250.000**
   - Method: **Cash**
   - Status: **Lunas**
   - Notes: "Test auto-sync payment status"
   - Klik **"Simpan Transaksi"**

3. **Kembali ke Dashboard**
   ```
   https://[your-project].vercel.app/
   ```

4. **Verify Auto-Sync**
   - ✅ "Pendapatan Terbaru" → Harus tampil transaksi baru dengan status "Lunas"
   - ✅ "Status Pembayaran" → Anisa Putri **harus hilang** dari list (karena sudah Lunas)
   - ✅ "Pendapatan Bulan Ini" → Harus bertambah Rp 250.000

**Expected Result:** Kedua tabel konsisten! ✅

---

## 🐛 Troubleshooting

### Problem 1: Data Tidak Reset Setelah Klik Tombol
**Solution:**
```javascript
// Manual clear via Console
localStorage.removeItem('fisiomedState');
window.location.reload();
```

### Problem 2: Build Error di Vercel
**Check:**
```bash
# Local test
npm run build
npm run lint

# If success, push again
git push origin main
```

### Problem 3: Data Production Masih Lama Setelah Deploy
**Solution:**
```
1. Hard refresh browser: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
2. Clear browser cache
3. Open in Incognito/Private window
4. Manual localStorage clear via Console
```

### Problem 4: Payment Status Masih Tidak Sinkron
**Verify:**
1. Check `src/context/AppReducer.js` → pastikan auto-sync logic sudah ada
2. Check Vercel deployment → pastikan build terbaru
3. Clear localStorage → force reload seed data
4. Test create transaksi baru → verify auto-sync works

---

## 📊 Comparison Table

| Aspect | Before Sync | After Sync |
|--------|-------------|------------|
| Total Transactions | Variable (user data) | 4 transaksi seed |
| November Revenue | Depends on user data | Rp 410.000 (TRX-003 + TRX-004) |
| Payment Status Sync | ❌ May be inconsistent | ✅ Consistent (auto-sync) |
| Data Structure | May differ local ↔ prod | ✅ Identical |
| Seed Data Version | Old/Mixed | ✅ Latest (Nov 2025) |

---

## 📝 Best Practices

### For Development:
1. ✅ Always test dengan seed data fresh sebelum deploy
2. ✅ Gunakan `npm run build` untuk verify no errors
3. ✅ Test auto-sync logic setiap kali modify reducer
4. ✅ Document setiap perubahan di mockData.js

### For Production:
1. ✅ Reset data setelah major updates
2. ✅ Verify data consistency setelah deploy
3. ✅ Keep backup jika ada data production penting (export to JSON)
4. ✅ Test critical user flows setelah sync

### For Users:
1. ✅ Gunakan fitur reset hanya jika perlu
2. ✅ Backup data manual (screenshot/export) sebelum reset
3. ✅ Verify data setelah reset
4. ✅ Report issues jika auto-sync tidak bekerja

---

## 🔐 Data Persistence Notes

### Current Storage:
- **Type:** Browser localStorage (client-side only)
- **Capacity:** ~5-10MB per domain
- **Lifespan:** Permanent (until user clears browser data)
- **Sync:** No cross-device sync

### Limitations:
- ❌ Data tidak persist across devices
- ❌ Data hilang jika user clear browser
- ❌ No backup/restore built-in
- ❌ No version control for data

### Future Enhancements:
- [ ] Backend API dengan PostgreSQL/MongoDB
- [ ] Real-time sync across devices
- [ ] Data backup/export to CSV/JSON
- [ ] Version control untuk data changes
- [ ] Multi-tenant support

---

## 📞 Support

Jika mengalami masalah saat sinkronisasi:

1. **Check Documentation:**
   - `README.md` - Setup instructions
   - `docs/BUG_FIX_PAYMENT_STATUS.md` - Payment sync issue
   - `docs/USE_CASE.md` - Use case documentation

2. **GitHub Issues:**
   - Report bug di: https://github.com/ibnuhabibr/fisioterapi_spa/issues
   - Include: Steps to reproduce, screenshots, browser console errors

3. **Contact Developer:**
   - Email: (your email)
   - GitHub: @ibnuhabibr

---

## ✅ Quick Reference

### Reset Production Data (One-liner):
```bash
# Via UI
Navigate to /pengaturan → Click "Reset ke Data Awal"

# Via Console
localStorage.clear(); window.location.reload();
```

### Verify Data Synced:
```bash
# Check Dashboard metrics match expected values
# Check payment status consistency
# Check transaction list has 4 items
```

### Deploy Latest Code:
```bash
git push origin main  # Vercel auto-deploys
```

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.1  
**Status:** ✅ Production Ready
