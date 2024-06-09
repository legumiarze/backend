import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TripCollection } from '@app/trips/trips.types';
import { TripsService } from '@app/trips/trips.service';

@Controller('trips')
@ApiTags('Trips')
export class TripsController {
    constructor(private readonly tripsService: TripsService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Get all trips', type: TripCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getTrips(): Promise<TripCollection> {
        return this.tripsService.getTrips();
    }
}
