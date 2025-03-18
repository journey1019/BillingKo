import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';

const AccountTransactionTab = ({ adjustHistoryLoading, adjustHistoryError, adjustHistoryData}) => {
    return(
        <div>
            {adjustHistoryLoading ? (
                <LoadingSpinner />
            ) : adjustHistoryError ? (
                <p className="text-red-500">{adjustHistoryError}</p>
            ) : adjustHistoryData ? (
                <ReusableTable
                    columns={AdjustmentHistoryTableColumns}
                    data={adjustHistoryData}
                    options={AdjustmentHistoryTableOptions}
                />
            ) : (
                <p>Select an account to view details</p>
            )}
        </div>
    )
}

export default AccountTransactionTab;