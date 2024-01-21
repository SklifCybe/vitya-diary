// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Event, EventFromServer } from '../types/event';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBmO5LSQLHsXgt2-5EhS477zwYfoe8DNqU',
    authDomain: 'vitya-diary.firebaseapp.com',
    projectId: 'vitya-diary',
    storageBucket: 'vitya-diary.appspot.com',
    messagingSenderId: '11398104688',
    appId: '1:11398104688:web:c707cbaa88ded07218d6b5',
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: 'select_account ',
});
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(firebaseApp);



export const addTask = async (userId: string, task: Event) => {
    const tasksRef = collection(db, `users/${userId}/tasks`);

    try {
        const newTaskRef = await addDoc(tasksRef, task);
        return newTaskRef.id; // Возвращает ID новой задачи
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

export const getTasks = async (userId: string): Promise<EventFromServer[]> => {
    const tasksRef = collection(db, `users/${userId}/tasks`);

    try {
        const snapshot = await getDocs(tasksRef);
        if (!snapshot.empty) {
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as EventFromServer[];
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
};

export const updateTask = async (userId: string, taskId: string, updatedTask: Event) => {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);

    try {
        await updateDoc(taskRef, updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (userId: string, taskId: string) => {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);

    try {
        await deleteDoc(taskRef);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
