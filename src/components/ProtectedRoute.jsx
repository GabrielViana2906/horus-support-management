import { Navigate } from 'react-router';
import { getCurrentUser } from '../database/db';

function ProtectedRoute({ children }) {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== 'agent') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
