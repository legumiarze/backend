import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { RecordShape } from 'neo4j-driver-core/types/record';
import { Trip } from '@app/neo4j/nodes/trip.node';
import { Stop } from '@app/neo4j/nodes/stop.node';
import { Route } from '@app/neo4j/nodes/route.node';
import { StopTime } from '@app/neo4j/nodes/stop-time.node';

@Injectable()
export class PdfService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async generatePDF(
        tripId: string,
        startStopId: string,
        endStopId: string,
    ): Promise<{
        buffer: Buffer;
        filename: string;
    }> {
        const query = `
            MATCH (r:Route)<-[:USES]-(t:Trip {tripId: $tripId})
            MATCH (t)<-[:PART_OF_TRIP]-(st:Stoptime)-[:LOCATED_AT]->(s:Stop)
            WITH t, r, s, st
            ORDER BY st.stopSequence
            RETURN t, r, collect(s) AS s, collect(st) AS st
        `;
        const results = await this.neo4jService.run<
            RecordShape<'t' | 's' | 'r' | 'st', Trip | Route | Stop[] | StopTime[]>
        >(query, {
            tripId,
        });

        if (results.records.length === 0) {
            throw new NotFoundException();
        }

        const trip = results.records[0].get('t') as Trip;
        const route = results.records[0].get('r') as Route;
        const stops = results.records[0].get('s') as Stop[];
        const stoptimes = results.records[0].get('st') as StopTime[];

        const buffer: Buffer = await new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0,
            });

            doc.pipe(fs.createWriteStream('/tmp/schedule.pdf'));

            doc.rect(0, 0, doc.page.width, 70).fill('#F5C443').text('ROZKŁAD JAZDY', 0, 0);

            doc.fill('#000');
            doc.image(path.join(__dirname, 'assets', 'bus-icon.png'), 34, 18, { fit: [36, 34] });
            doc.image(path.join(__dirname, 'assets', 'voivodeship-logo.png'), 70, 514, { fit: [110, 57] });
            doc.image(path.join(__dirname, 'assets', 'company-logo.png'), 212, 537, { fit: [173, 22.235] });

            doc.font(path.join(__dirname, 'assets', 'Poppins-Bold.ttf'));
            doc.fontSize(16);
            doc.text(route.properties.routeShortName, 92, 23);
            doc.text(`przystanek: ${trip.properties.tripHeadsign}`, 101, 92);

            doc.font(path.join(__dirname, 'assets', 'Poppins-Regular.ttf'));
            doc.fontSize(16);
            doc.text(route.properties.routeLongName, 152, 23);
            doc.text(`kierunek: ${trip.properties.tripHeadsign}`, 101, 122);
            doc.text('Trasa', 662, 81);

            doc.fontSize(8);
            for (let i = 0; i <= 15; i++) {
                doc.circle(652, 120 + i * 18, 5).fill('#000');
                doc.circle(652, 120 + i * 18, 3).fill('#fff');
                doc.fill('#000');
                if (i !== 15) {
                    doc.moveTo(652, 120 + i * 18 + 5)
                        .lineTo(652, 120 + (i + 1) * 18 - 5)
                        .lineCap('round')
                        .addContent('[0 2] 0 d')
                        .stroke();
                }
                doc.text(stops[i].properties.stopName, 670, 115 + i * 18);
            }

            if (stops.length > 15) {
                doc.moveTo(652, 120 + 15 * 18 + 5)
                    .lineTo(652, 120 + 17 * 18 - 5)
                    .lineCap('round')
                    .addContent('[0 2] 0 d')
                    .stroke();

                doc.circle(652, 120 + 17 * 18, 5).fill('#000');
                doc.circle(652, 120 + 17 * 18, 3).fill('#fff');
                doc.fill('#000');
                doc.fontSize(6);
                doc.text(stops.length - 15 + ' przystanków', 670, 115 + 16 * 18 + 2);
                doc.fontSize(8);
                doc.text(stops[stops.length - 1].properties.stopName, 670, 115 + 17 * 18);
            }

            doc.fill('#000');
            doc.image(path.join(__dirname, 'assets', 'schedule.png'), 0, 0, {
                fit: [doc.page.width, doc.page.height],
                align: 'center',
                valign: 'center',
            });

            doc.end();

            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });
        });

        return { buffer, filename: 'Krakow MDA ul. Bosacka.pdf' };
    }
}
