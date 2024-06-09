import { ApiProperty } from '@nestjs/swagger';
import { StopResource } from '@app/stops/stops.types';

export class SearchResource extends StopResource {}

export class SearchCollection {
    @ApiProperty({ type: [SearchResource] })
    data: SearchResource[];
}
