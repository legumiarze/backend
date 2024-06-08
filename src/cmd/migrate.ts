import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { MigrationService } from '@app/migration/migration.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('MigrateCommand');
    const app = await NestFactory.createApplicationContext(AppModule);
    const migrationService = app.get(MigrationService);

    logger.log('Starting migration...');
    await migrationService.migrate();
    logger.log('Migration completed!');

    await app.close();
}

bootstrap();
