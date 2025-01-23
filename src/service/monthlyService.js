import api from "./api";

export const fetchMonthlyData = async (yearMonth) => {
    try {
        const response = await api.get(`/monthly/${yearMonth}`); // 연월 기반 API 호출
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Failed to fetch monthly data");
    }
};
