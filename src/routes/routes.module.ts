import { Module } from '@nestjs/common';
import { RoutesService } from '@app/routes/routes.service';
import { RoutesController } from '@app/routes/routes.controller';

@Module({
    providers: [RoutesService],
    controllers: [RoutesController],
})
export class RoutesModule {}
