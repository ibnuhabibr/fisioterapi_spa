/*
-- =============================================
-- Script: 07_sp_cursor_tagihan.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: Stored Procedure (dengan Cursor)
--           untuk menghitung total tagihan
--           (dari multi-layanan) per kunjungan.
-- =============================================
*/

CREATE OR REPLACE PROCEDURE sp_HitungTotalTagihan_Cursor(
    p_kun_id IN INT8,
    p_total_tagihan OUT DECIMAL(12,2) -- Parameter OUT untuk nyimpen hasil
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_harga_layanan DECIMAL(12,2);
    
    -- 1. Deklarasi Cursor
    cur_layanan CURSOR(c_kun_id INT8) FOR
        SELECT HARGA
        FROM KUNJUNGAN_LAYANAN
        WHERE KUN_ID = c_kun_id;
BEGIN
    p_total_tagihan := 0.00;

    -- 2. Buka Cursor
    OPEN cur_layanan(p_kun_id);

    LOOP
        -- 3. Ambil data per baris
        FETCH cur_layanan INTO v_harga_layanan;
        
        -- Keluar loop jika data habis
        EXIT WHEN NOT FOUND;

        -- 4. Proses data (menjumlahkan)
        p_total_tagihan := p_total_tagihan + v_harga_layanan;
    END LOOP;

    -- 5. Tutup Cursor
    CLOSE cur_layanan;
END;
$$;

/*
-- Cara Panggil (Kunjungan 1001 = 90rb + 80rb = 170000):
CALL sp_HitungTotalTagihan_Cursor(1001, NULL);
*/
