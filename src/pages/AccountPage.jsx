import useFetch from '@/hooks/useFetch.js';
import ReusableTable from '@/components/table/ReusableTable';
import { AccountTableColumns } from '@/columns/AccountTableColumns';

const AccountPage = () => {
    const { data, loading, error } = useFetch('/data/account.json');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const AccountTableOptions = {
        initialState: {
            sorting: [{ id: 'acct_num', desc: false }], // 기본 정렬 설정
        },
        enableRowSelection: true, // 행 선택 활성화
        enablePagination: true, // 페이지네이션 활성화
    };

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
