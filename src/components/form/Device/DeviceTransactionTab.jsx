import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentReferencesTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentValueTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import useDeviceStore from '@/stores/deviceStore.js';
import useAdjustmentStore from '@/stores/adjustmentStore';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import EachTransactionDetailForm from '@/components/form/Adjustment/EachTransactionDetailForm.jsx';

const DeviceTransactionTab = ({ selectedDeviceId }) => {
    const {
        fetchAdjustmentValueData,
        adjustmentValueData,
        adjustmentValueLoading,
        adjustmentValueError,
        fetchAdjustmentDetailData,
        adjustmentDetailData,
        adjustmentDetailLoading,
        adjustmentDetailError,
        deleteAdjustmentData,
    } = useAdjustmentStore();
    const { adjustHistoryData, adjustHistoryLoading, adjustHistoryError } = useDeviceStore();

    const [selectedAdjustmentId, setSelectedAdjustmentId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedDeviceId) {
            fetchAdjustmentValueData(selectedDeviceId.serial_number)
        }
    }, [selectedDeviceId]);

    useEffect(() => {
        if(selectedAdjustmentId) {
            fetchAdjustmentDetailData(selectedAdjustmentId.adjustment_index)
        }
    }, [selectedAdjustmentId]);

    const handleDeleteSuccess = async () => {
        try {
            await fetchAdjustmentDetailData(selectedDeviceId.serial_number); // ✅ 삭제 후 새로고침
            setSelectedAdjustmentId(null);
            setIsExpanded(false);
        } catch (error) {
            alert("삭제 후 데이터를 불러오는데 실패했습니다.");
        }
    };

    const handleClick = () => {
        if (!selectedDeviceId?.serial_number) {
            console.error("serial_number가 존재하지 않습니다.");
            return;
        }

        if (!adjustHistoryData || adjustHistoryData.length === 0) {
            // 🔹 조정 정보가 없으면 새로운 조정 추가 페이지로 이동
            console.log("Navigating to new adjustment page");
            navigate(`/adjustment/new?adjustment_code=serial_number&adjustment_code_value=${selectedDeviceId.serial_number}`);
        } else {
            // 🔹 조정 정보가 있으면 가장 최근 adjustment_index 가져와서 수정 페이지로 이동
            const latestAdjustment = adjustHistoryData[0]; // 최신 데이터 (정렬이 되어 있다고 가정)
            console.log("Navigating to edit adjustment page:", latestAdjustment.adjustment_index);
            navigate(`/adjustment/${latestAdjustment.adjustment_index}/adjustment_code=serial_number&edit?adjustment_code_value=${selectedDeviceId.serial_number}`);
        }
    };

    const handleNewAdjustment = () => {
        if(!selectedDeviceId?.serial_number) {
            console.error("고객번호를 클릭해야 합니다.")
            return;
        }
        navigate(`/adjustment/new?adjustment_code=serial_number&adjustment_code_value=${selectedDeviceId.serial_number}`);
    }


    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className={`p-2 ${isExpanded ? 'col-span-3' : 'col-span-6'}`}>
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold my-2">단말기 조정 정보 이력</h1>
                    <Tooltip title="단말기 조정 정보 추가">
                        <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600"
                                onClick={() => {
                                    console.log("Button Clicked!");
                                    handleNewAdjustment();
                                }}
                        >
                            <TiPlus />
                        </button>
                    </Tooltip>
                </div>
                {adjustmentValueLoading ? (
                    <LoadingSpinner />
                ) : adjustmentValueError ? (
                    <p className="text-red-500">Error loading history: {adjustmentValueError}</p>
                ) : adjustmentValueData ? (
                    <ReusableTable
                        columns={AdjustmentReferencesTableColumns}
                        data={adjustmentValueData || []}
                        options={{
                            ...AdjustmentValueTableOptions,
                            meta: {
                                onRowSelect: (selectedRow) => {
                                    if (selectedAdjustmentId && selectedAdjustmentId.adjustment_index === selectedRow.adjustment_index) {
                                        setSelectedAdjustmentId(null);
                                        setIsExpanded(false);
                                    } else {
                                        setSelectedAdjustmentId(selectedRow);
                                        setIsExpanded(true);
                                    }
                                },
                            },
                        }}
                    />
                ) : <p>Select an device to view details</p>}
            </div>

            {isExpanded && selectedDeviceId && (
                <div className="p-2 col-span-3">
                    <div className="flex flex-row justify-end">
                        <ButtonGroup
                            entityType="adjustment"
                            id={selectedAdjustmentId?.adjustment_index} // ✅ 현재 선택된 조정 ID
                            deleteFunction={deleteAdjustmentData}
                            onDeleteSuccess={handleDeleteSuccess}
                        />

                    </div>

                    <div className="flex flex-col">
                        <EachTransactionDetailForm
                            naming="device"
                            adjustmentDetailData={adjustmentDetailData}
                            adjustmentDetailLoading={adjustmentDetailLoading}
                            adjustmentDetailError={adjustmentDetailError}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeviceTransactionTab;