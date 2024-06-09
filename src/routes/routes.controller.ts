import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoutesService } from '@app/routes/routes.service';
import { RouteCollection, RouteResource } from '@app/routes/routes.types';

@Controller('routes')
@ApiTags('Routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) {}

    @Get()
    @ApiQuery({ name: 'routeType', type: Number, required: false })
    @ApiResponse({ status: 200, description: 'Get all routes', type: RouteCollection })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRoutes(@Query('routeType') routeType?: number): Promise<RouteCollection> {
        return this.routesService.getRoutes(routeType);
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: Number, required: true })
    @ApiResponse({ status: 200, description: 'Get route by id', type: RouteResource })
    @ApiResponse({ status: 404, description: 'Route not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRouteById(@Param('id') id: string): Promise<RouteResource> {
        return this.routesService.getRouteById(id);
    }
}
