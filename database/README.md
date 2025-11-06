# Proyek Basis Data Rekam Medis (Klinik Fisioterapi)

Repositori ini berisi script SQL untuk tugas mata kuliah Basis Data Lanjut.

## 📁 Struktur Folder

```
database/
├── schema/
│   └── 01_build_tables.sql          # DDL: Membuat tabel dan relasi
│
├── data/
│   └── 02_dummy_data.sql            # DML: Insert data dummy untuk testing
│
├── implementation/
│   ├── 03_query_join.sql            # Query JOIN 5 tabel
│   ├── 04_query_subquery.sql        # Query dengan Subquery (IN)
│   ├── 05_sp_tambah_pasien.sql      # Stored Procedure: Tambah Pasien Baru
│   ├── 06_fn_total_pembayaran.sql   # Function: Hitung Total Pembayaran
│   └── 07_sp_cursor_tagihan.sql     # Stored Procedure dengan Cursor
│
└── README.md                         # Dokumentasi ini
```

---

## 🚀 Urutan Eksekusi

Jalankan script SQL dalam urutan berikut:

1. **Schema (DDL)**: `schema/01_build_tables.sql`
   - Membuat 6 tabel: PASIEN, PEGAWAI, LAYANAN, KUNJUNGAN, KUNJUNGAN_LAYANAN, PEMBAYARAN
   - Membuat relasi (Foreign Key) antar tabel

2. **Data (DML)**: `data/02_dummy_data.sql`
   - Insert 5 pasien, 4 pegawai, 7 layanan
   - Insert 6 kunjungan, 7 detail layanan, 7 pembayaran

3. **Implementation**: Jalankan script di folder `implementation/`
   - Query JOIN untuk menampilkan riwayat kunjungan lengkap
   - Query Subquery untuk mencari pasien berdasarkan layanan
   - Stored Procedure untuk tambah pasien baru
   - Function untuk hitung total pembayaran per kunjungan
   - Stored Procedure dengan Cursor untuk hitung total tagihan

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌──────────────┐
│   PASIEN    │         │   PEGAWAI    │
├─────────────┤         ├──────────────┤
│ ID (PK)     │         │ ID (PK)      │
│ NO_RM       │         │ NAMA         │
│ NAMA        │         │ PERAN        │
│ TGL_LAHIR   │         └──────────────┘
│ JK          │                │
│ ALAMAT      │                │
│ NO_HP       │                │
└─────────────┘                │
       │                       │
       │ 1                     │
       │                       │
       │ N                     │
┌─────────────┐                │
│  KUNJUNGAN  │                │
├─────────────┤                │
│ ID (PK)     │                │
│ PAS_ID (FK) │◄───────────────┘
│ WAKTU_DATANG│
│ WAKTU_SELESAI│
│ KELUHAN     │
│ CATATAN     │
└─────────────┘
       │
       │ 1
       │
       │ N
┌──────────────────┐      ┌─────────────┐
│ KUNJUNGAN_LAYANAN│  N   │   LAYANAN   │
├──────────────────┤◄────►├─────────────┤
│ ID (PK)          │  1   │ ID (PK)     │
│ KUN_ID (FK)      │      │ NAMA_LAYANAN│
│ LAY_ID (FK)      │      │ HARGA       │
│ PEG_ID (FK)      │      └─────────────┘
│ WAKTU_DILAKUKAN  │
│ HARGA            │
└──────────────────┘
       │
       │ 1
       │
       │ N
┌─────────────┐
│ PEMBAYARAN  │
├─────────────┤
│ ID (PK)     │
│ KUN_ID (FK) │
│ TANGGAL     │
│ METODE      │
│ JUMLAH      │
└─────────────┘
```

---

## 📝 Deskripsi Tabel

### 1. **PASIEN**
Menyimpan data master pasien klinik.
- Primary Key: `ID`
- Atribut: NO_RM (Nomor Rekam Medis), NAMA, TGL_LAHIR, JK (Jenis Kelamin), ALAMAT, NO_HP

### 2. **PEGAWAI**
Menyimpan data master pegawai (dokter, fisioterapis, bidan, admin).
- Primary Key: `ID`
- Atribut: NAMA, PERAN

### 3. **LAYANAN**
Menyimpan daftar layanan yang tersedia (Baby Spa, Fisioterapi, dll).
- Primary Key: `ID`
- Atribut: NAMA_LAYANAN, HARGA

### 4. **KUNJUNGAN**
Menyimpan transaksi kunjungan pasien ke klinik.
- Primary Key: `ID`
- Foreign Key: `PAS_ID` → PASIEN(ID)
- Atribut: WAKTU_DATANG, WAKTU_SELESAI, KELUHAN, USIA_TAHUN, BERAT_KG, TINGGI_CM, CATATAN

### 5. **KUNJUNGAN_LAYANAN** (Junction Table)
Menyimpan detail layanan yang diterima pasien per kunjungan (many-to-many).
- Primary Key: `ID`
- Foreign Keys:
  - `KUN_ID` → KUNJUNGAN(ID)
  - `LAY_ID` → LAYANAN(ID)
  - `PEG_ID` → PEGAWAI(ID)
- Atribut: WAKTU_DILAKUKAN, HARGA

### 6. **PEMBAYARAN**
Menyimpan transaksi pembayaran per kunjungan.
- Primary Key: `ID`
- Foreign Key: `KUN_ID` → KUNJUNGAN(ID)
- Atribut: TANGGAL, METODE (TUNAI/TRANSFER/QRIS/DEBIT/KREDIT), JUMLAH

---

## 🧪 Contoh Testing

### 1. Query JOIN (5 tabel)
```sql
-- File: implementation/03_query_join.sql
-- Output: Riwayat kunjungan lengkap dengan nama pasien, layanan, pegawai, harga
SELECT * FROM ...;
```

### 2. Query Subquery
```sql
-- File: implementation/04_query_subquery.sql
-- Output: Pasien yang pernah mengambil layanan "Terapi Batuk Pilek"
SELECT * FROM PASIEN WHERE ID IN (...);
```

### 3. Stored Procedure
```sql
-- File: implementation/05_sp_tambah_pasien.sql
-- Testing:
CALL sp_TambahPasienBaru(6, 'RM-0006', 'Kevin Sanjaya', '2022-01-01', 'L');
SELECT * FROM PASIEN WHERE ID = 6;
```

### 4. Function
```sql
-- File: implementation/06_fn_total_pembayaran.sql
-- Testing (Total pembayaran kunjungan 1001 = Rp 170.000):
SELECT fn_GetTotalPembayaran(1001);
```

### 5. Cursor
```sql
-- File: implementation/07_sp_cursor_tagihan.sql
-- Testing (Total tagihan kunjungan 1001 = Rp 170.000):
CALL sp_HitungTotalTagihan_Cursor(1001, NULL);
```

---

## 💡 Catatan Penting

- **DBMS**: Script ini ditulis untuk **PostgreSQL** (syntax plpgsql)
- **Constraint**: Semua foreign key menggunakan `ON DELETE RESTRICT` untuk integritas data
- **Data Types**: 
  - `INT8` = BIGINT (8-byte integer)
  - `INT4` = INTEGER (4-byte integer)
  - `DECIMAL(12,2)` = Angka dengan 12 digit total, 2 desimal
- **Testing**: Gunakan data dummy di `02_dummy_data.sql` untuk pengujian

---

## 📚 Referensi

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- PL/pgSQL Tutorial: https://www.postgresql.org/docs/current/plpgsql.html
- SQL Query Best Practices: https://www.sqlstyle.guide/

---

## 👨‍💻 Author

**Proyek Basis Data Lanjut**  
Klinik Fisioterapi & Baby Spa  
© 2025

---

## 📄 License

This project is for educational purposes only.
