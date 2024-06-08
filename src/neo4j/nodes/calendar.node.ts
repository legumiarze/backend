import { Integer, Node } from 'neo4j-driver';

export interface CalendarProperties {
    serviceId: string;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    startDate: string;
    endDate: string;
}

export type Calendar = Node<Integer, CalendarProperties>;
