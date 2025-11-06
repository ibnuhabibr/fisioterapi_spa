/*
-- =============================================
-- Script: 02_dummy_data.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: DML (Data Manipulation Language)
--           Mengisi database dengan data dummy
--           untuk pengujian.
-- =============================================
*/

--MASTER: PASIEN
INSERT INTO PASIEN (ID, NO_RM, NAMA, TGL_LAHIR, JK, ALAMAT, NO_HP) VALUES
(1, 'RM-0001', 'Ayla Putri', '2019-06-12', 'P', 'Jl. Melati 10, Bandung', '0812000001'),
(2, 'RM-0002', 'Rafi Alvaro', '2018-02-03', 'L', 'Jl. Anggrek 5, Bandung', '0812000002'),
(3, 'RM-0003', 'Bunga Kirana', '2020-11-20', 'P', 'Jl. Mawar 2, Cimahi', '0812000003'),
(4, 'RM-0004', 'Duta Pradana', '2017-07-15', 'L', 'Jl. Flamboyan 7, Cimahi','0812000004'),
(5, 'RM-0005', 'Nadia Zahra', '2021-04-08', 'P', 'Jl. Kenanga 3, Bandung', '0812000005');

--MASTER: PEGAWAI
INSERT INTO PEGAWAI (ID, NAMA, PERAN) VALUES
(10, 'dr. Sinta', 'DOKTER'),
(11, 'Rama Nugraha', 'FISIOTERAPIS'),
(12, 'Alika Prameswari', 'BIDAN'),
(13, 'Mita Anggraini', 'ADMIN');

--MASTER: LAYANAN
INSERT INTO LAYANAN (ID, NAMA_LAYANAN, HARGA) VALUES
(100, 'Baby Massage', 85000.00),
(101, 'Baby Spa', 120000.00),
(102, 'Terapi Batuk Pilek', 90000.00),
(103, 'Nebulizer', 80000.00),
(104, 'Terapi Tumbuh Kembang',150000.00),
(105, 'Pijat Laktasi', 140000.00),
(106, 'Fisioterapi', 200000.00);

--TRANSAKSI: KUNJUNGAN
INSERT INTO KUNJUNGAN (ID, PAS_ID, WAKTU_DATANG, WAKTU_SELESAI, KELUHAN, USIA_TAHUN, BERAT_KG, TINGGI_CM, CATATAN) VALUES
(1000, 1, '2025-08-20', '2025-08-20', 'Kontrol tumbuh kembang', 6, 18.40, 110.0, 'Anjurkan stimulasi motorik'),
(1001, 2, '2025-08-21', '2025-08-21', 'Batuk pilek', 7, 20.10, 116.0, 'Observasi 3 hari'),
(1002, 3, '2025-08-22', '2025-08-22', 'Ibu nyeri payudara', 5, 15.20, 105.5, 'Edukasi laktasi'),
(1003, 4, '2025-08-23', '2025-08-23', 'Terapi fisio lutut', 8, 24.00, 125.0, 'Home exercise'),
(1004, 5, '2025-08-24', '2025-08-24', 'Pilek ringan', 4, 14.00, 100.0, 'Kontrol bila demam'),
(1005, 1, '2025-08-26', '2025-08-26', 'Spa rutin', 6, 18.60, 111.0, '--');

--DETAIL: KUNJUNGAN_LAYANAN
INSERT INTO KUNJUNGAN_LAYANAN (ID, PEG_ID, KUN_ID, LAY_ID, WAKTU_DILAKUKAN, HARGA) VALUES
(2000, 11, 1000, 104, '2025-08-20', 150000.00), -- Terapi Tumbuh Kembang
(2001, 12, 1001, 102, '2025-08-21', 90000.00), -- Terapi Batuk Pilek
(2002, 10, 1001, 103, '2025-08-21', 80000.00), -- Nebulizer
(2003, 12, 1002, 105, '2025-08-22', 140000.00), -- Pijat Laktasi
(2004, 11, 1003, 106, '2025-08-23', 200000.00), -- Fisioterapi
(2005, 11, 1004, 102, '2025-08-24', 90000.00), -- Terapi Batuk Pilek
(2006, 11, 1005, 101, '2025-08-26', 120000.00); -- Baby Spa

--TRANSAKSI: PEMBAYARAN
INSERT INTO PEMBAYARAN (ID, KUN_ID, TANGGAL, METODE, JUMLAH) VALUES
(3000, 1000, '2025-08-20', 'QRIS', 150000.00),
(3001, 1001, '2025-08-21', 'TUNAI', 100000.00), -- sebagian
(3002, 1001, '2025-08-22', 'TRANSFER', 70000.00), -- pelunasan
(3003, 1002, '2025-08-22', 'DEBIT', 140000.00),
(3004, 1003, '2025-08-23', 'KREDIT', 200000.00),
(3005, 1004, '2025-08-24', 'QRIS', 90000.00),
(3006, 1005, '2025-08-26', 'QRIS', 120000.00);
