// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const updateToken = (newToken) => {
        setToken(newToken);
    };

    return (
        <AuthContext.Provider value={{ token, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};