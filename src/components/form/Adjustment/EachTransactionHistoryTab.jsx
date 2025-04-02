import { useEffect, useState, useMemo } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import useAdjustmentStore from '@/stores/adjustmentStore';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx'

const EachTransactionHistory = ({ selectedData }) => {
    const { fetchAdjustmentValueHistory, adjustmentDetailHistoryData, adjustmentDetailHistoryLoading, adjustmentDetailHistoryError } = useAdjustmentStore();
console.log(adjustmentDetailHistoryData)
    // ✅ mainID를 조건에 따라 동적으로 결정
    const mainID =
        selectedData?.adjustment_code === 'account_num'
            ? 'acct_num'
            : selectedData?.adjustment_code === 'serial_number'
                ? selectedData.adjustment_code_value
                : selectedData?.adjustment_code === 'ppid'
                    ? selectedData.adjustment_code_value
                    : null;

    useEffect(() => {
        if(mainID) {
            fetchAdjustmentValueHistory(mainID)
        }
    }, [mainID]);
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

export default EachTransactionHistory;