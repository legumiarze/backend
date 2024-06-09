import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { SearchCollection } from '@app/search/search.types';
import { Stop } from '@app/neo4j/nodes/stop.node';

@Injectable()
export class SearchService {
    constructor(private readonly neo4jService: Neo4jService) {}

    /** Search for the shortest trip between two stops */
    async search(startStopId: string, finishStopId: string): Promise<SearchCollection> {
        const query = `
            MATCH (fromSt:Stoptime)-[:LOCATED_AT]->(from:Stop {stopId: $startStopId})
            WITH from, fromSt
            MATCH (toSt:Stoptime)-[:LOCATED_AT]->(to:Stop {stopId: $finishStopId})
            MATCH p = allshortestpaths((fromSt)-[:PRECEDES*]-(toSt))
            WITH nodes(p) AS stoptimes
            LIMIT 1
            UNWIND stoptimes AS st
            MATCH (st)-[:LOCATED_AT]->(s:Stop)
            RETURN s
            ORDER BY st.stopSequence
        `;

        const data = await this.neo4jService.run<Record<'s', Stop>>(query, { startStopId, finishStopId });
        return { data: data.records.map((record) => record.get('s').properties) };
    }
}
