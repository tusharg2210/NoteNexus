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
    const [loading, setLoading] = useState(true); // This is important

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Set loading to false once check is complete
        });

        // This is good for handling sign-in redirects
        getRedirectResult(auth).catch((error) => {
            console.error("Error processing redirect result:", error);
        });

        return () => unsubscribe();
    }, []);

    // THE FIX IS HERE: We must include 'loading' in the value
    const value = { user, loading, signInWithGoogle, logout };

    return (
        <AuthContext.Provider value={value}>
            {/* We can remove !loading from here to let children handle their own loading state */}
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};