// src/shared/utils/toast.ts

import toast from 'react-hot-toast';

export const toastConfig = {
    position: 'top-right' as const,
    duration: 4000,
    style: {
        background: '#fff',
        color: '#1e293b',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export const showSuccess = (message: string) => {
    toast.success(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            borderLeft: '4px solid #4CAF50',
        },
    });
};

export const showError = (message: string) => {
    toast.error(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            borderLeft: '4px solid #ef4444',
        },
    });
};

export const showWarning = (message: string) => {
    toast(message, {
        ...toastConfig,
        icon: '⚠️',
        style: {
            ...toastConfig.style,
            borderLeft: '4px solid #f59e0b',
        },
    });
};

export const showInfo = (message: string) => {
    toast(message, {
        ...toastConfig,
        icon: 'ℹ️',
        style: {
            ...toastConfig.style,
            borderLeft: '4px solid #3b82f6',
        },
    });
};

export const showLoading = (message: string) => {
    return toast.loading(message, toastConfig);
};

export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};