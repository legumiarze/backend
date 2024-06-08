import { ApiProperty } from '@nestjs/swagger';

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
}

export class RouteCollection {
    @ApiProperty({ type: [RouteResource] })
    data: RouteResource[];
}
