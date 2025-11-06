/*
-- =============================================
-- Script: 03_query_join.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: Menampilkan riwayat kunjungan lengkap
--           (Join 5 tabel)
-- =============================================
*/

SELECT
    p.NAMA AS Nama_Pasien,
    k.WAKTU_DATANG,
    k.KELUHAN,
    l.NAMA_LAYANAN,
    pg.NAMA AS Nama_Pegawai,
    kl.HARGA AS Harga_Tagihan
FROM
    PASIEN p
JOIN
    KUNJUNGAN k ON p.ID = k.PAS_ID
JOIN
    KUNJUNGAN_LAYANAN kl ON k.ID = kl.KUN_ID
JOIN
    LAYANAN l ON kl.LAY_ID = l.ID
JOIN
    PEGAWAI pg ON kl.PEG_ID = pg.ID;
