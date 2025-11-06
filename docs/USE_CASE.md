# Use Case Documentation - FisioMed System

## Overview

Sistem Rekam Medis Klinik Fisioterapi & Baby Spa dengan fitur lengkap CRUD, manajemen kunjungan, transaksi pembayaran, dan pelaporan real-time.

---

## Actors

### 1. Front Office / Admin (Primary Actor)

**Role:** Staf administrasi yang mengelola operasional harian klinik
**Responsibilities:**

- Mengelola data master (pasien, pegawai, layanan)
- Menjadwalkan dan mengelola kunjungan pasien
- Mencatat transaksi pembayaran
- Melihat laporan dan dashboard
- Mengatur konfigurasi sistem

**Access Level:** Full access to all features

---

### 2. Terapis (Secondary Actor)

**Role:** Fisioterapis atau terapis baby spa yang menangani pasien
**Responsibilities:**

- Melihat jadwal kunjungan
- Update progress terapi pasien
- Update status kunjungan (Proses/Selesai)
- Melihat detail kunjungan pasien

**Access Level:** Limited to visit management and patient progress

---

### 3. Pasien (External Actor)

**Role:** Pasien yang menerima layanan di klinik
**Interaction:**

- Data dikelola oleh Admin/Front Office
- Menerima notifikasi reminder (via WhatsApp)
- Dapat melihat detail kunjungan sendiri (future enhancement)

**Access Level:** View-only (not implemented in current version)

---

### 4. System (Automated Actor)

**Role:** Proses otomatis yang berjalan di background
**Responsibilities:**

- Auto-sync payment status (visit ↔ transaction)
- Kirim reminder WhatsApp (jika diaktifkan)
- Generate daily summary email (jika diaktifkan)
- Validasi data dan business rules

**Trigger:** Event-driven (transaction created/updated/deleted)

---

## Use Case List

### Authentication & Authorization

| ID    | Use Case                 | Actor            | Priority |
| ----- | ------------------------ | ---------------- | -------- |
| UC-01 | Login / Shift Management | Admin, Therapist | High     |
| UC-02 | Manage Active User       | Admin            | Medium   |

### Dashboard & Monitoring

| ID    | Use Case           | Actor            | Priority |
| ----- | ------------------ | ---------------- | -------- |
| UC-03 | Lihat Dashboard    | Admin, Therapist | High     |
| UC-04 | View Notifications | Admin            | Medium   |

### Master Data Management

| ID    | Use Case              | Actor | Priority |
| ----- | --------------------- | ----- | -------- |
| UC-05 | Kelola Pasien (CRUD)  | Admin | High     |
| UC-06 | Kelola Pegawai (CRUD) | Admin | High     |
| UC-07 | Kelola Layanan (CRUD) | Admin | High     |

### Visit Management

| ID    | Use Case                | Actor            | Priority |
| ----- | ----------------------- | ---------------- | -------- |
| UC-08 | Jadwalkan Kunjungan     | Admin            | Critical |
| UC-09 | Update Status Kunjungan | Admin, Therapist | High     |
| UC-10 | Update Progress Terapi  | Admin, Therapist | High     |
| UC-11 | Lihat Detail Kunjungan  | Admin, Therapist | Medium   |

### Transaction & Payment

| ID    | Use Case                     | Actor  | Priority     |
| ----- | ---------------------------- | ------ | ------------ |
| UC-12 | Catat Transaksi              | Admin  | Critical     |
| UC-13 | Update Transaksi             | Admin  | High         |
| UC-14 | Hapus Transaksi              | Admin  | Medium       |
| UC-15 | **Auto-Sync Payment Status** | System | **Critical** |

### Reporting & Analytics

| ID    | Use Case                 | Actor | Priority |
| ----- | ------------------------ | ----- | -------- |
| UC-16 | Lihat Laporan Keuangan   | Admin | High     |
| UC-17 | Analisis Kinerja Layanan | Admin | Medium   |
| UC-18 | Export Laporan           | Admin | Low      |

### Settings & Configuration

| ID    | Use Case                 | Actor | Priority |
| ----- | ------------------------ | ----- | -------- |
| UC-19 | Update Pengaturan Klinik | Admin | Medium   |
| UC-20 | Reset Data ke Seed       | Admin | Low      |

### Automated Processes

| ID    | Use Case                | Actor  | Priority |
| ----- | ----------------------- | ------ | -------- |
| UC-21 | Kirim Reminder WhatsApp | System | Medium   |
| UC-22 | Generate Daily Summary  | System | Low      |

---

## Critical Use Case: UC-15 Auto-Sync Payment Status

### Description

**PERBAIKAN BUG (November 2025):** Sistem otomatis menyinkronkan status pembayaran antara `transaction` dan `visit` untuk mencegah inkonsistensi data di Dashboard.

### Problem Statement

**Before Fix:**

- Tabel "Pendapatan Terbaru" menampilkan transaksi dengan status "Lunas"
- Tabel "Status Pembayaran" masih menampilkan kunjungan dengan status "Belum Bayar"
- **Root Cause:** Dua sumber data berbeda tidak tersinkronisasi

### Solution Implemented

**Auto-sync logic di AppReducer.js:**

```javascript
case actionTypes.ADD_TRANSACTION:
  // Auto-sync: Update visit paymentStatus berdasarkan transaction status
  const newTransaction = action.payload;
  const visitToUpdate = state.visits.find(v => v.id === newTransaction.visitId);

  if (visitToUpdate) {
    const newPaymentStatus =
      newTransaction.status.toLowerCase() === "lunas" ? "Lunas" :
      newTransaction.status.toLowerCase() === "dp" ? "DP 50%" :
      "Belum Bayar";

    updatedVisits = state.visits.map(visit =>
      visit.id === newTransaction.visitId
        ? { ...visit, paymentStatus: newPaymentStatus }
        : visit
    );
  }
```

### Business Rules

1. **Transaction "Lunas"** → Visit paymentStatus = "Lunas"
2. **Transaction "DP"** → Visit paymentStatus = "DP 50%"
3. **Transaction deleted** → Visit paymentStatus = "Belum Bayar"
4. **Transaction updated** → Visit paymentStatus sync automatically

### Acceptance Criteria

✅ Ketika transaksi baru dibuat dengan status "Lunas", visit.paymentStatus otomatis update ke "Lunas"
✅ Ketika transaksi diupdate dari "DP" ke "Lunas", visit.paymentStatus otomatis update
✅ Ketika transaksi dihapus, visit.paymentStatus reset ke "Belum Bayar"
✅ Dashboard "Pendapatan Terbaru" dan "Status Pembayaran" menampilkan data konsisten
✅ Tidak ada manual sync required dari user

### Testing Scenarios

**Scenario 1: Create Lunas Transaction**

```
Given: Visit with paymentStatus = "Belum Bayar"
When: Admin creates transaction with status = "Lunas"
Then: Visit paymentStatus automatically updated to "Lunas"
And: Dashboard shows consistent data in both tables
```

**Scenario 2: Create DP Transaction**

```
Given: Visit with paymentStatus = "Belum Bayar"
When: Admin creates transaction with status = "DP"
Then: Visit paymentStatus automatically updated to "DP 50%"
And: Visit appears in "Status Pembayaran" list as outstanding
```

**Scenario 3: Update DP to Lunas**

```
Given: Visit with paymentStatus = "DP 50%"
And: Existing transaction with status = "DP"
When: Admin updates transaction status to "Lunas"
Then: Visit paymentStatus automatically updated to "Lunas"
And: Visit removed from "Status Pembayaran" outstanding list
```

**Scenario 4: Delete Transaction**

```
Given: Visit with paymentStatus = "Lunas"
And: Existing transaction with status = "Lunas"
When: Admin deletes the transaction
Then: Visit paymentStatus automatically reset to "Belum Bayar"
And: Visit appears back in "Status Pembayaran" list
```

---

## File Mapping

### Use Case → Component Mapping

| Use Case | File Path                       | Component                                                            |
| -------- | ------------------------------- | -------------------------------------------------------------------- |
| UC-01    | `src/pages/Login.jsx`           | Login                                                                |
| UC-03    | `src/pages/Dashboard.jsx`       | Dashboard                                                            |
| UC-05    | `src/pages/MasterPasien.jsx`    | MasterPasien                                                         |
| UC-06    | `src/pages/MasterPegawai.jsx`   | MasterPegawai                                                        |
| UC-07    | `src/pages/MasterLayanan.jsx`   | MasterLayanan                                                        |
| UC-08    | `src/pages/Kunjungan.jsx`       | Kunjungan                                                            |
| UC-11    | `src/pages/DetailKunjungan.jsx` | DetailKunjungan                                                      |
| UC-12    | `src/pages/Transaksi.jsx`       | Transaksi                                                            |
| UC-15    | `src/context/AppReducer.js`     | appReducer (ADD_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION) |
| UC-16    | `src/pages/Laporan.jsx`         | Laporan                                                              |
| UC-19    | `src/pages/Pengaturan.jsx`      | Pengaturan                                                           |

### State Management

- **Global State:** `src/context/GlobalState.jsx`
- **Reducer Logic:** `src/context/AppReducer.js`
- **Mock Data:** `src/data/mockData.js`

---

## Deployment Notes

### Vercel Deployment

- **URL:** https://fisioterapi-spa.vercel.app (or your custom domain)
- **Auto-deploy:** On push to main branch
- **Environment:** Production
- **Storage:** Browser localStorage (client-side only)

### Known Limitations

1. **Data persistence:** localStorage only (no backend database)
2. **Multi-user:** No real-time sync between devices
3. **Authentication:** Mock only (no real security)
4. **File uploads:** Not supported
5. **Export features:** Not implemented yet

### Future Enhancements

- [ ] Real backend API (Node.js + PostgreSQL)
- [ ] Multi-user real-time sync (WebSocket)
- [ ] Proper authentication & authorization (JWT)
- [ ] File upload for patient documents
- [ ] PDF export for reports
- [ ] WhatsApp API integration
- [ ] Email notification service
- [ ] Mobile responsive improvements
- [ ] PWA support (offline mode)

---

## How to Render Use Case Diagram

### Option 1: Online PlantUML Editor

1. Open https://www.plantuml.com/plantuml/uml/
2. Copy content from `docs/use-case-diagram.puml`
3. Paste and render
4. Download as PNG/SVG

### Option 2: VS Code Extension

1. Install "PlantUML" extension
2. Open `docs/use-case-diagram.puml`
3. Press `Alt+D` to preview
4. Right-click → Export to PNG/SVG

### Option 3: CLI (requires Java + Graphviz)

```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG
puml generate docs/use-case-diagram.puml -o docs/use-case-diagram.png
```

---

## Changelog

### Version 1.0.1 (November 2025)

- **[CRITICAL FIX]** UC-15: Implemented auto-sync payment status
- Fixed data inconsistency in Dashboard tables
- Added comprehensive use case documentation
- Created PlantUML diagram for visual reference

### Version 1.0.0 (October 2025)

- Initial release with full CRUD functionality
- Dashboard with real-time metrics
- Transaction management
- Report generation
- Settings & configuration

---

## Contact & Support

- **Developer:** FisioMed Development Team
- **Repository:** https://github.com/ibnuhabibr/fisioterapi_spa
- **Documentation:** See `README.md` for setup instructions
