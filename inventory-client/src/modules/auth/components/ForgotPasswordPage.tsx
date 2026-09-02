// src/modules/auth/components/ForgotPasswordPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../../../shared/components/UI';
import { authService } from '../services/auth.service';
import { showSuccess, showError, showLoading, dismissToast } from '../../../shared/utils/toast';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = showLoading('Sending reset link...');

        try {
            await authService.forgotPassword(email);
            dismissToast(loadingToast);
            showSuccess('Password reset link sent to your email');
            setIsSent(true);
        } catch (error: any) {
            dismissToast(loadingToast);
            showError(error.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
            {/* Background Decorative Emerald Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-950/60 border border-slate-100 overflow-hidden">
                <div className="p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-key text-white text-xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-slate-500 mt-2">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {isSent ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-check text-emerald-600 text-2xl" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-sm text-slate-500 mb-6">
                                We've sent a password reset link to <span className="font-medium text-slate-700">{email}</span>
                            </p>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Email Address"
                                icon="fa-envelope"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                fullWidth
                                className="mt-6"
                            >
                                Send Reset Link
                            </Button>

                            <div className="text-center mt-6">
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
                                >
                                    <i className="fas fa-arrow-left text-xs mr-2" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;