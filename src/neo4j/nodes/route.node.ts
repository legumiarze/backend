import { Integer, Node } from 'neo4j-driver';

export interface RouteProperties {
    routeId: string;
    agencyId: string;
    routeShortName: string;
    routeLongName: string;
    routeDesc: string;
    routeType: number;
    routeUrl: string;
    routeColor: string;
    routeTextColor: string;
}

export type Route = Node<Integer, RouteProperties>;
