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
import PriceTabItems from '../../components/form/Price/PriceTabItems.jsx';
import PriceTabOverview from '../../components/form/Price/PriceTabOverview.jsx';
import PriceTabTransaction from '../../components/form/Price/PriceTabTransaction.jsx';
import PriceTabHistory from '../../components/form/Price/PriceTabHistory.jsx';
import usePriceStore from '@/stores/priceStore.js';

const PricePage = () => {
    const {
        fetchPriceData,
        fetchPriceDetails,
        priceData,
        priceLoading,
        priceError,
        pricePartData,
        priceHistoryData,
        priceAdjustHistoryData,
    } = usePriceStore();

    const [selectedPriceId, setSelectedPriceId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Drawer 확장

    const [isOpenNewDropdown, setIsOpenNewDropdown] = useState(false); // New icon Drop
    const navigate = useNavigate();

    useEffect(() => {
        fetchPriceData();
    }, []);

    useEffect(() => {
        if (selectedPriceId?.ppid) {
            fetchPriceDetails(selectedPriceId.ppid);
        }
    }, [selectedPriceId]);


    // Modal
    const [showModal, setShowModal] = useState(false);

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = async (ppid) => {
        try {
            await deletePrice(ppid);
            fetchPriceData(); // 삭제 후 새로고침
            setSelectedPriceId(null);
            setIsExpanded(false);
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };


    // New Button Toggle
    const toggleNewDropdown = () => setIsOpenNewDropdown(!isOpenNewDropdown);
    const closeNewDropdown = () => setIsOpenNewDropdown(false);


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
                    data={priceData || []}
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
                    isLoading={priceLoading}
                    error={priceError}
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
                                <h2 className="py-1 text-lg font-bold">{selectedPriceId.ppid} _ {selectedPriceId.apply_company}</h2>
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
                        <TabComponent tabs={[
                            {
                                id: 1,
                                label: 'Overview',
                                content: (
                                    <PriceTabOverview />
                                )
                            },
                            {
                                id: 2,
                                label: 'Transaction',
                                content: (
                                    <PriceTabTransaction selectedPriceId={selectedPriceId}/>
                                )
                            },
                            {
                                id: 3,
                                label: 'History',
                                content: (
                                    <PriceTabHistory />
                                )
                            }
                        ]}
                        />
                        {/*<TabComponent tabs={PriceTabItems({*/}
                        {/*    selectedPriceId,*/}
                        {/*    pricePartData,*/}
                        {/*    partDataLoading,*/}
                        {/*    partDataError,*/}
                        {/*    adjustHistoryData,*/}
                        {/*    adjustHistoryLoading,*/}
                        {/*    adjustHistoryError,*/}
                        {/*    historyData,*/}
                        {/*    historyLoading,*/}
                        {/*    historyError*/}
                        {/*})} />*/}
                    </div>
                </div>
            )}

            <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                <AdjustmentPage />
            </div>

            {/*<div className="col-span-5 justify-between border-b pb-3 mb-2 border-gray-400">*/}
            {/*    <button*/}
            {/*        onClick={() => setShowModal(true)}*/}
            {/*        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"*/}
            {/*    >*/}
            {/*        플러스*/}
            {/*    </button>*/}

            {/*    <Modal show={showModal} onClose={() => setShowModal(false)}>*/}
            {/*        <p>This is the content inside the modal.</p>*/}
            {/*    </Modal>*/}
            {/*</div>*/}

        </div>
    );
};

export default PricePage;
