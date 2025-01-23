import useFetch from '@/hooks/useFetch.js';
import ReusableTable from '@/components/table/ReusableTable';
import { PriceTableColumns } from '@/columns/PriceTableColumns';
import { PriceTableOptions } from '@/options/PriceTableOptions.jsx';

const PricePage = () => {
    const { data, loading, error } = useFetch('/data/price.json');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
