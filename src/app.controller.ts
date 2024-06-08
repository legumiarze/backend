import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('up')
    async up() {
        return 'Hello World!';
    }
}
