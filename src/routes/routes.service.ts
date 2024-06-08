import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { StopCollection } from '@app/stops/stops.types';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RoutesService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async getRoutes(): Promise<StopCollection> {
        const data = await this.neo4jService.run('MATCH (r:Route) RETURN r');
        return { data: data.records.map((record) => record.get('r').properties) };
    }

    async getRouteById(id: number) {
        const data = await this.neo4jService.run('MATCH (r:Route {id: $id}) RETURN r', { id });

        if (data.records.length === 0) {
            throw new NotFoundException();
        }

        return data.records[0].get('r').properties;
    }
}
