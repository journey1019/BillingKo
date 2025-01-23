import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useFetch from '@/hooks/useFetch';

const AccountTable = () => {
    const { data, loading, error } = useFetch('/data/account.json'); // JSON 데이터 경로

    // 테이블 컬럼 정의
    const columns = useMemo(
        () => [
            {
                accessorKey: 'acct_num',
                header: 'Account Num',
            },
            {
                accessorKey: 'acct_name',
                header: '사용자 명',
            },
            {
                accessorKey: 'acct_resident_num',
                header: '등록 번호',
            },
            {
                accessorKey: 'classification',
                header: 'Alias',
            },
            {
                accessorKey: 'invoice_address',
                header: '주소',
            },
            {
                accessorKey: 'invoice_address2',
                header: '주소2',
            },
            {
                accessorKey: 'invoice_postcode',
                header: 'Post Code',
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
