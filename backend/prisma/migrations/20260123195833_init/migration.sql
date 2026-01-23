-- CreateTable
CREATE TABLE `Tbl_Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(191) NOT NULL,
    `sifre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tbl_Admin_ad_key`(`ad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_AnaSayfa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `baslik` VARCHAR(191) NOT NULL,
    `icerik` TEXT NOT NULL,
    `resim` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_Galeri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `galeriBaslik` VARCHAR(191) NOT NULL,
    `galeriResim` VARCHAR(191) NULL,
    `galeriDetayResimler` TEXT NULL,
    `galeriAciklamasi` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_Hizmetler` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hizmetAdi` VARCHAR(191) NOT NULL,
    `hizmetAciklamasi` TEXT NULL,
    `hizmetKategorisi` VARCHAR(191) NULL,
    `hizmetResim` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_Iletisim` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adSoyad` VARCHAR(191) NOT NULL,
    `ePosta` VARCHAR(191) NOT NULL,
    `konu` VARCHAR(191) NOT NULL,
    `mesaj` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tbl_Slider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sliderAd` VARCHAR(191) NOT NULL,
    `sliderResim` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
