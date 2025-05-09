import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchDevices, deleteDevice, fetchDeviceHistory } from '@/service/deviceService.js';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns.jsx';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';

import { useNavigate } from "react-router-dom";

import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';

const CDRPage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchDevices);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장
    const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 선택된 serial_number 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedDeviceId) return;  // 선택된 값이 없으면 호출하지 않음

            setHistoryLoading(true);
            setHistoryError(null);
            try {
                const response = await fetchDeviceHistory(selectedDeviceId.serial_number);
                setHistoryData(response);
            } catch (error) {
                setHistoryError(error.message || "Failed to fetch device history");
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [selectedDeviceId]);  // selectedDeviceId가 변경될 때만 실행

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        refetch();  // 데이터 새로고침
        setSelectedDeviceId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };

    // Edit & Delete 메뉴
    const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);
    const closeDropdown = () => setIsOpenDropdown(false);

    if (loading) return <LoadingSpinner/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {/* Left Section */}
            <div className={`p-2 ${isExpanded ? 'col-span-1' : 'col-span-3'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Device Data</h1>
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
                    data={data}
                    options={{
                        ...DeviceTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                // console.log('onRowSelect called with id:', selectedRow);
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
                />
            </div>

            {/* Right Section (Only visible when expanded) */}
            {isExpanded && selectedDeviceId && (
                <div className="p-2 col-span-2">
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

                        {/* Bottom */}
                        <div className="col-span-2 bg-gray-50 rounded-lg shadow-lg">
                            <div className="p-4">
                                <h2 className="text-xl font-bold">Device History</h2>
                                {historyLoading ? (
                                    <LoadingSpinner />
                                ) : historyError ? (
                                    <p>Error loading history: {historyError}</p>
                                ) : (
                                    <div className="px-3">
                                        <ReusableTable
                                            columns={DeviceTableColumns}
                                            data={historyData ? [historyData] : []}
                                            options={{
                                                initialState: { sorting: [{ id: 'serial_number', desc: true }] },
                                                enablePagination: false,
                                                enableSorting: false,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CDRPage;