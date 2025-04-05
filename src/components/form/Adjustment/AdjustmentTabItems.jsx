import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import AdjustmentPartForm from '@/components/form/AdjustmentPartForm.jsx';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import { formatDateTime } from '../../../columns/cellStyle/AccountCell.jsx';

const AdjustmentTabItems = ({ selectedAdjustId, adjustmentDetailData, adjustmentDetailLoading, adjustmentDetailError, adjustmentDetailHistoryData, adjustmentDetailHistoryLoading, adjustmentDetailHistoryError }) => {


    return(
        [
            {
                id: 1,
                label: 'Overview',
                content:
                    <div>
                        {adjustmentDetailLoading ? (
                            <LoadingSpinner />
                        ) : adjustmentDetailError ? (
                            <p className="text-red-500">Error loading history: {adjustmentDetailError}</p>
                        ) : adjustmentDetailData ? (
                            <AdjustmentPartForm adjustPartData={adjustmentDetailData} />
                        ) : (
                            <p>Select an price to view details</p>
                        )}
                    </div>
            },
            {
                id: 2,
                label: 'History',
                content:
                    <div>
                        <div className="flex flex-row justify-between">
                            <h1 className="font-bold my-2">고객 조정 정보 이력</h1>
                            <Tooltip title="고객 조정 정보 추가">
                                <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600">
                                    <TiPlus />
                                </button>
                            </Tooltip>
                        </div>
                        {adjustmentDetailHistoryLoading ? (
                            <LoadingSpinner />
                        ) : adjustmentDetailHistoryError ? (
                            <p className="text-red-500">Error loading history: {adjustmentDetailHistoryError}</p>
                        ) : adjustmentDetailHistoryData ? (
                            <ReusableTable
                                data={adjustmentDetailHistoryData}
                                columns={AdjustmentHistoryTableColumns}
                                options={AdjustmentHistoryTableOptions}
                            />
                        ) : (
                            <p>Select an price to view details</p>
                        )}
                    </div>
            },
        ]
    )
}
export default AdjustmentTabItems;