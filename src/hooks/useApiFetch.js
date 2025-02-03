import { useState, useEffect } from "react";

/**
 * API 호출을 관리하는 커스텀 훅
 * @param {Function} apiFunction 호출할 API 함수
 * @param {any} params API 호출에 필요한 파라미터
 * @returns {Object} { data, loading, error, refetch }
 */
const useApiFetch = (apiFunction, params) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFunction(params);
            setData(response);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params]);

    return { data, loading, error, refetch: fetchData };
};

export default useApiFetch;
