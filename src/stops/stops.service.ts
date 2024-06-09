import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { StopCollection, StopResource } from '@app/stops/stops.types';
import { RecordShape } from 'neo4j-driver-core/types/record';
import { Stop } from '@app/neo4j/nodes/stop.node';
import { Trip } from '@app/neo4j/nodes/trip.node';
import { Route } from '@app/neo4j/nodes/route.node';

@Injectable()
export class StopsService {
    constructor(private readonly neo4jService: Neo4jService) {}

    /** Returns all stops within the given bounding box or matching the search query */
    async getStops(
        stopName?: string,
        swLat?: number,
        swLon?: number,
        neLat?: number,
        neLon?: number,
    ): Promise<StopCollection> {
        let query = '';
        query += 'WITH {swLat: $swLat, swLon: $swLon, neLat: $neLat, neLon: $neLon} AS box ';
        query += 'MATCH (s:Stop)<-[:LOCATED_AT]-(:Stoptime)-[:PART_OF_TRIP]->(:Trip)-[:USES]->(r:Route) ';

        const criteria: string[] = [];

        if (stopName) {
            criteria.push('toLower(s.stopName) CONTAINS toLower($stopName) ');
        }

        if (swLat && swLon && neLat && neLon) {
            criteria.push(
                's.stopLat <= box.neLat AND s.stopLat >= box.swLat AND s.stopLon <= box.neLon AND s.stopLon >= box.swLon ',
            );
        }

        query += criteria.length > 0 ? `WHERE ${criteria.join(' OR ')}` : '';
        query += 'RETURN s, r ';
        query += 'ORDER BY s.stopId';

        const data = await this.neo4jService.run<RecordShape<'s' | 'r', Stop | Route>>(query, {
            swLat,
            swLon,
            neLat,
            neLon,
            stopName,
        });

        return {
            data: data.records.map((record) => {
                const stop = record.get('s') as Stop;
                const route = record.get('r') as Route;

                return {
                    ...stop.properties,
                    route: route.properties,
                };
            }),
        };
    }

    /** Returns a stop by its ID and all trips with their stops that go through the given stop */
    async getStopById(id: string): Promise<StopResource> {
        const query = `
            MATCH (s1:Stop {stopId: $stopId})
            OPTIONAL MATCH (s1)<-[:LOCATED_AT]-(st1:Stoptime)-[:PART_OF_TRIP]->(t1:Trip)-[:USES]->(r1:Route)
            WITH t1, s1, r1
            OPTIONAL MATCH (t1)<-[:PART_OF_TRIP]-(st2:Stoptime)-[:LOCATED_AT]->(s2:Stop)
            WITH t1, s1, r1, st2, s2
            ORDER BY t1.tripId, st2.stopSequence
            WITH t1, s1, r1, collect(s2) as stops
            RETURN s1 as s, collect({trip: t1, route: r1, stops: stops}) as t
        `;

        const result = await this.neo4jService.run<RecordShape<'s' | 't', Stop | { trip: Trip; stops: Stop[] }[]>>(
            query,
            { stopId: id },
        );

        if (result.records.length === 0) {
            throw new NotFoundException();
        }

        const stop = (result.records[0].get('s') as Stop).properties;
        const trips = (result.records[0].get('t') as { trip: Trip; route: Route; stops: Stop[] }[]).map((record) => ({
            ...record.trip?.properties,
            route: record.route?.properties,
            stops: record.stops.map((stop: any) => stop.properties),
        }));

        return { ...stop, trips };
    }
}
