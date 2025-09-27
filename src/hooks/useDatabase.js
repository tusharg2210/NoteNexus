import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";

const useDatabase = () => {
  const [database, setDatabase] = useState({ colleges: {}, users: {} });
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
        setDatabase((prev) => ({
          ...prev,
          users: { ...prev.users, [user.uid]: snapshot.val() || {} }
        }));
      });
    }

    setLoading(false);

    return () => {
      unsubColleges();
      unsubUser();
    };
  }, [user]);

  return { database, loading };
};

export default useDatabase;
