import { useEffect, useState } from 'react';
import { fetchAccounts } from '@/service/accountService';

const useAccounts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAccounts = async () => {
        setLoading(true);
        try {
            const res = await fetchAccounts();
            setData(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    return { data, loading, error, refetch: loadAccounts };
};

export default useAccounts;
