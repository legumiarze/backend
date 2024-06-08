import { Integer, Node } from 'neo4j-driver';

export interface StopProperties {
    stopId: string;
    stopCode: string;
    stopName: string;
    stopDesc: string;
    stopLat: number;
    stopLon: number;
    stopUrl: string;
    locationType: string;
    parentStation: string;
}

export type Stop = Node<Integer, StopProperties>;
