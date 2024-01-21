import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import { Calendar } from './components/calendar';
import { signInWithGooglePopup } from './firebase';
import { AddEventModal } from './components/add-event-modal';
import { User } from './types/user';

export const App = () => {
    const getUser = localStorage.getItem('USER') as string;
    const [user, setUser] = useState<User | null>(JSON.parse(getUser));
    const [openAddModal, setOpenAddModal] = useState(false);
    const [isRefreshTasks, seIsRefreshTasks] = useState(false);
    const signIn = async () => {
        try {
            const response = await signInWithGooglePopup();
            setUser(response.user as User);
            localStorage.setItem('USER', JSON.stringify(response?.user));
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            localStorage.removeItem('USER');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {user ? (
                <Box>
                    <Calendar userId={user?.uid ?? ''} isRefreshTasks={isRefreshTasks} />
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                        <Button variant="contained" color="success" onClick={() => setOpenAddModal(true)}>
                            Add new event
                        </Button>
                        <Button variant="contained" color="error" onClick={signOut}>
                            Sign Out
                        </Button>
                    </Box>
                    <AddEventModal user={user} open={openAddModal} onClose={() => setOpenAddModal(false)} seIsRefreshTasks={seIsRefreshTasks} />
                </Box>
            ) : (
                <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Typography variant="h2">Welcome to Diary</Typography>
                    <Button variant="contained" color="success" onClick={signIn}>
                        Sign In with Google
                    </Button>
                </Box>
            )}
        </>
    );
};
