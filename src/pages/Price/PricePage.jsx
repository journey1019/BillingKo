import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { PriceTableColumns } from '@/columns/PriceTableColumns.jsx';
import { PriceTableOptions } from '@/options/PriceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';

import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import Modal from '@/components/common/Modal.jsx';
import { useNavigate } from 'react-router-dom';

import PricePartForm from '@/components/form/PricePartForm.jsx';
import Tooltip from '@/components/common/Tooltip.jsx';
import AdditionButtons from '@/components/common/AdditionButtons.jsx';
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import { fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
import AdjustmentPage from '@/pages/Adjustment/AdjustmentPage.jsx';

import PriceTabItems from '../../components/form/Price/PriceTabItems.jsx';
import PriceTabOverview from '../../components/form/Price/PriceTabOverview.jsx';
import PriceTabTransaction from '../../components/form/Price/PriceTabTransaction.jsx';
import PriceTabHistory from '../../components/form/Price/PriceTabHistory.jsx';
import usePriceStore from '@/stores/priceStore.js';

import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

const PricePage = () => {
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.get("value");

    const {
        fetchPriceData,
        fetchPriceDetails,
        priceData,
        priceLoading,
        priceError,
        deletePriceData
    } = usePriceStore();

    const [selectedPriceId, setSelectedPriceId] = useState(urlValue || null);
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

    // ✅ urlValue로 선택할 계정 자동 설정
    useEffect(() => {
        if (urlValue && priceData.length > 0) {
            const matchedDevice = priceData.find(price => String(price.ppid) === urlValue);
            if (matchedDevice) {
                setSelectedPriceId(matchedDevice);
                setIsExpanded(true);
            }
        }
    }, [urlValue, priceData]);


    // Modal
    const [showModal, setShowModal] = useState(false);

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = async (ppid) => {
        try {
            await fetchPriceData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedPriceId(null);
            setIsExpanded(false);
            // console.log(`✅ 삭제 후 새로고침 완료 (ppid: ${ppid})`);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };


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
                        <NewButton to="/price/new" />

                        <DataActionDropdown
                            onExportCSV={() => exportToCSV(priceData, 'Prices.csv')}
                            onExportExcel={() => exportToExcel(priceData, 'Prices.xlsx')}
                            onRefresh={fetchPriceData}
                        />
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={PriceTableColumns}
                    data={priceData || []}
                    options={{
                        ...PriceTableOptions(selectedPriceId),
                        meta: {
                            onRowSelect: (selectedRow) => {
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
                                deleteFunction={deletePriceData}
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
                                    <PriceTabHistory selectedPriceId={selectedPriceId}/>
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

            <div className="col-span-6 justify-between pt-10 pb-3 mb-2 border-gray-400">
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
