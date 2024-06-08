import { Module } from '@nestjs/common';
import { MigrationService } from '@app/migration/migration.service';

@Module({
    providers: [MigrationService],
    exports: [MigrationService],
})
export class MigrationModule {}
