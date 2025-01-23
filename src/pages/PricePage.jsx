import useFetch from '@/hooks/useFetch.js';
import ReusableTable from '@/components/table/ReusableTable';
import { PriceTableColumns } from '@/columns/PriceTableColumns';

const PricePage = () => {
    const { data, loading, error } = useFetch('/data/price.json');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const PriceTableOptions = {
        initialState: {
            sorting: [{ id: 'ppid', desc: false }], // 기본 정렬 설정
        },
        enableRowSelection: true, // 행 선택 활성화
        enablePagination: true, // 페이지네이션 활성화
    };

    return (
        <div>
            <h1 className="py-1 text-base font-bold">Price Data</h1>
            <div style={{ width: 'calc(100vw - 100px)' }}>
                <ReusableTable columns={PriceTableColumns} data={data} options={PriceTableOptions}/>
            </div>
        </div>
    );
};

export default PricePage;
