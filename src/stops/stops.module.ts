import { Module } from '@nestjs/common';
import { StopsService } from '@app/stops/stops.service';
import { StopsController } from '@app/stops/stops.controller';

@Module({
    providers: [StopsService],
    controllers: [StopsController],
})
export class StopsModule {}
