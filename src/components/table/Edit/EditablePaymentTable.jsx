import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import usePaymentStore from '@/stores/paymentStore';
import PaymentTableColumns from '@/columns/PaymentTableColumns';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { getExportDataFromTable } from '@/utils/exportHelpers';
import { prepareExportData } from '@/utils/exportHelpers';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';
import { Box, Button, CircularProgress, LinearProgress, Skeleton, Stack, Typography, Alert } from '@mui/material';
import RefreshButton from '@/components/common/RefreshButton.jsx';
import AccountPaymentList from '@/components/form/Homepage/AccountPaymentList.jsx';
import useYearMonth from '@/hooks/useYearMonth.js';

const EditablePaymentTable = ({ fetchMonthlyAcctSaveData, data, loading, error, yearMonth, selectedDate, handleDateChange }) => {
    const yearMonthHook = useYearMonth();
    const { updateConfirmStatus } = usePaymentStore();
    const [rows, setRows] = useState([]);
    const [tableRows, setTableRows] = useState([]); // 테이블용 가공 데이터
    const [selectionModel, setSelectionModel] = useState([]);

    // Save 상태 추가
    const [saving, setSaving] = useState(false); // 저장 중 로딩 표시용
    const hasModifiedRows = tableRows.some(row => row.isModified); // 렌더링 시 매번 최신 상태 계산

    useEffect(() => {
        if (Array.isArray(data)) {
            // 원본 rows 설정
            const withIds = data.map((row, idx) => ({ id: idx + 1, ...row }));
            setRows(withIds);

            // 테이블용 rows 생성
            const simplified = data.map((row, idx) => ({
                id: idx + 1,
                acct_num: row.acct_num,
                acct_name: row.account_info?.acct_name || '',
                monthly_final_fee: row.monthly_final_fee || 0,
                none_pay_fee_basic: row.none_pay_fee - row.late_payment_penalty_fee || 0,
                late_payment_penalty_fee: row.late_payment_penalty_fee || 0,
                final_fee: row.final_fee || 0,
                payment_amount_fee: row.payment_amount_fee || 0,
                unpaid_balance_fee: row.unpaid_balance_fee || 0,
                confirm_yn: row.confirm_yn || 'N',
                confirm_payment_date: row.confirm_payment_date || null,
                confirm_payment_method: row.confirm_payment_method || '',
                confirm_payment_desc: row.confirm_payment_desc || '',
                isModified: false, // 🔥 수정 여부 트래킹
            }));

            setRows(simplified);
            setTableRows(simplified);
        } else {
            setRows([]);
            setTableRows([]);
        }
    }, [data]);


    // ✅ 셀 수정 반영
    const processRowUpdate = (newRow) => {
        // 모든 계산을 일괄적으로 수행
        const monthlyFinalFee = Number(newRow.monthly_final_fee) || 0;
        const nonePayFeeBasic = Number(newRow.none_pay_fee_basic) || 0;
        const latePaymentPenaltyFee = Number(newRow.late_payment_penalty_fee) || 0;
        const paymentAmountFee = Number(newRow.payment_amount_fee) || 0;

        // 1️⃣ 총 납부 금액 계산
        const finalFee = monthlyFinalFee + nonePayFeeBasic + latePaymentPenaltyFee;

        // 2️⃣ 미납 잔액 계산
        const unpaidBalanceFee = finalFee - paymentAmountFee;

        // 3️⃣ 상태 계산
        let confirmYn = 'N';
        if(finalFee === unpaidBalanceFee && paymentAmountFee === 0) {
            confirmYn = 'N'; // 미납
        } else if(finalFee !== paymentAmountFee && unpaidBalanceFee > 0) {
            confirmYn = 'P'; // 부분납
        } else {
            confirmYn = 'Y'; // 완납
        }

        // 4️⃣ updatedRow 작성
        const updatedRow = {
            ...newRow,
            final_fee: finalFee,
            unpaid_balance_fee: unpaidBalanceFee,
            confirm_yn: confirmYn
        };

        // 5️⃣ 적용
        setTableRows((prev) =>
            prev.map((row) =>
                row.id === updatedRow.id ? { ...updatedRow, isModified: true } : row
            )
        );

        return updatedRow;
    };


    // ✅ Checkbox handle
    const handleSelectionChange = (newSelection) => {
        const todayStr = dayjs().format('YYYY-MM-DDTHH:mm:ss'); // 오늘 날짜 문자열

        setSelectionModel(newSelection);

        setTableRows((prev) =>
            prev.map((row) => {
                if (newSelection.includes(row.id)) {
                    console.log(row)
                    // ✅ 선택된 row: 값 세팅
                    return {
                        ...row,
                        payment_amount_fee: row.final_fee,
                        unpaid_balance_fee: 0,
                        confirm_yn: 'Y',
                        confirm_payment_date: todayStr,
                        confirm_payment_method: 'giro',
                        isModified: true,
                    };
                } else if (selectionModel.includes(row.id)) {
                    // ✅ 해제된 row: 원본 값 복원
                    const original = rows.find((r) => r.id === row.id);
                    return {
                        ...original,
                        isModified: true,
                    };
                }
                return row;
            })
        );
    };

    console.log('Table Row Data', tableRows)
    const handleSaveAll = async () => {
        const modifiedRows = tableRows.filter((row) => row.isModified);

        if (modifiedRows.length === 0) {
            alert('⚠️ 수정된 데이터가 없습니다.');
            return;
        }

        // 분류
        let overpaidRows = [];
        let underpaidRows = [];
        let exactPaidRows = [];

        modifiedRows.forEach(row => {
            const finalFee = Number(row.final_fee);
            const paymentFee = Number(row.payment_amount_fee);

            if (finalFee < paymentFee) {
                overpaidRows.push(row);
            } else if (finalFee > paymentFee) {
                underpaidRows.push(row);
            } else {
                exactPaidRows.push(row);
            }
        });

        // 🔹 1. 수정된 전체 항목 요약 메시지
        const allRowsMessage = [...exactPaidRows, ...underpaidRows, ...overpaidRows]
            .map(row => {
                const finalFee = Number(row.final_fee);
                const paymentFee = Number(row.payment_amount_fee);
                let status = '';

                if (finalFee < paymentFee) status = '과오납';
                else if (finalFee > paymentFee) status = '부분납';
                else status = '완납';

                return `- ${row.acct_name} (${row.acct_num}): ${status}`;
            })
            .join('\n');

        // 🔸 2. 부분납에 대한 추가 경고
        const hasPartial = underpaidRows.length > 0;
        const partialNotice = hasPartial
            ? '\n\n⚠️ 부분납이 확인된 항목은 미납액이 존재하며, 다음달 청구에 합산됩니다.'
            : '';

        const confirmResult = window.confirm(
            `다음 항목의 변경 내용이 감지되었습니다:\n\n${allRowsMessage}${partialNotice}\n\n저장하시겠습니까?`
        );

        if (!confirmResult) return;

        try {
            setSaving(true);
            const postData = modifiedRows.map(({ id, isModified, confirm_payment_date, ...rest }) => ({
                ...rest,
                confirm_payment_date: confirm_payment_date
                    ? dayjs(confirm_payment_date).format('YYYY-MM-DDTHH:mm:ss')
                    : null,
            }));

            await updateConfirmStatus(yearMonth, postData);
            alert('✅ 수정된 항목 저장 완료');
            setTableRows((prev) => prev.map(row => ({ ...row, isModified: false })));
        } catch (err) {
            console.error('❌ 저장 실패:', err);
            alert('❌ 저장 실패');
        } finally {
            setSaving(false);
        }
    };



    console.log(selectionModel)
    return (
        <Box sx={{ width: '100%', p: 2, mb: 8, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <div className="flex flex-row items-center justify-between mb-3">
                <h1 className="text-xl font-bold">
                    {selectedDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                    })}
                </h1>
                <div className="flex flex-row z-10 items-center space-x-4">
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                    <DataActionDropdown
                        onExportCSV={() => {
                            const exportData = prepareExportData(PaymentTableColumns, data);
                            exportToCSV(exportData, 'Payment_Status.csv');
                        }}
                        onExportExcel={() => {
                            const exportData = prepareExportData(PaymentTableColumns, data);
                            exportToExcel(exportData, 'Payment_Status.xlsx');
                        }}
                        onRefresh={() => fetchMonthlyAcctSaveData(yearMonth)}
                    />
                    <RefreshButton onRefresh={() => fetchMonthlyAcctSaveData(yearMonth)}/>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSaveAll} disabled={!hasModifiedRows || saving} startIcon={saving ? <CircularProgress size={16} color="inheerit" /> : null}
                        >
                            {saving ? '저장 중...' : '전체 저장'}
                        </Button>
                    </Stack>
                    <AccountPaymentList
                        startDate={yearMonthHook.startDate}
                        endDate={yearMonthHook.endDate}
                        startIndex={yearMonthHook.start_index}
                        endIndex={yearMonthHook.end_index}
                        handleStartDateChange={yearMonthHook.handleStartDateChange}
                        handleEndDateChange={yearMonthHook.handleEndDateChange}
                    />
                </div>
            </div>

            {/* ✅ 로딩 중: Progress + Skeleton */}
            {loading && (
                <>
                    <LinearProgress />
                    <Box sx={{ mt: 2 }}>
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                variant="rectangular"
                                animation="wave"
                                height={40}
                                sx={{ mb: 1, borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                </>
            )}

            {/* ✅ 에러 발생 시 */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    ❌ 데이터를 불러오는 중 오류가 발생했습니다: {error.message || '서버 오류'}
                </Alert>
            )}

            {/* ✅ 정상 로딩 후 테이블 */}
            {!loading && !error && (
                <Box sx={{ height: 650 }}>
                    <DataGrid
                        rows={tableRows}
                        columns={PaymentTableColumns}
                        checkboxSelection
                        disableRowSelectionOnClick
                        processRowUpdate={processRowUpdate}
                        experimentalFeatures={{ newEditingApi: true }}
                        onRowSelectionModelChange={handleSelectionChange}
                        rowSelectionModel={selectionModel}
                        sx={{ backgroundColor: 'white' }}
                        sortModel={[
                            { field: 'acct_num', sort: 'asc' }
                        ]}
                    />
                </Box>
            )}
        </Box>
    );
};

export default EditablePaymentTable;