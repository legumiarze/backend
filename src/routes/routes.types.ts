import { ApiProperty } from '@nestjs/swagger';
import { StopResource } from '@app/stops/stops.types';
import { TripResource } from '@app/trips/trips.types';

export class RouteResource {
    @ApiProperty({ example: '244' })
    routeId: string;

    @ApiProperty({ example: 'A39' })
    routeShortName: string;

    @ApiProperty({ example: 'Zaczarnie - Brzozówka - Tarnów - A39' })
    routeLongName: string;

    @ApiProperty({ example: 'Zaczarnie - Brzozówka - Tarnów - A39', nullable: false })
    routeDesc: string;

    @ApiProperty({ example: 3 })
    routeType: number;

    @ApiProperty({ example: '000000' })
    routeColor: string;

    @ApiProperty({ example: 'F5F5F5' })
    routeTextColor: string;

    @ApiProperty({ type: () => TripResource, nullable: true })
    trip?: TripResource;

    @ApiProperty({ type: [StopResource], nullable: true })
    stops?: StopResource[];
}

export class RouteCollection {
    @ApiProperty({ type: [RouteResource] })
    data: RouteResource[];
}
