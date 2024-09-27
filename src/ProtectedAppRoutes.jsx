import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './pages/auth/AuthProvidor';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { userName } = useAuth();

    return userName ? <Component {...rest} /> : <Navigate to="/dreamstreamer/signin" />;
};

export default ProtectedRoute;
