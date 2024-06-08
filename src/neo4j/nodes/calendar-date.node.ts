import { Integer, Node } from 'neo4j-driver';

export interface CalendarDateProperties {
    serviceId: string;
    date: string;
    exceptionType: number;
}

export type CalendarDate = Node<Integer, CalendarDateProperties>;
