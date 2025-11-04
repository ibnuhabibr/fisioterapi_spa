# FisioMed – Sistem Rekam Medis Klinik Fisioterapi & Baby Spa

FisioMed adalah prototipe Single Page Application (SPA) berbasis React untuk mengelola operasional klinik fisioterapi dan baby spa. Aplikasi ini menyediakan fitur CRUD lengkap di sisi client dengan persistensi `localStorage`, mendukung pengelolaan pasien, pegawai, layanan, kunjungan, transaksi, dan laporan real-time.

## ✨ Fitur Utama

- **Layout konsisten** di seluruh halaman menggunakan satu komponen `Layout` dengan navbar, konten full-width, dan footer.
- **State global** menggunakan React Context + `useReducer`, otomatis tersimpan di `localStorage` dan dapat direset ke mock data.
- **CRUD lengkap** untuk pasien, pegawai, layanan, kunjungan, transaksi, dan pengaturan klinik.
- **Laporan interaktif** menampilkan metrik finansial, distribusi layanan, dan aktivitas terbaru.
- **Detail kunjungan** dengan pembaruan status, progres terapi, dan pencatatan transaksi langsung.

## 🛠️ Teknologi

- [React 19](https://react.dev/) dengan Vite
- [React Router DOM](https://reactrouter.com/) v7 untuk navigasi bertingkat
- [React-Bootstrap](https://react-bootstrap.netlify.app/) + Bootstrap 5 untuk komponen UI siap pakai
- Context API + `useReducer` + `localStorage` untuk manajemen state dan persistensi

## 🚀 Cara Menjalankan

Pastikan Node.js ≥ 18 sudah terpasang.

```bash
npm install
npm run dev
```

Server pengembangan akan aktif di [`http://localhost:5173`](http://localhost:5173).

## 📁 Struktur Direktori Penting

- `src/components/Layout.jsx` – Layout global dengan navbar, `<Outlet />`, dan footer.
- `src/context/` – State global (`GlobalState.jsx`, `AppReducer.js`).
- `src/data/mockData.js` – Seed data awal yang dimuat ke `localStorage`.
- `src/pages/` – Halaman fitur (Dashboard, Master data, Kunjungan, Laporan, dsb.).

## 🔄 Reset Data

Gunakan tombol **“Reset ke Data Awal”** pada halaman Pengaturan untuk mengembalikan seluruh data ke mock data bawaan.

## 🧭 Navigasi Cepat

- `/` – Dashboard
- `/pasien` – Master Pasien
- `/pegawai` – Master Pegawai
- `/layanan` – Master Layanan
- `/kunjungan` – Jadwal & Monitoring kunjungan
- `/kunjungan/:id` – Detail kunjungan & transaksi
- `/transaksi` – Manajemen transaksi
- `/laporan` – Laporan operasional & finansial
- `/pengaturan` – Pengaturan klinik & reset data
- `/login` – Simulasi login petugas shift

## 📄 Lisensi

Proyek ini dibuat sebagai prototipe internal untuk kebutuhan Klinik Fisioterapi & Baby Spa. Silakan modifikasi sesuai kebutuhan operasional.
