// src/modules/auth/routes.tsx

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('./components/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'));

export const authRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
];