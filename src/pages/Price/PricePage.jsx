import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchPrice, deletePrice, fetchPriceHistory, fetchPricePart } from '@/service/priceService.js';
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
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import { fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
import AdjustmentPage from '@/pages/Adjustment/AdjustmentPage.jsx';
import { TiPlus } from "react-icons/ti";


const PricePage = () => {
    const { data, loading, error, refetch } = useApiFetch(fetchPrice);
    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장

    const [isOpenNewDropdown, setIsOpenNewDropdown] = useState(false); // New icon Drop
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // 부분 단말 데이터 상태
    const [pricePartData, setPricePartData] = useState(null);
    const [partDataLoading, setPartDataLoading] = useState(false);
    const [partDataError, setPartDataError] = useState(null);

    // 조정 데이터 상태
    const [adjustHistoryData, setAdjustHistoryData] = useState(null);
    const [adjustHistoryLoading, setAdjustHistoryLoading] = useState(false);
    const [adjustHistoryError, setAdjustHistoryError] = useState(null);

    // Modal
    const [showModal, setShowModal] = useState(false);

    // 선택된 ppid 변경 시만 이력 데이터 가져오기
    useEffect(() => {
        const fetchParticular = async () => {
            if (!selectedPriceId) return;  // 선택된 값이 없으면 호출하지 않음

            // 이력 데이터 가져오기
            setHistoryLoading(true);
            setHistoryError(null);
            try {
                const response = await fetchPriceHistory(selectedPriceId.ppid);
                setHistoryData(response);
            } catch (error) {
                setHistoryError(error.message || 'Failed to fetch price particular');
            } finally {
                setHistoryLoading(false);
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

            // 조정 데이터 가져오기
            setAdjustHistoryLoading(true);
            setAdjustHistoryError(null);
            try {
                const adjustResponse = await fetchAdjustmentValueHistory(selectedPriceId.ppid);
                setAdjustHistoryData(adjustResponse);
            } catch (error) {
                setAdjustHistoryError(error.message || 'Failed to fetch account details');
            } finally {
                setAdjustHistoryLoading(false);
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


    const OverviewTab = () => {
        return(
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
        )
    }
    const TransactionTab = () => {
        return (
            <div className="flex flex-col">
                <div className="self-end">
                    <Tooltip message="가격 정책 조정 추가">
                        <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600">
                            <TiPlus />
                        </button>
                    </Tooltip>
                </div>
                {adjustHistoryLoading ? (
                    <LoadingSpinner />
                ) : adjustHistoryError ? (
                    <p className="text-red-500">{adjustHistoryError}</p>
                ) : (
                    <div>
                        <ReusableTable
                            columns={AdjustmentHistoryTableColumns}
                            data={adjustHistoryData}
                            options={AdjustmentHistoryTableOptions}
                        />
                    </div>
                )}
            </div>
        )
    }
    const HistoryTab = () => {
        return (
            <div>
                {historyLoading ? (
                    <LoadingSpinner />
                ) : historyError ? (
                    <p>Error loading particular: {historyError}</p>
                ) : (
                    <div>
                        <ReusableTable
                            columns={PriceTableColumns}
                            data={historyData}
                            options={{
                                initialState: { sorting: [{ id: 'ppid', desc: true }] },
                                enablePagination: false,
                                enableSorting: false,
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }
    const tabs = [
        { id: 1, label: 'Overview', content: <OverviewTab/>},
        // { id: 1, label: 'Overview', content: <AccountOverviewTab partDataLoading={partDataLoading} partDataError={partDataError} accountPartData={accountPartData}/> },
        { id: 2, label: 'Transaction', content: <TransactionTab /> },
        { id: 3, label: 'History', content: <HistoryTab /> },
    ];

    console.log('price data: ', data)

    return (
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">통신 요금제 관리</h1>
            </div>

            {/* Left Section - Recent Table */}
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>

                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">고객별 및 단말별 요금제(PPID) 설정</h1>
                    <div className="flex space-x-2 items-center">
                        <div className="inline-flex rounded-md shadow-xs" role="group">
                            <Tooltip message="Create Price Plan">
                                <button type="button"
                                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-white font-medium bg-blue-500 border border-gray-200 rounded-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                                        onClick={() => navigate('/price/new')}
                                >
                                    <FiPlus />
                                    <span>New</span>
                                </button>
                            </Tooltip>

                            {/*<button type="button"*/}
                            {/*        className="inline-flex items-center px-1 py-2 text-sm font-medium text-white bg-blue-500 border border-gray-200 rounded-e-lg hover:bg-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"*/}
                            {/*        onClick={toggleNewDropdown}*/}
                            {/*>*/}
                            {/*    <IoIosArrowDown />*/}
                            {/*</button>*/}
                            {/*{isOpenNewDropdown && (*/}
                            {/*    <div*/}
                            {/*        className="absolute z-10 mt-10 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300"*/}
                            {/*        onMouseLeave={closeNewDropdown}>*/}
                            {/*        <div className="p-2 text-sm text-gray-700">*/}
                            {/*            <button onClick={() => navigate('/price/new')}*/}
                            {/*                    className="block px-4 py-2 text-start w-full hover:bg-blue-500 hover:text-white rounded-md transition">*/}
                            {/*                New PPID*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*        <ul className="p-2 text-sm text-gray-700">*/}
                            {/*            <li>*/}
                            {/*                <button onClick={() => console.log('adjustment')}*/}
                            {/*                   className="block px-4 py-2 text-start w-full hover:bg-blue-500 hover:text-white rounded-md transition">Modify</button>*/}
                            {/*            </li>*/}
                            {/*            <li>*/}
                            {/*                <a href="#"*/}
                            {/*                   className="block px-4 py-2 text-start w-full hover:bg-blue-500 hover:text-white rounded-md transition">Delete</a>*/}
                            {/*            </li>*/}
                            {/*        </ul>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                        {/*<AdditionButtons/>*/}

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
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        {/* Top */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Acct_Num */}
                            {/*<h2 className="py-1 text-lg font-bold">PPID Detail Form <span className="text-red-500 pl-3">{pricePartData.ppid}</span></h2>*/}
                            <div className="flex flex-row items-center">
                                <span className="pr-2 font-bold">PPID : </span>
                                <h2 className="py-1 text-lg font-bold text-red-600">{selectedPriceId.ppid}</h2>
                            </div>

                            {/* Buttons - Edit & Mail & . */}
                            <ButtonGroup
                                entityType="price"
                                id={selectedPriceId.ppid}
                                deleteFunction={deletePrice}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/* Tab */}
                        <TabComponent tabs={tabs} />
                    </div>
                </div>
            )}

            <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                <AdjustmentPage />
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
