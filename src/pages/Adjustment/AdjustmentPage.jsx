import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdjustmentStore from '@/stores/adjustmentStore.js';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';

import ReusableTable from '@/components/table/ReusableTable.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import NewButton from '@/components/common/NewButton.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

import AdjustmentTabItems from '@/components/form/Adjustment/AdjustmentTabItems.jsx';
import { AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import useAdjustmentMappingStore from '@/stores/adjustmentMappingStore';

const AdjustmentPage = () => {
    const { fetchCodeMappings } = useAdjustmentMappingStore();
    const {
        // 전체 데이터
        adjustmentData,
        adjustmentLoading,
        adjustmentError,
        fetchAdjustmentData,

        // 부분 데이터 상태
        adjustmentDetailData,
        adjustmentDetailLoading,
        adjustmentDetailError,
        fetchAdjustmentDetailData,

        // 이력 데이터 상태
        adjustmentDetailHistoryData,
        adjustmentDetailHistoryLoading,
        adjustmentDetailHistoryError,
        fetchAdjustmentValueHistory,
        deleteAdjustmentData,
    } = useAdjustmentStore();
    // console.log(adjustmentData)

    const [selectedAdjustId, setSelectedAdjustId] = useState(null);
    const [isAdjustExpanded, setIsAdjustExpanded] = useState(false); // Drawer 확장
    const navigate = useNavigate();

    const codeMappings = useAdjustmentMappings();

    useEffect(() => {
        fetchAdjustmentData();
        fetchCodeMappings(); // ✅ 여기서 한 번만 호출
    }, []);

    useEffect(() => {
        if (!selectedAdjustId) return;
        fetchAdjustmentDetailData(selectedAdjustId.adjustment_index);
        fetchAdjustmentValueHistory(selectedAdjustId.adjustment_code_value);
    }, [selectedAdjustId]);

    const handleDeleteSuccess = async (index) => {
        try {
            await fetchAdjustmentData(); // ❌ 삭제 다시 안함! (이미 됐음)
            setSelectedAdjustId(null);
            setIsAdjustExpanded(false);
            // console.log(`✅ 삭제 후 새로고침 완료 (Adjustment: ${index})`);
        } catch (error) {
            alert("삭제 후 데이터 갱신에 실패했습니다.");
        }
    };

    return(
        <div className={`grid gap-0 ${isAdjustExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">조정 내역 관리</h1>
            </div>

            {/* Left Section */}
            <div className={`p-2 ${isAdjustExpanded ? 'col-span-2' : 'col-span-6'}`}>
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">할인, 가산 요금 등 조정 내역 삽입, 수정, 삭제</h1>
                    <div className="flex space-x-2 items-center">
                        <NewButton to="/adjustment/new" />

                        <DataActionDropdown
                            onExportCSV={() => exportToCSV(adjustmentData, 'Adjustments.csv')}
                            onExportExcel={() => exportToExcel(adjustmentData, 'Adjustments.xlsx')}
                            onRefresh={fetchAdjustmentData}
                        />
                    </div>
                </div>
                {/* Bottom */}
                <ReusableTable
                    columns={AdjustmentTableColumns}
                    data={adjustmentData || []}
                    options={{
                        ...AdjustmentTableOptions(selectedAdjustId),
                        meta: {
                            onRowSelect: (selectedRow) => {
                                if (selectedAdjustId && selectedAdjustId.adjustment_index === selectedRow.adjustment_index) {
                                    setSelectedAdjustId(null);
                                    setIsAdjustExpanded(false);
                                } else {
                                    setSelectedAdjustId(selectedRow);
                                    setIsAdjustExpanded(true);
                                }
                            },
                        },
                    }}
                    error={adjustmentError}
                    isLoading={adjustmentLoading}
                />
            </div>

            {/* Right Section */}
            {isAdjustExpanded && selectedAdjustId && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <h2 className="py-1 text-lg font-bold">{codeMappings.adjustment_code[selectedAdjustId.adjustment_code]} _ {selectedAdjustId.adjustment_code_value}</h2>
                            </div>

                            <ButtonGroup
                                entityType="adjustment"
                                id={selectedAdjustId.adjustment_index}
                                deleteFunction={deleteAdjustmentData}
                                onDeleteSuccess={handleDeleteSuccess}  // 삭제 후 리프레시 콜백 전달
                            />
                        </div>

                        {/*<TabComponent tab={[*/}
                        {/*    {*/}
                        {/*        id: 1,*/}
                        {/*        label: 'Overview',*/}
                        {/*        content:*/}
                        {/*            <div>*/}
                        {/*                {adjustmentDetailLoading ? (*/}
                        {/*                    <LoadingSpinner />*/}
                        {/*                ) : adjustmentDetailError ? (*/}
                        {/*                    <p className="text-red-500">Error loading history: {adjustmentDetailError}</p>*/}
                        {/*                ) : adjustmentDetailData ? (*/}
                        {/*                    <AdjustmentPartForm adjustPartData={adjustmentDetailData} />*/}
                        {/*                ) : (*/}
                        {/*                    <p>Select an price to view details</p>*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*    },*/}
                        {/*    {*/}
                        {/*        id: 2,*/}
                        {/*        label: 'History',*/}
                        {/*        content:*/}
                        {/*            <div>*/}
                        {/*                <div className="flex flex-row justify-between">*/}
                        {/*                    <h1 className="font-bold my-2">고객 조정 정보 이력</h1>*/}
                        {/*                    <Tooltip title="고객 조정 정보 추가">*/}
                        {/*                        <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600">*/}
                        {/*                            <TiPlus />*/}
                        {/*                        </button>*/}
                        {/*                    </Tooltip>*/}
                        {/*                </div>*/}
                        {/*                {adjustmentDetailHistoryLoading ? (*/}
                        {/*                    <LoadingSpinner />*/}
                        {/*                ) : adjustmentDetailHistoryError ? (*/}
                        {/*                    <p className="text-red-500">Error loading history: {adjustmentDetailHistoryError}</p>*/}
                        {/*                ) : adjustmentDetailHistoryData ? (*/}
                        {/*                    <ReusableTable*/}
                        {/*                        data={adjustmentDetailHistoryData}*/}
                        {/*                        columns={AdjustmentHistoryTableColumns}*/}
                        {/*                        options={AdjustmentHistoryTableOptions}*/}
                        {/*                    />*/}
                        {/*                ) : (*/}
                        {/*                    <p>Select an price to view details</p>*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*    }*/}
                        {/*]}*/}
                        {/*/>*/}
                        <TabComponent tabs={AdjustmentTabItems({
                            selectedAdjustId,
                            adjustmentDetailData,
                            adjustmentDetailLoading,
                            adjustmentDetailError,
                            adjustmentDetailHistoryData,
                            adjustmentDetailHistoryLoading,
                            adjustmentDetailHistoryError,
                        })} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdjustmentPage;