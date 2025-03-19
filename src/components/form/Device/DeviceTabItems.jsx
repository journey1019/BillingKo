import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import DevicePartForm from '@/components/form/DevicePartForm.jsx';
import { AdjustmentHistoryTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceHistoryLogTableColumns } from '@/columns/DeviceHistoryLogTableColumns.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';

const DeviceTabItems = ({ devicePartData, partDataLoading, partDataError, adjustHistoryData, adjustHistoryLoading, adjustHistoryError, selectedDeviceId, historyData, historyDataLoading, historyDataError, deviceHistoryLogData, deviceHistoryLogLoading, deviceHistoryLogError }) => [
    {
        id: 1,
        label: 'Overview',
        content:
            <>
                {partDataLoading ? (
                    <LoadingSpinner />
                ) : partDataError ? (
                    <p className="text-red-500">Error loading history: {partDataError}</p>
                ) : devicePartData ? (
                    <DevicePartForm devicePartData={devicePartData} />
                ) : (
                    <p>Select an device to view details</p>
                )}
            </>
    },
    {
        id: 2,
        label: 'Transaction',
        content:
            <>
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold my-2">단말기 조정 정보 이력</h1>
                    <Tooltip title="가격 정책 조정 추가">
                        <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600">
                            <TiPlus />
                        </button>
                    </Tooltip>
                </div>
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
            </>
    },
    {
        id: 3,
        label: 'History',
        content:
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
    },
]
export default DeviceTabItems;