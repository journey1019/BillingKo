import { getWithAuth, postWithAuth } from './api';

export const fetchKOMonthlyAccountIndexData = async (year_month) => {
    try {
        return await getWithAuth(`/monthly/account/${year_month}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


export const fetchKOMonthlyAccountSaveIndexData = async (year_month) => {
    try {
        return await getWithAuth(`/monthly/saveData/account/${year_month}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}

