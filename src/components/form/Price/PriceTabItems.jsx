import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import PricePartForm from '@/components/form/PricePartForm.jsx';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import { formatDateTime } from '../../../columns/cellStyle/AccountCell.jsx';

const PriceTabItems = ({ pricePartData, partDataLoading, partDataError, adjustHistoryData, adjustHistoryLoading, adjustHistoryError, historyData, historyLoading, historyError }) => [
    {
        id: 1,
        label: 'Overview',
        content:
            <>
                {partDataLoading ? (
                    <LoadingSpinner />
                ) : partDataError ? (
                    <p className="text-red-500">Error loading history: {historyError}</p>
                ) : pricePartData ? (
                    <PricePartForm pricePartData={pricePartData} />
                ) : (
                    <p>Select an price to view details</p>
                )}
            </>
    },
    {
        id: 2,
        label: 'Transaction',
        content:
            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold my-2">요금 정책 조정 정보 이력</h1>
                    <Tooltip message="가격 정책 조정 추가">
                        <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600">
                            <TiPlus />
                        </button>
                    </Tooltip>
                </div>
                {adjustHistoryLoading ? (
                    <LoadingSpinner />
                ) : adjustHistoryError ? (
                    <p className="text-red-500">{adjustHistoryError}</p>
                ) : (
                    <div>
                        <ReusableTable
                            columns={AdjustmentHistoryTableColumns}
                            data={adjustHistoryData}
                            options={AdjustmentHistoryTableOptions}
                        />
                    </div>
                )}
            </div>,
    },
    {
        id: 3,
        label: 'History',
        content:
            <>
                <div>
                    <h1 className="font-bold mb-2">요금 정책 변경 이력</h1>
                    {historyLoading ? (
                        <LoadingSpinner />
                    ) : historyError ? (
                        <p>Error loading particular: {historyError}</p>
                    ) : (
                        <div>
                            <ReusableTable
                                columns={[
                                    ...PriceTableColumns,
                                    { accessorKey: "update_date", header: "업데이트한 날짜", Cell: formatDateTime },
                                    { accessorKey: "user_id", header: "업데이트한 계정" }
                                ]}
                                data={historyData}
                                options={{
                                    initialState: {
                                        sorting: [{ id: 'update_date', desc: true }],
                                        showColumnFilters: true
                                    },
                                    enablePagination: true,
                                    enableSorting: true,
                                    enableFilters: true,
                                }}
                            />
                        </div>
                    )}
                </div>
            </>
    },
]
export default PriceTabItems;