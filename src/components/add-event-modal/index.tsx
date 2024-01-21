import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ChangeEvent, useState } from 'react';

import { addTask } from '../../firebase';
import { User } from '../../types/user';

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
    user: User;
    open: boolean;
    onClose: () => void;
    seIsRefreshTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddEventModal: React.FC<Props> = ({ user, open, onClose, seIsRefreshTasks }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);

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

    const handleAdd = async () => {
        if (startDate && endDate) {
            await addTask(user?.uid, {
                title,
                start: startDate,
                end: endDate,
            });
            seIsRefreshTasks((prev) => !prev);
            setTitle('');
            setStartDate(new Date());
            setEndDate(null);
        }

        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setStartDate(new Date());
        setEndDate(null);
        onClose();
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                        <TextField label="Title" value={title} onChange={handleChangeTitle} />
                        <DateTimePicker label="Start" value={startDate} onChange={handleChangeDate('start')}  />
                        <DateTimePicker label="End" value={endDate} onChange={handleChangeDate('end')} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: '12px' }}>
                        <Button variant="contained" color="success" onClick={handleAdd}>
                            Add
                        </Button>
                        <Button variant="contained" color="error" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};
