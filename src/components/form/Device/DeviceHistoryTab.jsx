import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import Buttons from '@/components/common/Buttons.jsx';
import { DeviceHistoryLogTableColumns } from '@/columns/DeviceHistoryLogTableColumns.jsx';

const DeviceHistoryTab = ({ selectedDeviceId, historyData, historyDataLoading, historyDataError, deviceHistoryLogData, deviceHistoryLogLoading, deviceHistoryLogError }) => {
    return (
        <div>
            <h1 className="font-bold mb-2">기본 정보 변경 이력</h1>
            <ReusableTable
                columns={DeviceTableColumns}
                data={historyData ? historyData : []}
                //data={Array.isArray(historyData) ? historyData : [historyData].filter(Boolean)}  // 배열로 변환하여 전달
                options={{
                    initialState: { sorting: [{ id: 'serial_number', desc: true }] },
                    enablePagination: false,
                    enableSorting: false,
                }}
                isLoading={historyDataLoading}
                error={historyDataError}
            />
            <div className="flex flex-row justify-between">
                <h1 className="font-bold my-2">Account 정보 변경 이력</h1>
                <div>
                    <Buttons
                        entityType="devices/changed"
                        id={selectedDeviceId.row_index}
                    />
                </div>
            </div>
            <ReusableTable
                columns={DeviceHistoryLogTableColumns}
                data={deviceHistoryLogData ? deviceHistoryLogData : []}
                options={{
                    initialState: {
                        sorting: [{ id: 'row_number', desc: true }],
                        columnVisibility: { row_number: false, row_index: false },
                    },
                    enablePagination: false,
                    enableSorting: false,
                }}
                isLoading={deviceHistoryLogLoading}
                error={deviceHistoryLogError}
            />
        </div>
    )
}


export default DeviceHistoryTab;