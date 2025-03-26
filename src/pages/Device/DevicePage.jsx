import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import {
    fetchDevices,
    deleteDevice,
    fetchDeviceHistory,
    fetchDevicePart,
    fetchDeviceHistoryLog, deleteDeviceHistoryLog,
} from '@/service/deviceService.js';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import DevicePartForm from '@/components/form/DevicePartForm.jsx';

import { useNavigate } from "react-router-dom";

import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';
import TabComponent from '@/components/layout/TabComponent.jsx';
import { fetchAdjustmentPart, fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { DeviceHistoryLogTableColumns } from '@/columns/DeviceHistoryLogTableColumns.jsx';
import Buttons from '@/components/common/Buttons.jsx';
import DeviceOverviewTab from '@/components/form/Device/DeviceOverViewTab.jsx';
import DeviceTransactionTab from '@/components/form/Device/DeviceTransactionTab.jsx';
import DeviceHistoryTab from '@/components/form/Device/DeviceHistoryTab.jsx';
import DeviceTabItems from '@/components/form/Device/DeviceTabItems.jsx';
import DeviceOverViewTab from '../../components/form/Device/DeviceOverViewTab.jsx';
import useDeviceStore from '@/stores/deviceStore.js';

const DevicePage = () => {
    const {
        deviceData,
        deviceLoading,
        deviceError,
        fetchDeviceData,
        fetchDeviceDetails,
        deleteDeviceData,
        devicePartData,
        devicePartLoading,
        historyData,
        adjustHistoryData,
        deviceHistoryLogData
    } = useDeviceStore();

    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    useEffect(() => {
        fetchDeviceData();
    }, []);

    useEffect(() => {
        if (selectedDeviceId?.serial_number) {
            fetchDeviceDetails(selectedDeviceId.serial_number);
        }
    }, [selectedDeviceId]);

    const handleDeleteSuccess = async (serial_number) => {
        try {
            await deleteDeviceData(serial_number);
            fetchDeviceData(); // 삭제 후 새로고침
            setSelectedDeviceId(null);
            setIsExpanded(false);
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const latestDeviceLog = deviceHistoryLogData?.sort((a, b) => b.row_number - a.row_number)?.[0];
    const highestRowData = deviceHistoryLogData?.length
        ? deviceHistoryLogData.sort((a, b) => b.row_number - a.row_number)[0]
        : null;
    console.log('deviceData :', deviceData)
    console.log(highestRowData);
    console.log(latestDeviceLog);

    console.log('historyData', historyData)
    console.log('deviceHistoryLogData', deviceHistoryLogData)

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
                        <button onClick={() => navigate('/devices/new')}
                                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                            <FiPlus />
                            <span>New</span>
                        </button>
                        {/*<button onClick={toggleDropdown}*/}
                        {/*        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">*/}
                        {/*    <BsThreeDotsVertical />*/}
                        {/*</button>*/}
                        {/*{isOpenDropdown && (*/}
                        {/*    <div*/}
                        {/*        className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"*/}
                        {/*        onMouseLeave={closeDropdown}>*/}
                        {/*        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">*/}
                        {/*            <li>*/}
                        {/*                <a href="#"*/}
                        {/*                   className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modify</a>*/}
                        {/*            </li>*/}
                        {/*            <li>*/}
                        {/*                <a href="#"*/}
                        {/*                   className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>*/}
                        {/*            </li>*/}
                        {/*        </ul>*/}
                        {/*    </div>*/}
                        {/*)}*/}
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
                        ...DeviceTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id:', selectedRow);
                                // setSelectedDeviceId(selectedRow);
                                // setIsExpanded(true);

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
                                deleteFunction={deleteDevice}
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