import { Integer, Node } from 'neo4j-driver';

export interface TransferProperties {
    fromStopId: string;
    toStopId: string;
    transferType: number;
    minTransferTime: number;
}

export type Transfer = Node<Integer, TransferProperties>;
