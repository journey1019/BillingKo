import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentReferencesTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import useAccountStore from '@/stores/accountStore';


const AccountTransactionTab = () => {
    const { adjustDetailData, adjustDetailLoading, adjustDetailError } = useAccountStore();
    console.log(adjustDetailData)

    return(
        <div>
            {adjustDetailLoading ? (
                <LoadingSpinner />
            ) : adjustDetailError ? (
                <p className="text-red-500">{adjustDetailError}</p>
            ) : adjustDetailData ? (
                <ReusableTable
                    columns={AdjustmentReferencesTableColumns}
                    data={adjustDetailData}
                    options={{
                        ...AdjustmentHistoryTableOptions,
                        mate: {
                            onRowSelect: (selectRow) => {
                                console.log(selectRow);
                            }
                        }
                    }}
                />
            ) : (
                <p>Select an account to view details</p>
            )}
        </div>
    )
}

export default AccountTransactionTab;