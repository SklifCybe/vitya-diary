import { useEffect, useState } from 'react';
import { Calendar as ReactCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import * as dateFns from 'date-fns';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { EventChangeModal } from '../event-change-modal';
import { getTasks } from '../../firebase';
import { EventFromServer } from '../../types/event';
import { convertTimestampsToDate } from '../../utils/convert-timestamps-to-date';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => dateFns.startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export const Calendar = ({ userId, isRefreshTasks }: { userId: string; isRefreshTasks: boolean }) => {
    const [events, setEvents] = useState<EventFromServer[]>([]);
    const [currentEvent, setCurrentEvent] = useState<EventFromServer>();
    const [openEventChangeModal, setOpenEventChangeModal] = useState(false);

    const handleGetTasks = async () => {
        const response = await getTasks(userId);
        response?.map(convertTimestampsToDate);
        setEvents(response ?? []);
    };

    useEffect(() => {
        handleGetTasks();
    }, [isRefreshTasks]);

    const onChangeStatusEventModal = (event: EventFromServer) => {
        setCurrentEvent(event);
        setOpenEventChangeModal(true);
    };
    return (
        <div>
            <ReactCalendar
                onSelectEvent={onChangeStatusEventModal}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
            <EventChangeModal
                currentEvent={currentEvent as EventFromServer}
                open={openEventChangeModal}
                onClose={() => setOpenEventChangeModal(false)}
                userId={userId}
                setEvents={setEvents}
            />
        </div>
    );
};
