import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StopCollection } from '@app/stops/stops.types';
import { RoutesService } from '@app/routes/routes.service';
import { RouteCollection, RouteResource } from '@app/routes/routes.types';

@Controller('routes')
@ApiTags('Routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) {}

    @Get('')
    @ApiResponse({ status: 200, description: 'Get all routes', type: RouteCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRoutes(): Promise<StopCollection> {
        return this.routesService.getRoutes();
    }

    @Get(':id')
    @ApiQuery({ name: 'id', type: Number, required: true })
    @ApiResponse({ status: 200, description: 'Get route by id', type: RouteResource })
    @ApiResponse({ status: 404, description: 'Route not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRouteById(@Query('id') id: number) {
        return this.routesService.getRouteById(id);
    }
}
