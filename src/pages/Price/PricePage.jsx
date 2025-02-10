import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchPrice, deletePrice, fetchPriceHistory, fetchPricePart, fetchAdjustment } from '@/service/priceService.js';
import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { PriceTableOptions } from '@/options/PriceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import Modal from '@/components/common/Modal.jsx';

import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";

import PricePartForm from '@/components/form/PricePartForm.jsx';
import Tooltip from '@/components/common/Tooltip.jsx';
import AdditionButtons from '@/components/common/AdditionButtons.jsx';
import { AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';

const PricePage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchPrice);
    const { data: adjustmentData, loading: adjustmentLoading, error: adjustmentError, refetch: adjustmentRefetch } = useApiFetch(fetchAdjustment);
    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장

    const [isOpenNewDropdown, setIsOpenNewDropdown] = useState(false); // New icon Drop
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, ssetHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 부분 단말 데이터 상태
    const [pricePartData, setPricePartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // Modal
    const [showModal, setShowModal] = useState(false);

    // New Button Tooltip
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);


    // 선택된 ppid 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchParticular = async () => {
            if (!selectedPriceId) return;  // 선택된 값이 없으면 호출하지 않음

            // 이력 데이터 가져오기
            ssetHistoryLoading(true);
            setHistoryError(null);
            try {
                const response = await fetchPriceHistory(selectedPriceId.ppid);
                setHistoryData(response);
            } catch (error) {
                setHistoryError(error.message || 'Failed to fetch price particular');
            } finally {
                ssetHistoryLoading(false);
            }

            // 부분 계정 데이터 가져오기
            setPartDataLoading(true);
            setPartDataError(null);
            try {
                const partResponse = await fetchPricePart(selectedPriceId.ppid);
                setPricePartData(partResponse);
            } catch (error) {
                setPartDataError(error.message || 'Failed to fetch price details');
            } finally {
                setPartDataLoading(false);
            }
        };

        fetchParticular();
    }, [selectedPriceId]);  // selectedPriceId가 변경될 때만 실행

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = () => {
        refetch();  // 데이터 새로고침
        setSelectedPriceId(null);  // 선택 해제
        setIsExpanded(false); // Grid 초기 화면 복구
    };



    // New Button Toggle
    const toggleNewDropdown = () => setIsOpenNewDropdown(!isOpenNewDropdown);
    const closeNewDropdown = () => setIsOpenNewDropdown(false);


    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-5' : 'grid-cols-2'}`}>
            <div className="col-span-4 justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Price</h1>
            </div>

            {/* Left Section - Recent Table */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-5'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Price Data</h1>
                    <div className="flex space-x-2 items-center">
                        <div className="inline-flex rounded-md shadow-xs" role="group">
                            <Tooltip message="Create Price Plan">
                                <button type="button"
                                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-white font-medium bg-blue-500 border border-gray-200 rounded-s-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                        onClick={() => navigate('/price/new')}
                                >
                                    <FiPlus />
                                    <span>New</span>
                                </button>
                            </Tooltip>
                            <button type="button"
                                    className="inline-flex items-center px-1 py-2 text-sm font-medium text-white bg-blue-500 border border-gray-200 rounded-e-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                    onClick={toggleNewDropdown}
                            >
                                <IoIosArrowDown />
                            </button>
                            {isOpenNewDropdown && (
                                <div
                                    className="absolute z-10 mt-10 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                                    onMouseLeave={closeNewDropdown}>
                                    <div className="p-2 text-sm text-gray-700">
                                        <button onClick={() => navigate('/price/new')}
                                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                                            New PPID
                                        </button>
                                    </div>
                                    <ul className="p-2 text-sm text-gray-700">
                                        <li>
                                            <button onClick={() => console.log('adjustment')}
                                               className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">Modify</button>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <AdditionButtons/>

                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={PriceTableColumns}
                    data={data || []}
                    options={{
                        ...PriceTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log('onRowSelect called with id:', selectedRow);
                                // setSelectedPriceId(selectedRow);
                                // setIsExpanded(true);

                                // 같은 Row 선택
                                if (selectedPriceId && selectedPriceId.ppid === selectedRow.ppid) {
                                    setSelectedPriceId(null);
                                    setIsExpanded(false); // 동일 row 선택 시 닫기
                                } else { // 다른 Row 선택시
                                    setSelectedPriceId(selectedRow);
                                    setIsExpanded(true); // 새로운 row 선택 시 열기
                                }
                            },
                        },
                    }}
                    isLoading={loading}
                    error={error}
                />
            </div>

            {/* Right Section - Drawer Form */}
            {isExpanded && selectedPriceId && (
                <div className="p-2 col-span-3">
                    <div className="flex flex-col">
                        {/* Top */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Acct_Num */}
                            <h2 className="py-1 text-lg font-bold">PPID Detail Form</h2>
                            {/*<h2 className="py-1 text-lg font-bold text-red-600">{selectedPriceId.ppid}</h2>*/}

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="price"
                                id={selectedPriceId.ppid}
                                deleteFunction={deletePrice}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/* Bottom */}
                        <div>
                            {partDataLoading ? (
                                <LoadingSpinner />
                            ) : partDataError ? (
                                <p className="text-red-500">Error loading history: {historyError}</p>
                            ) : pricePartData ? (
                                <PricePartForm pricePartData={pricePartData} />
                            ) : (
                                <p>Select an price to view details</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Under Section - History Table */}
            {isExpanded && selectedPriceId && (
                <div className="p-2 col-span-5">
                    <div className="flex flex-col">
                        <div className="col-span-2 bg-gray-50 rounded-lg shadow-lg">
                            <div className="p-2">
                                <h2 className="text-xl font-bold">Price Particular</h2>

                                {historyLoading ? (
                                    <LoadingSpinner />
                                ) : historyError ? (
                                    <p>Error loading particular: {historyError}</p>
                                ) : (
                                    <div className="px-3">
                                        <ReusableTable
                                            columns={PriceTableColumns}
                                            data={historyData ? [historyData] : []}
                                            options={{
                                                initialState: { sorting: [{ id: 'ppid', desc: true }] },
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

            <div className="col-span-5 p-2">
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Adjustment Data</h1>
                    <div className="flex space-x-2 items-center">
                        <div className="inline-flex rounded-md shadow-xs" role="group">
                            <Tooltip message="Create Price Plan">
                                <button type="button"
                                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-white font-medium bg-blue-500 border border-gray-200 rounded-s-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                        onClick={() => navigate('/price/new')}
                                >
                                    <FiPlus />
                                    <span>New</span>
                                </button>
                            </Tooltip>
                            <button type="button"
                                    className="inline-flex items-center px-1 py-2 text-sm font-medium text-white bg-blue-500 border border-gray-200 rounded-e-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                    onClick={toggleNewDropdown}
                            >
                                <IoIosArrowDown />
                            </button>
                            {isOpenNewDropdown && (
                                <div
                                    className="absolute z-10 mt-10 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"
                                    onMouseLeave={closeNewDropdown}>
                                    <div className="p-2 text-sm text-gray-700">
                                        <button onClick={() => navigate('/price/new')}
                                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                                            New PPID
                                        </button>
                                    </div>
                                    <ul className="p-2 text-sm text-gray-700">
                                        <li>
                                            <button onClick={() => console.log('adjustment')}
                                                    className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">Modify</button>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ReusableTable
                    columns={AdjustmentTableColumns}
                    data={adjustmentData || []}
                    options={{
                        ...AdjustmentTableOptions,
                    }}
                    isLoading={adjustmentLoading}
                    error={adjustmentError}
                />
            </div>

            <div className="col-span-5 justify-between border-b pb-3 mb-2 border-gray-400">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    플러스
                </button>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <p>This is the content inside the modal.</p>
                </Modal>
            </div>

        </div>
    );
};

export default PricePage;
