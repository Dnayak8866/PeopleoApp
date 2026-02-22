import api from './apiService';

export const getSalaryCountdown = async (salaryDay: number = 1): Promise<{ daysRemaining: number; nextSalaryDate: string }> => {
    try {
        const response = await api.get('/salary-countdown', {
            params: { salaryDay }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch salary countdown:', error);
        throw error;
    }
};
