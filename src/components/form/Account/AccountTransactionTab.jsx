import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { AdjustmentReferencesTableColumns } from '@/columns/AdjustmentTableColumns.jsx';
import { AdjustmentValueTableOptions } from '@/options/AdjustmentTableOptions.jsx';
import useAccountStore from '@/stores/accountStore';
import useAdjustmentStore from '@/stores/adjustmentStore';
import EachTransactionDetailForm from '../Adjustment/EachTransactionDetailForm.jsx';
import ButtonGroup from '@/components/common/ButtonGroup.jsx';
import { TiPlus } from "react-icons/ti";
import { Tooltip } from '@mui/material';

const AccountTransactionTab = ({ selectedAccountId }) => {
    const {
        fetchAdjustmentPart,
        fetchAdjustmentValueData,
        adjustmentValueData,
        adjustmentValueLoading,
        adjustmentValueError,
        fetchAdjustmentDetailData,
        adjustmentDetailData,
        adjustmentDetailLoading,
        adjustmentDetailError,
        deleteAdjustmentData, // 삭제
        updateAdjustmentData // 수정
    } = useAdjustmentStore();

    const [selectedAdjustmentId, setSelectedAdjustmentId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedAccountId) {
            fetchAdjustmentValueData(selectedAccountId.acct_num)
        }
    }, [selectedAccountId]);

    useEffect(() => {
        if(selectedAdjustmentId) {
            fetchAdjustmentDetailData(selectedAdjustmentId.adjustment_index)
        }
    }, [selectedAdjustmentId]);

    // 계정 삭제 후 데이터를 다시 불러오기 위한 콜백
    const handleDeleteSuccess = async () => {
        try {
            await fetchAdjustmentDetailData(selectedAccountId.acct_num); // ✅ 삭제 후 새로고침
            setSelectedAdjustmentId(null);
            setIsExpanded(false);
        } catch (error) {
            alert("삭제 후 데이터를 불러오는데 실패했습니다.");
        }
    };

    const handleNewAdjustment = () => {
        if(!selectedAccountId?.acct_num) {
            // console.error("고객번호를 클릭해야 합니다.")
            return;
        }
        navigate(`/adjustment/new?adjustment_code=account_num&adjustment_code_value=${selectedAccountId.acct_num}`);
    }



    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className={`p-2 ${isExpanded ? 'col-span-3' : 'col-span-6'}`}>
                <div className="flex flex-row justify-between">
                    <h1 className="font-bold my-2">고객 조정 정보</h1>
                    <Tooltip title="단말기 조정 정보 추가">
                        <button
                            className="bg-blue-500 rounded-md text-white px-4 py-2 mb-2 hover:bg-blue-600"
                            onClick={() => {
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
                    <p className="text-red-500">{adjustmentValueError}</p>
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
                ) : (
                    <p>Select an account to view details</p>
                )}
            </div>

            {isExpanded && selectedAccountId && (
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
                            naming="account"
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

export default AccountTransactionTab;