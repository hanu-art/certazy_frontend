import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isLoggedIn, user, isFirstLogin, isInitializing, loading } = useSelector((state) => state.auth);

    // Wait for auth verification / hydration to complete before redirecting
    if (isInitializing || (!isLoggedIn && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3282B8]" />
            </div>
        );
    }

    // Check if user is logged in
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
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
