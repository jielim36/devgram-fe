import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { useGetMe } from "@/hooks";
import { useLocation } from "react-router-dom";

type AuthProviderProps = {
    children: React.ReactNode;
}

type AuthProviderState = {
    user: User | null;
    setUser: (user: User | null) => void;
}

const initialState: AuthProviderState = {
    user: null,
    setUser: () => null,
}

export const AuthContext = createContext<AuthProviderState>(initialState);

const noAuthPaths = ['/login', '/register', '/404'];


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthRequired, setIsAuthRequired] = useState<boolean>(false);
    const location = useLocation();
    const { data: userData, isError } = useGetMe({
        enabled: isAuthRequired,
    });

    useEffect(() => {

        setIsAuthRequired(!noAuthPaths.includes(location.pathname));
    }, [location])

    useEffect(() => {
        console.log(userData);

        if (userData) {
            setUser(userData.data);
        }
    }, [userData]);

    if ((isError || !userData?.data) && isAuthRequired) {
        // window.location.href = '/login';
        return "Redirecting to login..."
        // console.log("Redirecting to login...");

    }

    const value = {
        user,
        setUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}