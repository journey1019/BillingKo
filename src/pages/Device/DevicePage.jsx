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

const DevicePage = () => {
    const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useApiFetch(fetchDevices);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    // 이력 데이터 상태
    const [historyData, setHistoryData] = useState(null);
    const [historyDataLoading, setHistoryDataLoading] = useState(false);
    const [historyDataError, setHistoryDataError] = useState(null);

    // 부분 단말 데이터 상태
    const [devicePartData, setDevicePartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // 조정 데이터 상태
    const [adjustHistoryData, setAdjustHistoryData] = useState(null);
    const [adjustHistoryLoading, setAdjustHistoryLoading] = useState(false);
    const [adjustHistoryError, setAdjustHistoryError] = useState(null);

    // Account 변경 이력 데이터 상태
    const [deviceHistoryLogData, setDeviceHistoryLogData] = useState(null);
    const [deviceHistoryLogLoading, setDeviceHistoryLogLoading] = useState(false);
    const [deviceHistoryLogError, setDeviceHistoryLogError] = useState(null);


    // 선택된 serial_number 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedDeviceId) return;  // 선택된 값이 없으면 호출하지 않음

            // 부분 계정 데이터 가져오기
            setHistoryDataLoading(true);
            setHistoryDataError(null);
            try {
                const partResponse = await fetchDeviceHistory(selectedDeviceId.serial_number);
                setHistoryData(partResponse);
            } catch (error) {
                setHistoryDataError(error.message || 'Failed to fetch device details');
            } finally {
                setHistoryDataLoading(false);
            }

            // 부분 계정 데이터 가져오기
            setPartDataLoading(true);
            setPartDataError(null);
            try {
                const partResponse = await fetchDevicePart(selectedDeviceId.serial_number);
                setDevicePartData(partResponse);
            } catch (error) {
                setPartDataError(error.message || 'Failed to fetch device details');
            } finally {
                setPartDataLoading(false);
            }

            setAdjustHistoryLoading(true);
            setAdjustHistoryError(null);
            try {
                const adjustResponse = await fetchAdjustmentValueHistory(selectedDeviceId.serial_number);
                setAdjustHistoryData(adjustResponse);
            } catch (error) {
                setAdjustHistoryError(error.message || 'Failed to fetch device details');
            } finally {
                setAdjustHistoryLoading(false);
            }

            setDeviceHistoryLogLoading(true);
            setDeviceHistoryLogError(null);
            try {
                const adjustResponse = await fetchDeviceHistoryLog(selectedDeviceId.serial_number);
                setDeviceHistoryLogData(adjustResponse);
            } catch (error) {
                setDeviceHistoryLogError(error.message || 'Failed to fetch device details');
            } finally {
                setDeviceHistoryLogLoading(false);
            }
        };

        fetchHistory();
    }, [selectedDeviceId]);  // selectedDeviceId가 변경될 때만 실행

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        deviceRefetch();  // 데이터 새로고침
        setSelectedDeviceId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };

    // Edit & Delete 메뉴
    const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);
    const closeDropdown = () => setIsOpenDropdown(false);

    const OverviewTab = () => {
        return(
            <>
                {partDataLoading ? (
                    <LoadingSpinner />
                ) : partDataError ? (
                    <p className="text-red-500">Error loading history: {historyError}</p>
                ) : devicePartData ? (
                    <DevicePartForm devicePartData={devicePartData} />
                ) : (
                    <p>Select an device to view details</p>
                )}
            </>
        )
    }
    const TransactionTab = () => {
        return(
            <div>
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
            </div>
        )
    }

    const highestRowData = deviceHistoryLogData?.length
        ? deviceHistoryLogData.sort((a, b) => b.row_number - a.row_number)[0]
        : null;
    console.log('deviceData :', deviceData)
    console.log(highestRowData);
    const HistoryTab = () => {
        return(
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
    const tabs = [
        { id: 1, label: 'Overview', content: <OverviewTab /> },
        { id: 2, label: 'Transaction', content: <TransactionTab /> },
        { id: 3, label: 'History', content: <HistoryTab /> },
    ];
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
                        <button onClick={toggleDropdown}
                                className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                            <BsThreeDotsVertical />
                        </button>
                        {isOpenDropdown && (
                            <div
                                className="absolute z-10 mt-32 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                                onMouseLeave={closeDropdown}>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Modify</a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                        <button onClick={() => console.log('device_setting')}
                                className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition">
                            <RiSettings3Fill />
                        </button>
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
                            <h2 className="py-1 text-lg font-bold text-red-600">{selectedDeviceId.serial_number}</h2>

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="devices"
                                id={selectedDeviceId.serial_number}
                                deleteFunction={deleteDevice}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/* Tab */}
                        <TabComponent tabs={tabs} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicePage;