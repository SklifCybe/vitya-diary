export type Event = {
    start: Date;
    end: Date;
    title: string;
};

export type EventFromServer = Event & {
    id: string;
}