import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import PricePartForm from '@/components/form/PricePartForm.jsx';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import { formatDateTime } from '@/columns/cellStyle/AccountCell.jsx';


const PriceTabItems = ({ selectedPriceId, pricePartData, partDataLoading, partDataError, adjustHistoryData, adjustHistoryLoading, adjustHistoryError, historyData, historyLoading, historyError }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!selectedPriceId?.ppid) {
            console.error("PPID가 존재하지 않습니다.");
            return;
        }

        if (!adjustHistoryData || adjustHistoryData.length === 0) {
            // 🔹 조정 정보가 없으면 새로운 조정 추가 페이지로 이동
            console.log("Navigating to new PPID page");
            navigate(`/adjustment/new?adjustment_code=ppid&adjustment_code_value=${selectedPriceId.ppid}`);
        } else {
            // 🔹 조정 정보가 있으면 가장 최근 adjustment_index 가져와서 수정 페이지로 이동
            const latestAdjustment = adjustHistoryData[0]; // 최신 데이터 (정렬이 되어 있다고 가정)
            console.log("Navigating to edit adjustment page:", latestAdjustment.adjustment_index);
            navigate(`/adjustment/${latestAdjustment.adjustment_index}/adjustment_code=ppid&edit?adjustment_code_value=${selectedPriceId.ppid}`);
        }
    };

    return(
        [
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
                            <h1 className="font-bold my-2">단말기 조정 정보 이력</h1>
                            <Tooltip title="단말기 조정 정보 추가">
                                <button
                                    className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600"
                                    onClick={() => {
                                        console.log('Button Clicked!');
                                        handleClick();
                                    }}
                                >
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
    )
}
export default PriceTabItems;