import { Integer, Node } from 'neo4j-driver';

export interface StopTimeProperties {
    tripId: string;
    arrivalTime: string;
    departureTime: string;
    stopId: string;
    stopSequence: number;
    stopHeadsign: string;
    pickupType: string;
    dropOffType: string;
    shapeDistTraveled: number;
}

export type StopTime = Node<Integer, StopTimeProperties>;
