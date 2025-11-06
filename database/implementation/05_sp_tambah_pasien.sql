/*
-- =============================================
-- Script: 05_sp_tambah_pasien.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: Stored Procedure untuk mendaftarkan
--           pasien baru. (PostgreSQL/plpgsql)
-- =============================================
*/

CREATE OR REPLACE PROCEDURE sp_TambahPasienBaru(
    p_id INT8,
    p_no_rm VARCHAR(20),
    p_nama VARCHAR(100),
    p_tgl_lahir DATE,
    p_jk VARCHAR(1)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO PASIEN(ID, NO_RM, NAMA, TGL_LAHIR, JK, ALAMAT, NO_HP)
    VALUES (p_id, p_no_rm, p_nama, p_tgl_lahir, p_jk, NULL, NULL);
END;
$$;

/*
-- Cara Panggil:
CALL sp_TambahPasienBaru(6, 'RM-0006', 'Kevin Sanjaya', '2022-01-01', 'L');

-- Cek Hasil:
SELECT * FROM PASIEN WHERE ID = 6;
*/
