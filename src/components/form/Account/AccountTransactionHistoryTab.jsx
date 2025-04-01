import { useEffect, useState, useMemo } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import useAdjustmentStore from '@/stores/adjustmentStore';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx'

const AccountTransactionHistoryTab = ({ selectedAccountId }) => {
    const { fetchAdjustmentValueHistory, adjustmentDetailHistoryData, adjustmentDetailHistoryLoading, adjustmentDetailHistoryError } = useAdjustmentStore();
    useEffect(() => {
        if(selectedAccountId) {
            fetchAdjustmentValueHistory(selectedAccountId.acct_num)
        }
    }, [selectedAccountId]);
    console.log('adjustmentDetailHistoryData: ', adjustmentDetailHistoryData)

    return (
        <div>
            {adjustmentDetailHistoryLoading ? (
                <LoadingSpinner />
            ) : adjustmentDetailHistoryError ? (
                <p>Error loading history: {adjustmentDetailHistoryError}</p>
            ) : (
                <div>
                    <ReusableTable
                        columns={AdjustmentHistoryTableColumns}
                        data={adjustmentDetailHistoryData ? adjustmentDetailHistoryData : []}
                        options={{
                            initialState: {
                                sorting: [{ id: 'update_date', desc: true }],
                                showColumnFilters: true,
                            },
                            enableMultiRowSelection: false,
                            enablePagination: true,
                            enableFilters: true,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default AccountTransactionHistoryTab;