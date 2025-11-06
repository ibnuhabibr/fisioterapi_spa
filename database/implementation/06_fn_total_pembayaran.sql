/*
-- =============================================
-- Script: 06_fn_total_pembayaran.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: Function untuk menghitung total
--           pembayaran yang sudah masuk per kunjungan.
-- =============================================
*/

CREATE OR REPLACE FUNCTION fn_GetTotalPembayaran(
    p_kun_id INT8
)
RETURNS DECIMAL(12,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_bayar DECIMAL(12,2);
BEGIN
    -- Menjumlahkan semua pembayaran untuk KUN_ID yang diinput
    SELECT COALESCE(SUM(JUMLAH), 0.00)
    INTO v_total_bayar
    FROM PEMBAYARAN
    WHERE KUN_ID = p_kun_id;

    RETURN v_total_bayar;
END;
$$;

/*
-- Cara Panggil (Kunjungan 1001 = 170000):
SELECT fn_GetTotalPembayaran(1001);

-- Cara Panggil (Kunjungan 1005 = 120000):
SELECT fn_GetTotalPembayaran(1005);
*/
