import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

const useDatabase = () => {
    const [database, setDatabase] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        // Fetch public colleges
        const collegesRef = ref(db, "colleges");
        const unsubColleges = onValue(collegesRef, (snapshot) => {
            setDatabase((prev) => ({ ...prev, colleges: snapshot.val() || {} }));
        });

        // Fetch user-specific data
        let unsubUser = () => {};
        if (user) {
            const userRef = ref(db, `users/${user.uid}`);
            unsubUser = onValue(userRef, (snapshot) => {
                setDatabase((prev) => ({ ...prev, user: snapshot.val() || {} }));
            });
        }

        // Fetch admin data (only if admin)
        let unsubAdmin = () => {};
        if (user) {
            const adminRef = ref(db, `admins/${user.uid}`);
            unsubAdmin = onValue(adminRef, (snapshot) => {
                setDatabase((prev) => ({ ...prev, admin: snapshot.val() || null }));
            });
        }

        setLoading(false);

        return () => {
            unsubColleges();
            unsubUser();
            unsubAdmin();
        };
    }, [user]);

    return { database, loading };
};

export default useDatabase;
