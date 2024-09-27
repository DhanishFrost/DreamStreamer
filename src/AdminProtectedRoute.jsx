import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './pages/auth/AuthProvidor';

const AdminProtectedRoute = ({ element: Component, ...rest }) => {
    const { userName, userAttributes, loading } = useAuth();

    const isAdmin = userAttributes?.['custom:role'] === '1';

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userName || !isAdmin) {
        return <Navigate to="/dreamstreamer/signin" />;
    }

    // Render the protected component if authenticated and is admin
    return <Component {...rest} />;
};

export default AdminProtectedRoute;
