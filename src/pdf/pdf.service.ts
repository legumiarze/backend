import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@app/neo4j/neo4j.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async generatePDF(): Promise<Buffer> {
        const pdfBuffer: Buffer = await new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0,
            });

            doc.pipe(fs.createWriteStream('/tmp/schedule.pdf'));

            doc.image(path.join(__dirname, 'templates', 'schedule.png'), {
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

        return pdfBuffer;
    }
}
