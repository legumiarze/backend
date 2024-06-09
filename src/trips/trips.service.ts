import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { TripCollection } from '@app/trips/trips.types';
import { RecordShape } from 'neo4j-driver-core/types/record';
import { Trip } from '@app/neo4j/nodes/trip.node';
import { Route } from '@app/neo4j/nodes/route.node';

@Injectable()
export class TripsService {
    constructor(private readonly neo4jService: Neo4jService) {}

    /** Returns all trips with their route ordered by trip ID */
    async getTrips(): Promise<TripCollection> {
        const query = `
            MATCH (t:Trip)-[:USES]->(r:Route)
            RETURN t, r
            ORDER BY t.tripId
        `;
        const data = await this.neo4jService.run<RecordShape<'t' | 'r', Trip | Route>>(query);
        return {
            data: data.records.map((record) => {
                const trip = record.get('t') as Trip;
                const route = record.get('r') as Route;
                return { ...trip.properties, route: route.properties };
            }),
        };
    }
}
