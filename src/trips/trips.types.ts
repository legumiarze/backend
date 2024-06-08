import { ApiProperty } from '@nestjs/swagger';
import { RouteResource } from '@app/routes/routes.types';
import { StopResource } from '@app/stops/stops.types';

export class TripResource {
    @ApiProperty({ example: '542' })
    tripId: string;

    @ApiProperty({ example: '231' })
    serviceId: string;

    @ApiProperty({ type: RouteResource, nullable: true })
    route?: RouteResource;

    @ApiProperty({ type: [StopResource], nullable: true })
    stops?: StopResource[];
}
