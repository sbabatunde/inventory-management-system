// src/modules/integration/services/crm.service.ts

import api from '../../../shared/services/api';

export const crmService = {
    // Job Orders
    async getJobOrder(id: number): Promise<any> {
        const response = await api.get(`/v1/integration/job-orders/${id}`);
        return response.data.data;
    },

    async getJobOrdersByClient(clientId: number): Promise<any[]> {
        const response = await api.get('/v1/integration/job-orders/by-client', {
            params: { client_id: clientId },
        });
        return response.data.data;
    },

    // Tickets
    async getTicket(id: number): Promise<any> {
        const response = await api.get(`/v1/integration/tickets/${id}`);
        return response.data.data;
    },

    async getTicketsByClient(clientId: number): Promise<any[]> {
        const response = await api.get('/v1/integration/tickets/by-client', {
            params: { client_id: clientId },
        });
        return response.data.data;
    },

    // CRM Users
    async getUsers(): Promise<Array<{ id: number; name: string; email: string; role: string }>> {
        const response = await api.get('/v1/integration/users');
        return response.data.data;
    },

    async getUser(id: number): Promise<any> {
        const response = await api.get(`/v1/integration/users/${id}`);
        return response.data.data;
    },

    async searchUsers(search: string): Promise<any[]> {
        const response = await api.get('/v1/integration/users/search', {
            params: { search },
        });
        return response.data.data;
    },
};