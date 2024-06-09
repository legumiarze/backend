import { TripResource } from '@app/trips/trips.types';
import { ApiProperty } from '@nestjs/swagger';

export class SearchResource {
    trips: TripResource[];
}

export class SearchCollection {
    @ApiProperty({ type: [SearchResource] })
    data: SearchResource[];
}
