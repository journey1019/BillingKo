import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import Buttons from '@/components/common/Buttons.jsx';
import { DeviceHistoryLogTableColumns } from '@/columns/DeviceHistoryLogTableColumns.jsx';
import useDeviceStore from '@/stores/deviceStore.js';
import EachTransactionHistoryTab from '../Adjustment/EachTransactionHistoryTab.jsx';

const DeviceHistoryTab = ({ selectedDeviceId }) => {
    const {historyData, historyDataLoading, historyDataError, deviceHistoryLogData, deviceHistoryLogLoading, deviceHistoryLogError, fetchDeviceDetails } = useDeviceStore();

    // useEffect(() => {
    //     if(selectedDeviceId?.serial_number) {
    //         fetchDeviceDetails(selectedDeviceId?.serial_number)
    //     }
    // }, [selectedDeviceId]);

    return (
        <>
            <div>
                <h1 className="font-bold mb-2">단말 정보 변경 이력</h1>
                {deviceHistoryLogLoading ? (
                    <LoadingSpinner/>
                ) : deviceHistoryLogError ? (
                    <p>{`Error loading history: ${historyDataError}`}</p>
                ) : (
                    <ReusableTable
                        columns={DeviceTableColumns}
                        data={historyData ? historyData : []}
                        options={{
                            initialState: {
                                pagination: {
                                    pageSize: 5, pageIndex: 1
                                },
                                sorting: [
                                    { id: "update_date", desc: true },
                                    { id: "acct_num", desc: false }
                                ],
                                density: 'compact',
                                showColumnFilters: false
                            },
                            enablePagination: true,
                            enableSorting: true,
                        }}
                        isLoading={historyDataLoading}
                        error={historyDataError}
                    />
                )}
            </div>

            <div className="pt-4">
                <h1 className="font-bold mb-2">단말 조정 이력 정보</h1>
                <EachTransactionHistoryTab selectedData={selectedDeviceId} />
            </div>
        </>
    )
}


export default DeviceHistoryTab;