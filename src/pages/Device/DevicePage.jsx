import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import ReusableTable from '@/components/table/ReusableTable.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

import TabComponent from '@/components/layout/TabComponent.jsx';
import DeviceTransactionTab from '@/components/form/Device/DeviceTransactionTab.jsx';
import DeviceHistoryTab from '@/components/form/Device/DeviceHistoryTab.jsx';
import DeviceOverViewTab from '@/components/form/Device/DeviceOverViewTab.jsx';
import useDeviceStore from '@/stores/deviceStore.js';

const DevicePage = () => {
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.get("value");

    const {
        deviceData,
        deviceLoading,
        deviceError,
        fetchDeviceData,
        fetchDeviceDetails,
        deleteDeviceData,
        historyData,
        deviceHistoryLogData
    } = useDeviceStore();

    const [selectedDeviceId, setSelectedDeviceId] = useState(urlValue || null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon

    useEffect(() => {
        fetchDeviceData();
    }, []);

    useEffect(() => {
        if (selectedDeviceId?.serial_number) {
            fetchDeviceDetails(selectedDeviceId.serial_number);
        }
    }, [selectedDeviceId]);

    // ✅ urlValue로 선택할 계정 자동 설정
    useEffect(() => {
        if (urlValue && deviceData.length > 0) {
            const matchedDevice = deviceData.find(device => device.serial_number === urlValue);
            if (matchedDevice) {
                setSelectedDeviceId(matchedDevice);
                setIsExpanded(true);
            }
        }
    }, [urlValue, deviceData]);

    const handleDeleteSuccess = async (serial_number) => {
        try {
            await fetchDeviceData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedDeviceId(null);
            setIsExpanded(false);
            // console.log(`✅ 삭제 후 새로고침 완료 (ppid: ${serial_number})`);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };

    const latestDeviceLog = deviceHistoryLogData?.sort((a, b) => b.row_number - a.row_number)?.[0];
    const highestRowData = deviceHistoryLogData?.length
        ? deviceHistoryLogData.sort((a, b) => b.row_number - a.row_number)[0]
        : null;
    // console.log('deviceData :', deviceData)
    // console.log(highestRowData);
    // console.log(latestDeviceLog);

    // console.log('historyData', historyData)
    // console.log('deviceHistoryLogData', deviceHistoryLogData)

    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">단말기 데이터 검토</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">단말기 기본 정보 및 매핑 수정</h1>
                    <div className="flex space-x-2 items-center">
                        <NewButton to="/devices/new"/>

                        <DataActionDropdown
                            onExportCSV={() => exportToCSV(deviceData, 'Devices.csv')}
                            onExportExcel={() => exportToExcel(deviceData, 'Devices.xlsx')}
                            onRefresh={fetchDeviceData}
                        />
                        {/*<button onClick={() => console.log('device_setting')}*/}
                        {/*        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">*/}
                        {/*    <RiSettings3Fill />*/}
                        {/*</button>*/}
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={DeviceTableColumns}
                    data={deviceData || []}
                    options={{
                        ...DeviceTableOptions(selectedDeviceId),
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id:', selectedRow);

                                // 같은 Row 선택
                                if (selectedDeviceId && selectedDeviceId.serial_number === selectedRow.serial_number) {
                                    setSelectedDeviceId(null);
                                    setIsExpanded(false); // 동일 row 선택 시 닫기
                                } else { // 다른 Row 선택시
                                    setSelectedDeviceId(selectedRow);
                                    setIsExpanded(true); // 새로운 row 선택 시 열기
                                }
                            },
                        },
                    }}
                    isLoading={deviceLoading}
                    error={deviceError}
                />
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && selectedDeviceId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        {/* Top */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Serial_Number */}
                            <h2 className="py-1 text-lg font-bold">{selectedDeviceId.serial_number} _ {selectedDeviceId.alias}</h2>

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="devices"
                                id={selectedDeviceId.serial_number}
                                deleteFunction={deleteDeviceData}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/* Tab */}
                        <TabComponent tabs={[
                            { id: 1, label: 'Overview', content: <DeviceOverViewTab /> },
                            { id: 2, label: 'Transaction', content: <DeviceTransactionTab selectedDeviceId={selectedDeviceId} /> },
                            { id: 3, label: 'History', content: <DeviceHistoryTab selectedDeviceId={selectedDeviceId} /> },
                        ]} />
                        {/*<TabComponent tabs={DeviceTabItems({*/}
                        {/*    devicePartData,*/}
                        {/*    partDataLoading,*/}
                        {/*    partDataError,*/}
                        {/*    adjustHistoryData,*/}
                        {/*    adjustHistoryLoading,*/}
                        {/*    adjustHistoryError,*/}
                        {/*    selectedDeviceId,*/}
                        {/*    historyData,*/}
                        {/*    historyDataLoading,*/}
                        {/*    historyDataError,*/}
                        {/*    deviceHistoryLogData,*/}
                        {/*    deviceHistoryLogLoading,*/}
                        {/*    deviceHistoryLogError*/}
                        {/*})} />*/}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicePage;