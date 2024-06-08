import { Controller, Get } from '@nestjs/common';
import { StopsService } from '@app/stops/stops.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StopCollection } from '@app/stops/stops.types';

@Controller('stops')
@ApiTags('Stops')
export class StopsController {
    constructor(private readonly stopsService: StopsService) {}

    @Get('')
    @ApiResponse({ status: 200, description: 'Get all stops', type: StopCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getStops(): Promise<StopCollection> {
        return this.stopsService.getStops();
    }
}
