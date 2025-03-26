import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentHistoryTableColumns, AdjustmentTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentHistoryTableOptions, AdjustmentTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';
import useDeviceStore from '@/stores/deviceStore.js';

const DeviceTransactionTab = ({ selectedDeviceId }) => {
    const { adjustHistoryData, adjustHistoryLoading, adjustHistoryError } = useDeviceStore();
    const navigate = useNavigate();
    console.log(adjustHistoryData.length)

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


    return(
        <>
            <div className="flex flex-row justify-between">
                <h1 className="font-bold my-2">단말기 조정 정보 이력</h1>
                <Tooltip title="단말기 조정 정보 추가">
                    <button className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600"
                            onClick={() => {
                                console.log("Button Clicked!");
                                handleClick();
                            }}
                    >
                        <TiPlus />
                    </button>
                </Tooltip>
            </div>
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
        </>
    )
}

export default DeviceTransactionTab;