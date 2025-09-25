import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    getRedirectResult,
    signOut 
} from "firebase/auth";
import { auth } from '/src/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        getRedirectResult(auth).catch((error) => {
            console.error("Error processing redirect result:", error);
        });

        return () => unsubscribe();
    }, []);

    const value = { user, signInWithGoogle, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};