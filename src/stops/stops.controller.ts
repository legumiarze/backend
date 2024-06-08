import { Controller, Get, Param, Query } from '@nestjs/common';
import { StopsService } from '@app/stops/stops.service';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StopCollection, StopResource } from '@app/stops/stops.types';

@Controller('stops')
@ApiTags('Stops')
export class StopsController {
    constructor(private readonly stopsService: StopsService) {}

    @Get('')
    @ApiQuery({ name: 'swLat', type: Number, required: false })
    @ApiQuery({ name: 'swLon', type: Number, required: false })
    @ApiQuery({ name: 'neLat', type: Number, required: false })
    @ApiQuery({ name: 'neLon', type: Number, required: false })
    @ApiResponse({ status: 200, description: 'Get all stops', type: StopCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getStops(
        @Query('swLat') swLat?: number,
        @Query('swLon') swLon?: number,
        @Query('neLat') neLat?: number,
        @Query('neLon') neLon?: number,
    ): Promise<StopCollection> {
        return this.stopsService.getStops(swLat, swLon, neLat, neLon);
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: Number, required: true })
    @ApiResponse({ status: 200, description: 'Get a stop by ID', type: StopResource })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getStopById(@Param('id') id: string): Promise<StopResource> {
        return this.stopsService.getStopById(id);
    }
}
