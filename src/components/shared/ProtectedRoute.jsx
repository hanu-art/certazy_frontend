import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isLoggedIn, user, isFirstLogin } = useSelector((state) => state.auth);

    // Check if user is logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Check if sub-admin needs to change password
    if (isFirstLogin && user?.role === 'sub_admin') {
        return <Navigate to="/change-password" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
