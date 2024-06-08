import { ApiProperty } from '@nestjs/swagger';

export class StopResource {
    @ApiProperty({ example: 2388 })
    stopId: number;

    @ApiProperty({ example: 3010 })
    stopCode: number;

    @ApiProperty({ example: 'Zaczarnie - Pętla' })
    stopName: string;

    @ApiProperty({ example: 'Zaczarnie - Pętla', required: false })
    stopDesc?: string;

    @ApiProperty({ example: 50.0728688241737 })
    stopLat: number;

    @ApiProperty({ example: 21.0936707625592 })
    stopLon: number;
}

export class StopCollection {
    @ApiProperty({ type: [StopResource] })
    data: StopResource[];
}
