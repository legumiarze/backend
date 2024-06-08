import { ConfigType, registerAs } from '@nestjs/config';

export const Neo4jConfigToken = 'NEO4J_CONFIG';

export const neo4jConfig = registerAs(Neo4jConfigToken, () => ({
    url: process.env.DATABASE_URL,
}));

export const Neo4jConfigKey = neo4jConfig.KEY;
export type Neo4jConfig = ConfigType<typeof neo4jConfig>;
