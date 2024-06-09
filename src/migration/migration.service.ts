import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';

@Injectable()
export class MigrationService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async truncate() {
        await this.neo4jService.run(`MATCH (n) DETACH DELETE n`);
    }

    async schema() {
        await this.neo4jService.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (r:Route) REQUIRE r.routeId IS UNIQUE`);
        await this.neo4jService.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (t:Trip) REQUIRE t.tripId IS UNIQUE`);
        await this.neo4jService.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (s:Stop) REQUIRE s.stopId IS UNIQUE`);

        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (r:Route) ON (r.routeId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (t:Trip) ON (t.tripId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (t:Trip) ON (t.serviceId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (cd:CalendarDate) ON (cd.serviceId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (cd:CalendarDate) ON (cd.date)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (st:Stoptime) ON (st.stopId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (st:Stoptime) ON (st.stopSequence)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (s:Stop) ON (s.stopId)`);
        await this.neo4jService.run(`CREATE INDEX IF NOT EXISTS FOR (s:Stop) ON (s.name)`);
    }

    async load(path: string) {
        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/routes.txt' AS csv
            CREATE (r:Route {routeId: csv.route_id, routeShortName: csv.route_short_name, routeLongName: csv.route_long_name, routeDesc: csv.route_desc, routeType: toInteger(csv.route_type), routeColor: csv.route_color, routeTextColor: csv.route_text_color});
        `);

        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/calendar_dates.txt' AS csv
            MATCH (t:Trip {serviceId: csv.service_id})
            CREATE (t)-[:RUNS_DURING]->(cd:CalendarDate{serviceId: csv.service_id, date: csv.date, exceptionType: csv.exception_type });
        `);

        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/trips.txt' AS csv
            MATCH (r:Route {routeId: csv.route_id})
            MERGE (r)<-[:USES]-(t:Trip {tripId: csv.trip_id, serviceId: csv.service_id});
        `);

        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/stops.txt' AS csv
            CREATE (s:Stop {stopId: csv.stop_id, stopCode: csv.stop_code, stopName: csv.stop_name, stopDesc: csv.stop_desc, stopLat: toFloat(csv.stop_lat), stopLon: toFloat(csv.stop_lon), parentStation: csv.parent_station, locationType: csv.location_type});
        `);

        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/stops.txt' AS csv
            WITH csv WHERE NOT (csv.parent_station IS NULL)
            MATCH (ps:Stop {stopId: csv.parent_station}), (s:Stop {stopId: csv.stop_id})
            CREATE (ps)<-[:PART_OF]-(s);
        `);

        await this.neo4jService.run(`
            LOAD CSV WITH HEADERS FROM '${path}/stop_times.txt' AS csv
            MATCH (t:Trip {tripId: csv.trip_id}), (s:Stop {stopId: csv.stop_id})
            CREATE (t)<-[:PART_OF_TRIP]-(st:Stoptime {arrivalTime: csv.arrival_time, departureTime: csv.departure_time, stopSequence: toInteger(csv.stop_sequence)})-[:LOCATED_AT]->(s);
        `);

        await this.neo4jService.run(`
            MATCH (s:Stoptime)
            SET s.arrivalTimeInt = toInteger(replace(s.arrivalTime, ":", "")) / 100
            SET s.departureTimeInt = toInteger(replace(s.departureTime, ":", "")) / 100;
        `);

        await this.neo4jService.run(`
            MATCH (s1:Stoptime)-[:PART_OF_TRIP]->(t:Trip), (s2:Stoptime)-[:PART_OF_TRIP]->(t)
            WHERE s2.stopSequence = s1.stopSequence - 1
            CREATE (s1)<-[:PRECEDES]-(s2);
        `);
    }
}
