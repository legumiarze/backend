import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/configs/config.module';
import { MigrationModule } from '@app/migration/migration.module';
import { Neo4jModule } from '@app/neo4j/neo4j.module';
import { StopsModule } from '@app/stops/stops.module';
import { RoutesModule } from '@app/routes/routes.module';

@Module({
    imports: [ConfigModule, RoutesModule, Neo4jModule, MigrationModule, StopsModule],
})
export class AppModule {}
