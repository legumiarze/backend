import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PdfService } from '@app/pdf/pdf.service';

@Controller('pdf')
@ApiTags('Documents')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get()
    async getPdf(@Res() res: any) {
        const buffer = await this.pdfService.generatePDF();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=Krakow MDA ul. Bosacka.pdf',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
