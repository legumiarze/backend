import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { StopCollection } from '@app/stops/stops.types';

@Injectable()
export class StopsService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async getStops(): Promise<StopCollection> {
        const data = await this.neo4jService.run('MATCH (s:Stop) RETURN s');
        return { data: data.records.map((record) => record.get('s').properties) };
    }
}
