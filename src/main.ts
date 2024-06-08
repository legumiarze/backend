import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestConfig, NestConfigToken } from '@app/configs/nest.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    app.setGlobalPrefix('/api');
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            forbidUnknownValues: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Railway Microservice')
        .setDescription('The Railway Microservice API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document);

    const configService = app.get(ConfigService);
    const nestConfig = configService.getOrThrow<NestConfig>(NestConfigToken);

    await app.startAllMicroservices();

    await app.listen(nestConfig.port, nestConfig.host);
}

bootstrap();
