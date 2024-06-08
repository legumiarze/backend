import { Integer, Node } from 'neo4j-driver';

export interface ShapeProperties {
    shapeId: string;
    shapePtLat: number;
    shapePtLon: number;
    shapePtSequence: number;
    shapeDistTraveled: number;
}

export type Shape = Node<Integer, ShapeProperties>;
