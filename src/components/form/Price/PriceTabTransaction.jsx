import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import usePriceStore from '@/stores/priceStore.js';

const PriceTabTransaction = ({ selectedPriceId }) => {
    const { priceAdjustHistoryData, priceAdjustHistoryLoading, priceAdjustHistoryError } = usePriceStore();
    const navigate = useNavigate();

    const handleClick = () => {
        if (!selectedPriceId?.ppid) {
            console.error("PPID가 존재하지 않습니다.");
            return;
        }

        if (!priceAdjustHistoryData || priceAdjustHistoryData.length === 0) {
            // 🔹 조정 정보가 없으면 새로운 조정 추가 페이지로 이동
            console.log("Navigating to new PPID page");
            navigate(`/adjustment/new?adjustment_code=ppid&adjustment_code_value=${selectedPriceId.ppid}`);
        } else {
            // 🔹 조정 정보가 있으면 가장 최근 adjustment_index 가져와서 수정 페이지로 이동
            const latestAdjustment = priceAdjustHistoryData[0]; // 최신 데이터 (정렬이 되어 있다고 가정)
            console.log("Navigating to edit adjustment page:", latestAdjustment.adjustment_index);
            navigate(`/adjustment/${latestAdjustment.adjustment_index}/adjustment_code=ppid&edit?adjustment_code_value=${selectedPriceId.ppid}`);
        }
    };

    return(
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
            {priceAdjustHistoryLoading ? (
                <LoadingSpinner />
            ) : priceAdjustHistoryError ? (
                <p className="text-red-500">{priceAdjustHistoryError}</p>
            ) : (
                <div>
                    <ReusableTable
                        columns={AdjustmentHistoryTableColumns}
                        data={priceAdjustHistoryData}
                        options={AdjustmentHistoryTableOptions}
                    />
                </div>
            )}
        </div>
    )
}

export default PriceTabTransaction;