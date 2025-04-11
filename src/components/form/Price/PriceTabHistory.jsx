import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { formatDateTime } from '@/columns/cellStyle/AccountCell.jsx';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import usePriceStore from '@/stores/priceStore.js';
import EachTransactionHistoryTab from '../Adjustment/EachTransactionHistoryTab.jsx';

const PriceTabHistory = ({ selectedPriceId }) => {
    const { priceHistoryData, priceHistoryLoading, priceHistoryError } = usePriceStore();

    return(
        <>
            <div>
                <h1 className="font-bold mb-2">요금 정책 변경 이력</h1>
                {priceHistoryLoading ? (
                    <LoadingSpinner />
                ) : priceHistoryError ? (
                    <p>Error loading particular: {priceHistoryError}</p>
                ) : (
                    <div>
                        <ReusableTable
                            columns={[
                                ...PriceTableColumns,
                                { accessorKey: "update_date", header: "업데이트한 날짜", Cell: formatDateTime },
                                { accessorKey: "user_id", header: "업데이트한 계정" }
                            ]}
                            data={priceHistoryData}
                            options={{
                                initialState: {
                                    sorting: [{ id: 'update_date', desc: true }],
                                    showColumnFilters: true,
                                    pagination: { pageIndex: 0, pageSize: 5 }
                                },
                                enablePagination: true,
                                enableSorting: true,
                                enableFilters: true,
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="pt-4">
                <h1 className="font-bold mb-2">요금 조정 이력 정보</h1>
                <EachTransactionHistoryTab selectedData={selectedPriceId} />
            </div>
        </>
    )
}

export default PriceTabHistory;