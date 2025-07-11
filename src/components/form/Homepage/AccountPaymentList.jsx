import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip, List, ListItem, ListItemText, ListSubheader, CircularProgress, Box, Button, Typography, TextField } from '@mui/material';
import { TbLayoutBottombarExpand } from "react-icons/tb";
import { formatNumber } from '@/utils/formatHelpers'; // 숫자 포맷팅 함수

import useAccountStore from '@/stores/accountStore';
import { useAcctNumNameList } from '@/selectors/useAccountSelectors.js';
import usePaymentStore from '@/stores/paymentStore.js';

import ReusableTable from '@/components/table/ReusableTable.jsx';
import FullScreenDialog from '@/components/ui/modals/FullScreenDialog';
import { PaymentAccountTableColumns } from '@/columns/PaymentAccountTableColumns.jsx';
import { PaymentAccountTableOptions } from '@/options/PaymentAccountTableOptions.jsx';

import { getExportDataFromTable } from '@/utils/exportHelpers';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';
import CustomProgressBar from '@/components/ui/CustomProgressBar.jsx'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // 추가
import dayjs from 'dayjs';

import { formatDateToYMD } from '@/columns/cellStyle/PaymentCell.jsx';
import AccountPaymentDetailPanel from './AccountPaymentDetailList.jsx';
import AccountPaymentDetailList from './AccountPaymentDetailList.jsx';

const AccountPaymentList = ({ startDate, endDate, startIndex, endIndex, handleStartDateChange, handleEndDateChange }) => {
    const { fetchAccountData } = useAccountStore();
    const acctNumAliasList = useAcctNumNameList();
    const {
        // History
        fetchAccountPaymentHistory,
        accountPaymentHistoryData,
        accountPaymentHistoryLoading,
        accountPaymentHistoryError,

        fetchAccountPaymentHistoryDetail,
        accountPaymentHistoryDetailData,
        accountPaymentHistoryDetailLoading,
        accountPaymentHistoryDetailError
    } = usePaymentStore();

    // FullScreenDialog Open
    const [open, setOpen] = useState(false);
    // dialog open Handler
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // List Account Click
    const [selectedAcctNum, setSelectedAcctNum] = useState('');
    // 검색 keyword
    const [searchKeyword, setSearchKeyword] = useState("");

    // 테이블 필터 상태 추적
    const [columnFilters, setColumnFilters] = useState([]);

    // detail row 상태
    const [selectedDetailRow, setSelectedDetailRow] = useState(null);
    const [expandedRowIds, setExpandedRowIds] = useState([]);

    // detail data를 map 구조로 row 별 구분
    const [accountPaymentHistoryDetailMap, setAccountPaymentHistoryDetailMap] = useState({});


    // 💡 필터링된 납부 집계 계산
    // ✅ 수정된 납부 합계 계산 로직
    // CustomProgressBar 제작을 위한 데이터 셋
    const { totalUnpaidFee, confirmedFee, unpaidFee } = useMemo(() => {
        if (!accountPaymentHistoryData) return { totalUnpaidFee: 0, confirmedFee: 0, unpaidFee: 0 };

        // 고객 미납료 총합 (미납료 + 연체가산금)
        /**
         * @summary: 미납 이력이 쌓이더라도 -> 한 번에 완납 시 적용되지 않는 불변의 Hisotry 인데, 의미가 있을지 모르겠음
         * */
        const totalUnpaidFee = accountPaymentHistoryData.reduce(
            (sum, row) => sum + (Number(row.none_pay_fee) || 0), 0
        );

        // date_index 범위 필터 추출
        const dateRangeFilter = columnFilters.find(f => f.id === 'date_index');
        let filtered = [...accountPaymentHistoryData];

        if (dateRangeFilter && Array.isArray(dateRangeFilter.value)) {
            const [min, max] = dateRangeFilter.value;
            filtered = filtered.filter(row => {
                const date = row.date_index;
                return (!min || date >= min) && (!max || date <= max);
            });
        }

        // 납부 완료 금액
        const confirmedFee = filtered
            .filter(row => row.confirm_yn === 'Y' || row.confirm_yn === 'P')
            .reduce((sum, row) => sum + (Number(row.payment_amount_fee) || 0), 0);

        // 미납 금액
        const unpaidFee = filtered
            .filter(row => row.confirm_yn === 'N' || row.confirm_yn === 'P')
            .reduce((sum, row) => sum + (Number(row.unpaid_balance_fee) || 0), 0);

        return { totalUnpaidFee, confirmedFee, unpaidFee };
    }, [accountPaymentHistoryData, columnFilters]);

    useEffect(() => {
        fetchAccountData();
    }, []);

    useEffect(() => {
        if (selectedAcctNum && startIndex && endIndex) {
            // 날짜 또는 선택된 고객번호가 변경되면 API 호출
            fetchAccountPaymentHistory(selectedAcctNum, startIndex, endIndex);
        }
    }, [selectedAcctNum, startIndex, endIndex, fetchAccountPaymentHistory]);


    const handleSelectAcctNum = (acct) => {
        if (!startIndex || !endIndex) {
            alert("⚠️ 연월 값이 올바르지 않습니다. 날짜를 다시 선택해주세요.");
            return;
        }
        setSelectedAcctNum(acct);
        fetchAccountPaymentHistory(acct, startIndex, endIndex);
    };

    // History Detail
    const handleRowSelect = (row) => {
        const rowId = row?.date_index;
        if (!rowId) return;

        // Row 클릭은 fetch trigger 용도 (expand toggle X)
        if (accountPaymentHistoryDetailMap[rowId] !== undefined) return;

        setAccountPaymentHistoryDetailMap((prev) => ({
            ...prev,
            [rowId]: 'LOADING',
        }));

        fetchAccountPaymentHistoryDetail(selectedAcctNum, rowId).then((data) => {
            setAccountPaymentHistoryDetailMap((prev) => ({
                ...prev,
                [rowId]: data || [],
            }));
        });
    };





    // acct_num 기준 내림차순 + 검색 키워드 반영
    const filteredAcctList = useMemo(() => {
        return acctNumAliasList
            .filter(({ acct_num, acct_name }) =>
                acct_num.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                acct_name.toLowerCase().includes(searchKeyword.toLowerCase())
            )
            .sort((a, b) => b.acct_num.localeCompare(a.acct_num)); // 내림차순
    }, [acctNumAliasList, searchKeyword]);

    const selectedAcctName = useMemo(() => {
        const found = acctNumAliasList.find(item => item.acct_num === selectedAcctNum);
        return found ? found.acct_name : '';
    }, [acctNumAliasList, selectedAcctNum]);


    // none_pay_fee_basic을 추가한 데이터 생성
    const enhancedAccountPaymentHistoryData = useMemo(() => {
        if (!accountPaymentHistoryData) return [];

        return accountPaymentHistoryData.map(item => ({
            ...item,
            none_pay_fee_basic: (Number(item.none_pay_fee) || 0) - (Number(item.late_payment_penalty_fee) || 0),
        }));
    }, [accountPaymentHistoryData]);

    const handleExportCSV = () => {
        const exportData = getExportDataFromTable(PaymentAccountTableColumns, enhancedAccountPaymentHistoryData);
        exportToCSV(exportData, `${selectedAcctName}_납부이력.csv`);
    };
    const handleExportExcel = () => {
        const exportData = getExportDataFromTable(PaymentAccountTableColumns, enhancedAccountPaymentHistoryData);
        exportToExcel(exportData, `${selectedAcctName}_납부이력.xlsx`);
    };



    // console.log(expandedRowIds)
    // console.log(accountPaymentHistoryDetailMap)


    return (
        <>
            <Tooltip title="고객별 세부 납부현황 확인">
                <div onClick={handleOpen} className="p-2 items-center hover:bg-gray-100 rounded-md hover:cursor-pointer">
                    <TbLayoutBottombarExpand className="w-5 h-5" />
                </div>
            </Tooltip>

            <FullScreenDialog open={open} onClose={handleClose} title="고객별 납부 상세 정보">
                <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                    {/* 왼쪽 고객 리스트 */}
                    <List
                        sx={{
                            width: '300px',
                            bgcolor: 'background.paper',
                            overflowY: 'auto',
                            borderRight: '1px solid #ccc',
                        }}
                        subheader={
                            <ListSubheader component="div">
                                <div className="flex flex-col gap-1">
                                    <span className="text-lg text-gray-800">📄 고객 번호 목록</span>
                                    <span className="text-xs text-red-500">고객번호를 선택하면 고객납부현황을 보실 수 있습니다.</span>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="고객명 또는 번호 검색"
                                        fullWidth
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        sx={{ mt: 1 }}
                                    />
                                </div>
                            </ListSubheader>
                        }
                    >
                        {filteredAcctList.map(({ acct_num, acct_name }) => (
                            <ListItem
                                key={acct_num}
                                button
                                onClick={() => handleSelectAcctNum(acct_num)}
                                selected={acct_num === selectedAcctNum}
                                sx={{ borderBottom: '1px solid #eee' }}
                                className={`${acct_num === selectedAcctNum ? 'bg-gray-200' : ''} hover:cursor-pointer`}
                            >
                                <ListItemText
                                    primary={acct_name}
                                    secondary={<span className="text-xs text-gray-500">{acct_num}</span>}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {/* 오른쪽 테이블 */}
                    <Box sx={{ flex: 1, padding: 2, overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                            <Box sx={{ display: 'flex'}}>
                                {/*{accountName} 총 미수금 이력*/}
                                <span className="text-lg"><span className="font-bold pr-1 underline">{selectedAcctName}</span> 총 미수금 이력</span>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <DatePicker
                                    label="시작 연월"
                                    views={['year', 'month']}
                                    format="YYYY MM" // 🔥 원하는 형식 지정
                                    value={startDate ? dayjs(startDate) : null}
                                    onChange={(newValue) => {
                                        if (newValue && newValue.isValid()) {
                                            handleStartDateChange(newValue.toDate());
                                        }
                                    }}
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: false, inputProps: { readOnly: true } },
                                    }}
                                />

                                <DatePicker
                                    label="종료 연월"
                                    views={['year', 'month']}
                                    format="YYYY MM"
                                    value={endDate ? dayjs(endDate) : null}
                                    onChange={(newValue) => {
                                        if (newValue && newValue.isValid()) {
                                            handleEndDateChange(newValue.toDate());
                                        }
                                    }}
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: false, inputProps: { readOnly: true } },
                                    }}
                                />
                            </Box>
                        </Box>
                        {accountPaymentHistoryLoading ? (
                            <Box className="flex justify-center items-center py-4">
                                <CircularProgress />
                            </Box>
                        ) : accountPaymentHistoryError ? (
                            <>
                                <span>다음 에러가 발생하고 있습니다.</span>
                                <p>날짜를 정확히 입력해주세요</p>
                                <p className="text-red-500">{accountPaymentHistoryError}</p>
                            </>
                        ) : accountPaymentHistoryData && selectedAcctNum ? (
                            <>
                                {/* History ProgressBar 임시 제거 */}
                                {/*<CustomProgressBar acct_num={selectedAcctNum} monthlyAcctSaveData={enhancedAccountPaymentHistoryData} totalUnpaidFee={totalUnpaidFee} confirmedFee={confirmedFee} unpaidFee={unpaidFee}/>*/}

                                <ReusableTable
                                    data={enhancedAccountPaymentHistoryData}
                                    columns={PaymentAccountTableColumns}
                                    getRowId={(row) => row.date_index}
                                    options={{
                                        ...PaymentAccountTableOptions(selectedAcctNum),
                                        onColumnFiltersChange: setColumnFilters,
                                        state: {
                                            expanded: expandedRowIds.reduce((acc, id) => {
                                                acc[id] = true;
                                                return acc;
                                            }, {}),
                                            ...columnFilters,
                                        },
                                        onExpandedChange: (expanded) => {
                                            const activeIds = Object.keys(expanded).filter((key) => expanded[key]);
                                            setExpandedRowIds(activeIds);

                                            // 새로 expand된 row만 fetch
                                            activeIds.forEach((rowId) => {
                                                if (accountPaymentHistoryDetailMap[rowId] === undefined) {
                                                    setAccountPaymentHistoryDetailMap((prev) => ({
                                                        ...prev,
                                                        [rowId]: 'LOADING',
                                                    }));

                                                    fetchAccountPaymentHistoryDetail(selectedAcctNum, rowId).then((data) => {
                                                        setAccountPaymentHistoryDetailMap((prev) => ({
                                                            ...prev,
                                                            [rowId]: data || [],
                                                        }));
                                                    });
                                                }
                                            });
                                        },
                                        enableRowSelection: false,
                                        meta: {
                                            onRowSelect: handleRowSelect,
                                        },
                                        renderDetailPanel: ({ row }) => {
                                            const rowId = row?.date_index;
                                            const detailData = accountPaymentHistoryDetailMap[rowId];

                                            return (
                                                <AccountPaymentDetailList
                                                    rowId={rowId}
                                                    expandedRowIds={expandedRowIds}
                                                    detailData={detailData}
                                                />
                                            );
                                        },
                                        //Simply adding a table title to the top-left of the top toolbar
                                        renderTopToolbarCustomActions: ({ table }) => (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={handleExportCSV}
                                                    >
                                                        Export to CSV
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={handleExportExcel}
                                                    >
                                                        Export to Excel
                                                    </Button>
                                                </>
                                            </Box>
                                        ),
                                    }}
                                />

                            </>
                        ) : (
                            <p className="text-gray-500 text-sm mt-2">고객 번호를 선택하면 상세 정보가 표시됩니다.</p>
                        )}
                    </Box>

                </Box>
            </FullScreenDialog>
        </>
    );
};

export default AccountPaymentList;
