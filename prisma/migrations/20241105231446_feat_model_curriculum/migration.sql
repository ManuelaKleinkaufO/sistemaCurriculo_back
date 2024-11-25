-- CreateTable
CREATE TABLE `Curriculo` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `endereco_web` VARCHAR(191) NULL,
    `experiencia` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,

    UNIQUE INDEX `Curriculo_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
