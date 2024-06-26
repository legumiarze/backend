import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { nestConfig } from '@app/configs/nest.config';
import { neo4jConfig } from '@app/configs/neo4j.config';
import * as Joi from 'joi';

@Module({
    imports: [
        BaseConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [nestConfig, neo4jConfig],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production').default('production'),
                HOST: Joi.string().default('0.0.0.0'),
                PORT: Joi.number().default(3000),
                DATABASE_URL: Joi.string().required(),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
            }),
        }),
    ],
})
export class ConfigModule {}
