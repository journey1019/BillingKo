import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';

const AccountHistoryTab = ({ historyLoading, historyError, historyData, AccountTableColumns }) => {
    return (
        <div>
            {historyLoading ? (
                <LoadingSpinner />
            ) : historyError ? (
                <p>Error loading history: {historyError}</p>
            ) : (
                <div>
                    <ReusableTable
                        columns={AccountTableColumns}
                        data={historyData ? historyData : []}
                        options={{
                            initialState: { sorting: [{ id: 'acct_num', desc: true }] },
                            enablePagination: false,
                            enableSorting: false,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default AccountHistoryTab;