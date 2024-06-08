import { Integer, Node } from 'neo4j-driver';

export interface TripProperties {
    routeId: string;
    serviceId: string;
    tripId: string;
    tripHeadsign: string;
    tripShortName: string;
    directionId: number;
    blockId: number;
    shapeId: number;
    wheelchairAccessible: number;
}

export type Trip = Node<Integer, TripProperties>;
