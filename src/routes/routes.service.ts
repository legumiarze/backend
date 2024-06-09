import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { RouteCollection, RouteResource } from '@app/routes/routes.types';
import { RecordShape } from 'neo4j-driver-core/types/record';
import { Route } from '@app/neo4j/nodes/route.node';
import { Stop } from '@app/neo4j/nodes/stop.node';
import { Trip } from '@app/neo4j/nodes/trip.node';

@Injectable()
export class RoutesService {
    constructor(private readonly neo4jService: Neo4jService) {}

    /** Returns all routes ordered by route long name */
    async getRoutes(routeType: number): Promise<RouteCollection> {
        const query = `MATCH (r:Route ${routeType ? `{routeType: $routeType}` : ''}) RETURN r ORDER BY r.routeLongName`;
        const data = await this.neo4jService.run<RecordShape<'r', Route>>(query, { routeType });
        return { data: data.records.map((record) => record.get('r').properties) };
    }

    /** Returns a route with its stops by its ID */
    async getRouteById(id: string): Promise<RouteResource> {
        const query = `
            MATCH (r:Route {routeId: $id})
            OPTIONAL MATCH (r)<-[:USES]-(t:Trip)<-[:PART_OF_TRIP]-(st:Stoptime)-[:LOCATED_AT]->(s:Stop)
            WITH r, t, s
            ORDER BY t.tripId, st.stopSequence
            WITH r, t, collect(s) as s
            RETURN r, t, s
        `;
        const data = await this.neo4jService.run<RecordShape<'r' | 's' | 't', Route | Trip | Stop[]>>(query, { id });

        if (data.records.length === 0) {
            throw new NotFoundException();
        }

        const route = data.records[0].get('r') as Route;
        const trip = data.records[0].get('t') as Trip;
        const stops = data.records[0].get('s') as Stop[];

        return {
            ...route.properties,
            trip: trip.properties,
            stops: stops.map((stop) => stop.properties),
        };
    }
}
