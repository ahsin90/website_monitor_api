-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_websiteId_fkey` FOREIGN KEY (`websiteId`) REFERENCES `Websites`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
