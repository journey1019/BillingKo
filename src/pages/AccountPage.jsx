import useFetch from '@/hooks/useFetch.js';
import ReusableTable from '@/components/table/ReusableTable';
import { AccountTableColumns } from '@/columns/AccountTableColumns';
import { AccountTableOptions } from '@/options/AccountTableOptions.jsx';

const AccountPage = () => {
    const { data, loading, error } = useFetch('/data/account.json');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 className="py-1 text-base font-bold">Account Data</h1>
            <div style={{ width: 'calc(100vw - 100px)' }}>
                <ReusableTable columns={AccountTableColumns} data={data} options={AccountTableOptions}/>
            </div>
        </div>
    );
};

export default AccountPage;
