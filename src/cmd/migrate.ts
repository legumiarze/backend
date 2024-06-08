import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { MigrationService } from '@app/migration/migration.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('MigrateCommand');
    const app = await NestFactory.createApplicationContext(AppModule);
    const migrationService = app.get(MigrationService);

    logger.log('Truncating database...');
    await migrationService.truncate();
    logger.log('Database truncated!');

    logger.log('Building database schema...');
    await migrationService.schema();
    logger.log('Database schema built!');

    logger.log('Loading data for trains...');
    await migrationService.load('file:///kml');
    logger.log('Data for trains loaded!');

    logger.log('Loading data for buses...');
    await migrationService.load('file:///ald');
    logger.log('Data for buses loaded!');

    await app.close();
}

bootstrap();
