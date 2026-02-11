import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; 
import { base44 } from '@/services/api';

export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Extract page name from pathname (e.g., "/game" becomes "Game")
        const pathname = location.pathname;
        let pageName = pathname === '/' ? 'Home' : pathname.replace(/^\//, '');

        // Standardize the name (capitalize first letter)
        pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

        if (isAuthenticated && pageName) {
            // This still uses the base44 SDK for logging
            base44.appLogs.logUserInApp(pageName).catch(() => {
                // Silently fail - logging shouldn't break the app
            });
        }
    }, [location, isAuthenticated]);

    return null;
}