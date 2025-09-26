import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

/**
 * A custom hook to fetch and cache the entire database structure.
 * This ensures data is fetched only once and stays in sync across the app.
 */
const useDatabase = () => {
    const [database, setDatabase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(db);
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                setDatabase(snapshot.val());
            } else {
                setDatabase({});
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Read Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { database, loading };
};

export default useDatabase;

