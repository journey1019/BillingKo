import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import Buttons from '@/components/common/Buttons.jsx';
import { DeviceHistoryLogTableColumns } from '@/columns/DeviceHistoryLogTableColumns.jsx';

const DeviceHistoryTab = ({ selectedDeviceId, historyData, historyDataLoading, historyDataError, deviceHistoryLogData, deviceHistoryLogLoading, deviceHistoryLogError }) => {
    return (
        <>
            <div>
                <h1 className="font-bold mb-2">단말 정보 변경 이력</h1>
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
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold my-2">고객 매칭 정보 변경 이력</h1>
                    {/*<div>*/}
                    {/*    <Buttons*/}
                    {/*        entityType="devices/changed"*/}
                    {/*        id={selectedDeviceId.row_index}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <ReusableTable
                    columns={DeviceHistoryLogTableColumns}
                    data={deviceHistoryLogData ? deviceHistoryLogData : []}
                    options={{
                        initialState: {
                            sorting: [{ id: 'row_number', desc: true }],
                            // columnVisibility: { row_number: false, row_index: false },
                        },
                        enablePagination: true,
                        enableSorting: true,
                    }}
                    isLoading={deviceHistoryLogLoading}
                    error={deviceHistoryLogError}
                />
            </div>
        </>
    )
}


export default DeviceHistoryTab;