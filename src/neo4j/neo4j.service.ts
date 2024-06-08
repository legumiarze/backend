import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Neo4jConfig, Neo4jConfigKey } from '@app/configs/neo4j.config';
import { RecordShape } from 'neo4j-driver-core/types/record';
import { Query } from 'neo4j-driver-core/types/types';
import Result from 'neo4j-driver-core/types/result';
import { TransactionConfig } from 'neo4j-driver-core/types/session';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private driver: neo4j.Driver;

    constructor(
        @Inject(Neo4jConfigKey)
        private readonly neo4jConfig: Neo4jConfig,
    ) {}

    onModuleInit() {
        this.driver = neo4j.driver(
            this.neo4jConfig.url,
            neo4j.auth.basic(this.neo4jConfig.username, this.neo4jConfig.password),
            { disableLosslessIntegers: true },
        );
    }

    async onModuleDestroy() {
        this.driver && (await this.driver.close());
    }

    async run<R extends RecordShape = RecordShape>(
        query: Query,
        parameters?: any,
        transactionConfig?: TransactionConfig,
    ): Promise<Result<R>> {
        const session = this.driver.session();
        const results = await session.run(query, parameters, transactionConfig);
        await session.close();

        return results;
    }
}
