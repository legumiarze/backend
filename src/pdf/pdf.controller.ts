import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PdfService } from '@app/pdf/pdf.service';

@Controller('pdf')
@ApiTags('Documents')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get()
    @ApiQuery({ name: 'tripId', type: String, required: true })
    @ApiQuery({ name: 'startStopId', type: String, required: true })
    @ApiQuery({ name: 'endStopId', type: String, required: true })
    @ApiResponse({ status: 200, description: 'Get PDF document', content: { 'application/pdf': {} } })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getPdf(
        @Res() res: any,
        @Query('tripId') tripId: string,
        @Query('startStopId') startStopId: string,
        @Query('endStopId') endStopId: string,
    ) {
        const { buffer, filename } = await this.pdfService.generatePDF(tripId, startStopId, endStopId);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + filename,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
