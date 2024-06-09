import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import { SearchCollection } from '@app/search/search.types';

@Injectable()
export class SearchService {
    constructor(private readonly neo4jService: Neo4jService) {}

    /** Search for the shortest trips between two stops */
    async search(startStopId: string, finishStopId: string): Promise<SearchCollection> {
        const query = `
            MATCH (fromSt:Stoptime)-[:LOCATED_AT]->(from:Stop {stopId: $startStopId})
            RETURN from, fromSt
        `;

        // MATCH (st:Stoptime)-[:LOCATED_AT]->(s:Stop {stopId: "1014880"}) RETURN s, st LIMIT 25

        // match (from:Stop {code:'VBR'}),(to:Stop {code:'VIR'})
        // with from,to
        //     match p = allshortestpaths((from)-[*]->(to)) // here you needed you give the direction to make sure paths are from 'VBR' to 'VIR'
        // where NONE (x in relationships(p) where type(x)="OPERATES")
        // return p
        // limit 10;

        // stops: collect({
        //     stopId: stop.stopId,
        //     stopName: stop.stopName,
        //     arrivalTimeInt: stoptime.arrivalTimeInt,
        //     departureTimeInt: stoptime.departureTimeInt,
        //     tripId: trip.tripId
        // })

        const data = await this.neo4jService.run(query, { startStopId, finishStopId });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return { data: data.records.map((record) => record.toObject()) };
    }
}


// 1014880 Kraków Rondo Matecznego
// 1014874 Kraków Ludwinów
// 1014871 Kraków Rondo Grunwaldzkie
// 1355063 Kraków Konopnickiej
// 1015439 Kraków Jubilat

// "1014880",
// "1015439",
