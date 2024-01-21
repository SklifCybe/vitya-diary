import { ChangeEvent, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { EventFromServer } from '../../types/event';
import { deleteTask, updateTask } from '../../firebase';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type Props = {
    userId: string;
    currentEvent: EventFromServer;
    open: boolean;
    onClose: () => void;
    setEvents: React.Dispatch<React.SetStateAction<EventFromServer[]>>;
};

export const EventChangeModal: React.FC<Props> = ({ open, onClose, currentEvent, userId, setEvents }) => {
    const [isChange, setIsChange] = useState(false);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (open) {
            setTitle(currentEvent.title);
            setStartDate(currentEvent.start);
            setEndDate(currentEvent.end);
        }
    }, [open]);

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleChangeDate = (status: 'start' | 'end') => (date: Date | null) => {
        if (status === 'start' && date) {
            setStartDate(date);
        }
        if (status === 'end' && date) {
            setEndDate(date);
        }
    };

    const handleChangeEvent = () => {
        setIsChange(true);
    };

    const handleRemoveEvent = async () => {
        await deleteTask(userId, currentEvent.id);
        setEvents((prev) => prev.filter((i) => i.id !== currentEvent.id));
        onClose();
    };

    const handleClose = () => {
        setIsChange(false);
        onClose();
    };

    const handleSave = async () => {
        if (startDate && endDate) {
            await updateTask(userId, currentEvent.id, {
                title,
                start: startDate,
                end: endDate,
            });
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === currentEvent.id
                        ? {
                              ...event,
                              title,
                              start: startDate,
                              end: endDate,
                          }
                        : event,
                ),
            );
        }

        setIsChange(false);
        onClose();
    };

    const handleCancelChange = () => {
        setIsChange(false);
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    {isChange ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                                <TextField label="Title" value={title} onChange={handleChangeTitle} />
                                <DateTimePicker label="Start" value={startDate} onChange={handleChangeDate('start')} />
                                <DateTimePicker label="End" value={endDate} onChange={handleChangeDate('end')} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: '12px' }}>
                                <Button variant="contained" color="success" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCancelChange}>
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                What do you want to do?
                            </Typography>
                            <Box sx={{ display: 'flex', gap: '12px' }}>
                                <Button variant="contained" color="success" onClick={handleChangeEvent}>
                                    Change
                                </Button>
                                <Button variant="contained" color="error" onClick={handleRemoveEvent}>
                                    Remove
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};
