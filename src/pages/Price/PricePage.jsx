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

import ExpandablePageLayout from '@/components/layout/ExpandablePageLayout'

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
        <>
            <ExpandablePageLayout
                title="요금제 관리"
                isExpanded={isExpanded}
                leftTitle="고객별 및 단말기별 요금제 & 조정 설정"
                newButtonTo="/price/new"
                onExportCSV={() => exportToCSV(priceData, 'Prices.csv')}
                onExportExcel={() => exportToExcel(priceData, 'prices.xlsx')}
                onRefresh={fetchPriceData}
                table={
                    <ReusableTable
                        columns={PriceTableColumns || []}
                        data={priceData || []}
                        options={{
                            ...PriceTableOptions(selectedPriceId),
                            meta: {
                                onRowSelect: (selectedRow) => {
                                    if (selectedPriceId?.ppid === selectedRow.ppid) {
                                        setSelectedPriceId(null);
                                        setIsExpanded(false); // 동일 row 선택 시 닫
                                    } else {
                                        setSelectedPriceId(selectedRow);
                                        setIsExpanded(true);
                                    }
                                },
                            },
                        }}
                        isLoading={priceLoading}
                        error={priceError}
                    />
                }
                selectedId={selectedPriceId}
                rightTitle={`${selectedPriceId?.ppid} _ ${selectedPriceId?.ppid}`}
                onClose={() => {
                    setIsExpanded(false);
                    setSelectedPriceId(null);
                }}
                entityType="price"
                editSelectedId={selectedPriceId?.ppid}
                deleteData={deletePriceData}
                handleDelete={handleDeleteSuccess}
                rightTabs={[
                    { id: 1, label: 'Overview', content: <PriceTabOverview /> },
                    { id: 2, label: 'Transaction', content: <PriceTabTransaction selectedPriceId={selectedPriceId} /> },
                    {
                        id: 3, label: 'History', content: (
                            <>
                                <h1 className="font-bold my-2 pt-4">단말 조정 이력 정보</h1>
                                <PriceTabHistory selectedPriceId={selectedPriceId} />
                            </>
                        )
                    }
                ]}
            />

            <div className="grid gap-0 col-span-6 justify-between pt-10 pb-3 mb-2 border-gray-400">
                <AdjustmentPage />
            </div>
        </>
    );
};

export default PricePage;
