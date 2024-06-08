import { ConfigType, registerAs } from '@nestjs/config';

export const Neo4jConfigToken = 'NEO4J_CONFIG';

export const neo4jConfig = registerAs(Neo4jConfigToken, () => ({
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
}));

export const Neo4jConfigKey = neo4jConfig.KEY;
export type Neo4jConfig = ConfigType<typeof neo4jConfig>;
