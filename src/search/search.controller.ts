import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from '@app/search/search.service';
import { SearchCollection } from '@app/search/search.types';

@Controller('search')
@ApiTags('Search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiQuery({ name: 'startStopId', required: true, type: String })
    @ApiQuery({ name: 'finishStopId', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Search results', type: SearchCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async search(
        @Query('startStopId') startStopId: string,
        @Query('finishStopId') finishStopId: string,
    ): Promise<SearchCollection> {
        return await this.searchService.search(startStopId, finishStopId);
    }
}
