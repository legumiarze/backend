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

    async getStops(swLat?: number, swLon?: number, neLat?: number, neLon?: number): Promise<StopCollection> {
        // Returns all stops within the given bounding box
        const data = await this.neo4jService.run<RecordShape<'s', Stop>>(
            `
                WITH {swLat: $swLat, swLon: $swLon, neLat: $neLat, neLon: $neLon} AS box
                MATCH (s:Stop)
                WHERE s.stopLat <= box.neLat AND s.stopLat >= box.swLat
                AND s.stopLon <= box.neLon AND s.stopLon >= box.swLon
                RETURN s
                ORDER BY s.stopId 
            `,
            { swLat, swLon, neLat, neLon },
        );
        return { data: data.records.map((record) => record.get('s').properties) };
    }

    async getStopById(id: string): Promise<StopResource> {
        const result = await this.neo4jService.run<RecordShape<'s' | 't', Stop | { trip: Trip; stops: Stop[] }[]>>(
            `
                MATCH (s1:Stop {stopId: $stopId})
                OPTIONAL MATCH (s1)<-[:LOCATED_AT]-(st1:Stoptime)-[:PART_OF_TRIP]->(t1:Trip)-[:USES]->(r1:Route)
                WITH t1, s1, r1
                OPTIONAL MATCH (t1)<-[:PART_OF_TRIP]-(st2:Stoptime)-[:LOCATED_AT]->(s2:Stop)
                WITH t1, s1, r1, st2, s2
                ORDER BY t1.tripId, st2.stopSequence
                WITH t1, s1, r1, collect(s2) as stops
                RETURN s1 as s, collect({trip: t1, route: r1, stops: stops}) as t
            `,
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
