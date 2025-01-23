import useFetch from '@/hooks/useFetch.js';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns';
import ReusableTable from '@/components/table/ReusableTable';

const AccountPage = () => {
    const { data, loading, error } = useFetch("/data/device.json");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const DeviceTableOptions = {
        initialState: {
            sorting: [{ id: "activated", desc: false }], // 기본 정렬 설정
        },
        enableRowSelection: true, // 행 선택 활성화
        enablePagination: true, // 페이지네이션 활성화
    };

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
