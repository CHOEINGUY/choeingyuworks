import React, { useState, useEffect, ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { ALLOWED_ADMIN_EMAILS } from '../../data/adminConfig';
import AdminLoginForm from '../admin/common/AdminLoginForm';

interface AdminRouteProps {
    children: ReactNode;
}

/**
 * AdminRoute Component
 * Wraps protected admin routes.
 * 1. Checks if user is logged in.
 * 2. Checks if user is in the ALLOWED_ADMIN_EMAILS list OR in the 'admins' Firestore collection.
 * 3. Shows loading state while checking.
 * 4. Renders login form if not authenticated/authorized.
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user && user.email) {
                let isAllowed = ALLOWED_ADMIN_EMAILS.includes(user.email);

                // If not in static config, check dynamic Firestore whitelist
                if (!isAllowed) {
                    try {
                        const q = query(collection(db, 'admins'), where('email', '==', user.email));
                        const snapshot = await getDocs(q);
                        if (!snapshot.empty) {
                            isAllowed = true;
                        }
                    } catch (error) {
                        console.error("Whitelist check failed:", error);
                    }
                }

                if (isAllowed) {
                    setIsAuthenticated(true);
                    setAuthError('');
                } else {
                    setIsAuthenticated(false);
                    setAuthError('접근 권한이 없는 계정입니다.');
                }
            } else {
                setIsAuthenticated(false);
                setAuthError('');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Pass the error message to the login form if it was an unauthorized attempt
        return <AdminLoginForm externalError={authError} />;
    }

    return <>{children}</>;
};

export default AdminRoute;
