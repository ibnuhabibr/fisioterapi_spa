/*
-- =============================================
-- Script: 04_query_subquery.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: Menampilkan pasien yang pernah
--           mengambil layanan 'Terapi Batuk Pilek'
-- =============================================
*/

SELECT
    NAMA,
    NO_RM
FROM
    PASIEN
WHERE
    ID IN (
        -- Subquery: Cari semua PAS_ID yang pernah ambil layanan ID 102
        SELECT k.PAS_ID
        FROM KUNJUNGAN k
        JOIN KUNJUNGAN_LAYANAN kl ON k.ID = kl.KUN_ID
        WHERE kl.LAY_ID = 102 -- ID 102 adalah 'Terapi Batuk Pilek'
    );
