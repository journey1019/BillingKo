import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';

const DeviceTransactionTab = ({ adjustHistoryData, adjustHistoryLoading, adjustHistoryError }) => {
    return(
        <div>
            {adjustHistoryLoading ? (
                <LoadingSpinner />
            ) : adjustHistoryError ? (
                <p className="text-red-500">Error loading history: {adjustHistoryError}</p>
            ) : adjustHistoryData ? (
                <ReusableTable
                    data={adjustHistoryData}
                    columns={AdjustmentHistoryTableColumns}
                    options={AdjustmentHistoryTableOptions}
                />
            ) : <p>Select an price to view details</p>}
        </div>
    )
}

export default DeviceTransactionTab;