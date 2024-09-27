import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    const [userAttributes, setUserAttributes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await fetchUserAttributes();
                setUserName(user.name);    
                setUserAttributes(user);
            } catch (error) {
                setUserName(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ userName, setUserName, userAttributes, loading  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
