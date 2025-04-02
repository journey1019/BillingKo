import { useEffect, useState, useMemo } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import useAdjustmentStore from '@/stores/adjustmentStore';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx'

const EachTransactionHistoryTab = ({ selectedData }) => {
    const { fetchAdjustmentValueHistory, adjustmentDetailHistoryData, adjustmentDetailHistoryLoading, adjustmentDetailHistoryError } = useAdjustmentStore();

    // ✅ selectedData 안에서 어떤 key가 있는지에 따라 mainID 결정
    const mainID = useMemo(() => {
        if (!selectedData) return null;
        if ('serial_number' in selectedData) return 'serial_number';
        if ('acct_num' in selectedData) return 'acct_num';
        if ('ppid' in selectedData) return 'acct_num'; // ✅ ppid는 acct_num으로 조회
        return null;
    }, [selectedData]);

    useEffect(() => {
        if(selectedData && mainID) {
            fetchAdjustmentValueHistory(selectedData[mainID])
        }
    }, [selectedData, mainID]);
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

export default EachTransactionHistoryTab;