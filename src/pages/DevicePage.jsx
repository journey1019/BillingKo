import useFetch from '@/hooks/useFetch.js';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable';

const AccountPage = () => {
    const { data, loading, error } = useFetch("/data/device.json");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 className="pb-1 text-base font-bold">Device Data</h1>
            {/*<DeviceTable />*/}
            <div style={{ width: 'calc(100vw - 100px)' }}>
                <ReusableTable columns={DeviceTableColumns} data={data} options={DeviceTableOptions} />
            </div>
        </div>
    );
};

export default AccountPage;
