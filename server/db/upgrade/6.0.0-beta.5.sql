RENAME TABLE `deleted_proxy_emails` TO `deleted_aliases`;
RENAME TABLE `proxy_emails` TO `aliases`;
ALTER TABLE `aliases` DROP FOREIGN KEY `fk__proxy_emails__domainId`; ALTER TABLE `aliases` ADD CONSTRAINT `fk__aliases__domainId` FOREIGN KEY (`domainId`) REFERENCES `domains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE; ALTER TABLE `aliases` DROP FOREIGN KEY `fk__proxy_emails__userId`; ALTER TABLE `aliases` ADD CONSTRAINT `fk__aliases__userId` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ptorx`.`aliases` DROP INDEX `fk__proxy_emails__domainId`, ADD INDEX `fk__aliases__domainId` (`domainId`) USING BTREE;
ALTER TABLE `deleted_aliases` DROP FOREIGN KEY `fk__deleted_proxy_emails__domainId`; ALTER TABLE `deleted_aliases` ADD CONSTRAINT `fk__deleted_aliases__domainId` FOREIGN KEY (`domainId`) REFERENCES `domains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `links` CHANGE `proxyEmailId` `aliasId` INT(10) UNSIGNED NOT NULL;
ALTER TABLE `links` DROP FOREIGN KEY `fk__link__proxyEmailId`; ALTER TABLE `links` ADD CONSTRAINT `fk__link__aliasId` FOREIGN KEY (`aliasId`) REFERENCES `aliases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `messages` CHANGE `proxyEmailId` `aliasId` INT(10) UNSIGNED NOT NULL;
ALTER TABLE `messages` DROP FOREIGN KEY `fk__messages__proxyEmailId`; ALTER TABLE `messages` ADD CONSTRAINT `fk__messages__aliasId` FOREIGN KEY (`aliasId`) REFERENCES `aliases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ptorx`.`messages` DROP INDEX `fk__messages__proxyEmailId`, ADD INDEX `fk__messages__aliasId` (`aliasId`) USING BTREE;

ALTER TABLE `users` ADD `publicKey` TEXT NULL DEFAULT NULL AFTER `tierExpiration`, ADD `privateKey` TEXT NULL DEFAULT NULL AFTER `publicKey`;