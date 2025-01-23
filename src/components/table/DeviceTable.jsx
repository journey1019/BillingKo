import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useFetch from '@/hooks/useFetch';

const AccountTable = () => {
    const { data, loading, error } = useFetch('/data/device.json'); // JSON 데이터 경로

    // 테이블 컬럼 정의
    const columns = useMemo(
        () => [
            {
                accessorKey: 'serial_number',
                header: 'Serial Number',
            },
            {
                accessorKey: 'acct_num',
                header: 'Account Number',
            },
            {
                accessorKey: 'profile_id',
                header: 'Profile ID',
            },
            {
                accessorKey: 'activated',
                header: 'Activate',
                Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: 'deactivated',
                header: 'Deactivate',
                Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: 'ppid',
                header: 'PPID',
            },
            {
                accessorKey: 'model_name',
                header: 'Model Name',
            },
            {
                accessorKey: 'internet_mail_id',
                header: 'Mail',
            },
            {
                accessorKey: 'alias',
                header: 'Alias',
            },
            {
                accessorKey: 'remarks',
                header: 'Remarks',
            },
        ],
        [],
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto">
            <div style={{ width: 'calc(100vw - 100px)' }}>
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    initialState={{
                        density: 'compact',
                    }}
                    defaultColumn={{
                        size: 50,
                        minSize: 50,
                        maxSize: 200,
                    }}
                />
            </div>
        </div>
    );
};

export default AccountTable;
