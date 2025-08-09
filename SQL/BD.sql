create table if not exists `heroclash4geeks`.`characters` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `characterClass` VARCHAR(255) NULL,
    `attack` INT UNSIGNED NULL,
    `hp` INT UNSIGNED NULL,
    `level` INT UNSIGNED NULL,
    `mana` INT UNSIGNED NULL,
    PRIMARY KEY (`id`));d