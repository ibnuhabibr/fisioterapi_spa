/*
-- =============================================
-- Script: 01_build_tables.sql
-- Proyek: Basis Data Rekam Medis
-- Deskripsi: DDL (Data Definition Language)
--           Membuat semua tabel, primary key,
--           dan foreign key.
-- =============================================
*/

-- Tabel: PASIEN
CREATE TABLE PASIEN (
   ID                 INT8                 NOT NULL,
   NO_RM              VARCHAR(20)          NOT NULL,
   NAMA               VARCHAR(100)         NOT NULL,
   TGL_LAHIR          DATE                 NULL,
   JK                 VARCHAR(1)           NULL,
   ALAMAT             VARCHAR(200)         NULL,
   NO_HP              VARCHAR(30)          NULL,
   CONSTRAINT PK_PASIEN PRIMARY KEY (ID)
);

-- Tabel: PEGAWAI
CREATE TABLE PEGAWAI (
   ID                 INT8                 NOT NULL,
   NAMA               VARCHAR(100)         NOT NULL,
   PERAN              VARCHAR(14)          NOT NULL,
   CONSTRAINT PK_PEGAWAI PRIMARY KEY (ID)
);

-- Tabel: LAYANAN
CREATE TABLE LAYANAN (
   ID                 INT8                 NOT NULL,
   NAMA_LAYANAN       VARCHAR(100)         NOT NULL,
   HARGA              DECIMAL(12,2)        NOT NULL,
   CONSTRAINT PK_LAYANAN PRIMARY KEY (ID)
);

-- Tabel: KUNJUNGAN
CREATE TABLE KUNJUNGAN (
   ID                 INT8                 NOT NULL,
   PAS_ID             INT8                 NOT NULL,
   WAKTU_DATANG       DATE                 NOT NULL,
   WAKTU_SELESAI      DATE                 NULL,
   KELUHAN            VARCHAR(500)         NULL,
   USIA_TAHUN         INT4                 NULL,
   BERAT_KG           DECIMAL(5,2)         NULL,
   TINGGI_CM          DECIMAL(5,2)         NULL,
   CATATAN            VARCHAR(500)         NULL,
   CONSTRAINT PK_KUNJUNGAN PRIMARY KEY (ID)
);

-- Tabel: PEMBAYARAN
CREATE TABLE PEMBAYARAN (
   ID                 INT8                 NOT NULL,
   KUN_ID             INT8                 NOT NULL,
   TANGGAL            DATE                 NOT NULL,
   METODE             VARCHAR(10)          NOT NULL,
   JUMLAH             DECIMAL(12,2)        NOT NULL,
   CONSTRAINT PK_PEMBAYARAN PRIMARY KEY (ID)
);

-- Tabel: KUNJUNGAN_LAYANAN (Junction Table)
CREATE TABLE KUNJUNGAN_LAYANAN (
   ID                 INT8                 NOT NULL,
   PEG_ID             INT8                 NULL,
   KUN_ID             INT8                 NOT NULL,
   LAY_ID             INT8                 NOT NULL,
   WAKTU_DILAKUKAN    DATE                 NOT NULL,
   HARGA              DECIMAL(12,2)        NOT NULL,
   CONSTRAINT PK_KUNJUNGAN_LAYANAN PRIMARY KEY (ID)
);

-- === MEMBUAT FOREIGN KEYS ===

ALTER TABLE KUNJUNGAN
   ADD CONSTRAINT FK_KUNJUNGA_RELATIONS_PASIEN FOREIGN KEY (PAS_ID)
      REFERENCES PASIEN (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE KUNJUNGAN_LAYANAN
   ADD CONSTRAINT FK_KUNJUNGA_RELATIONS_KUNJUNGA FOREIGN KEY (KUN_ID)
      REFERENCES KUNJUNGAN (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE KUNJUNGAN_LAYANAN
   ADD CONSTRAINT FK_KUNJUNGA_RELATIONS_LAYANAN FOREIGN KEY (LAY_ID)
      REFERENCES LAYANAN (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE KUNJUNGAN_LAYANAN
   ADD CONSTRAINT FK_KUNJUNGA_RELATIONS_PEGAWAI FOREIGN KEY (PEG_ID)
      REFERENCES PEGAWAI (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PEMBAYARAN
   ADD CONSTRAINT FK_PEMBAYAR_RELATIONS_KUNJUNGA FOREIGN KEY (KUN_ID)
      REFERENCES KUNJUNGAN (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;
