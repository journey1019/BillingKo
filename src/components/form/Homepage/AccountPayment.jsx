import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip, List, ListItem, ListItemText, ListSubheader, CircularProgress, Box, TextField } from '@mui/material';
import { TbLayoutBottombarExpand } from "react-icons/tb";
import { formatNumber } from '@/utils/formatHelpers'; // 숫자 포맷팅 함수

import useAccountStore from '@/stores/accountStore';
import { useAcctNumNameList } from '@/selectors/useAccountSelectors.js';
import usePaymentStore from '@/stores/paymentStore.js';

import ReusableTable from '@/components/table/ReusableTable.jsx';
import FullScreenDialog from '@/components/ui/modals/FullScreenDialog';
import { PaymentAccountTableColumns } from '@/columns/PaymentAccountTableColumns.jsx';
import { PaymentAccountTableOptions } from '@/options/PaymentAccountTableOptions.jsx';

import CustomProgressBar from '@/components/ui/CustomProgressBar.jsx'


const AccountPayment = () => {
    const { fetchAccountData } = useAccountStore();
    const acctNumAliasList = useAcctNumNameList();

    const {
        fetchAccountPaymentHistoryData,
        accountPaymentData,
        accountPaymentLoading,
        accountPaymentError
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

    // 💡 필터링된 납부 집계 계산
    // ✅ 수정된 납부 합계 계산 로직
    const { totalUnpaidFee, confirmedFee, unpaidFee } = useMemo(() => {
        if (!accountPaymentData) return { totalUnpaidFee: 0, confirmedFee: 0, unpaidFee: 0 };

        // 총합 (모든 confirm_yn과 무관하게)
        const totalUnpaidFee = accountPaymentData.reduce(
            (sum, row) => sum + (Number(row.none_pay_fee) || 0), 0
        );

        // date_index 범위 필터 추출
        const dateRangeFilter = columnFilters.find(f => f.id === 'date_index');
        let filtered = [...accountPaymentData];

        if (dateRangeFilter && Array.isArray(dateRangeFilter.value)) {
            const [min, max] = dateRangeFilter.value;
            filtered = filtered.filter(row => {
                const date = row.date_index;
                return (!min || date >= min) && (!max || date <= max);
            });
        }

        // confirm_yn이 'Y' 또는 'N'인 데이터의 합
        const confirmedFee = filtered
            .filter(row => row.confirm_yn === 'Y')
            .reduce((sum, row) => sum + (Number(row.none_pay_fee) || 0), 0);

        const unpaidFee = filtered
            .filter(row => row.confirm_yn === 'N')
            .reduce((sum, row) => sum + (Number(row.none_pay_fee) || 0), 0);

        return { totalUnpaidFee, confirmedFee, unpaidFee };
    }, [accountPaymentData, columnFilters]);

    useEffect(() => {
        fetchAccountData();
    }, []);

    const handleSelectAcctNum = (acct) => {
        setSelectedAcctNum(acct);
        fetchAccountPaymentHistoryData(acct);
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
                        {accountPaymentLoading ? (
                            <Box className="flex justify-center items-center py-4">
                                <CircularProgress />
                            </Box>
                        ) : accountPaymentError ? (
                            <p className="text-red-500">{accountPaymentError}</p>
                        ) : accountPaymentData ? (
                            <>
                                <CustomProgressBar acct_num={selectedAcctNum} monthlyAcctSaveData={accountPaymentData} totalUnpaidFee={totalUnpaidFee} confirmedFee={confirmedFee} unpaidFee={unpaidFee}/>

                                {/* 💰 납부 집계 요약 */}
                                {/*<Box className="flex flex-col md:flex-row gap-4 py-2 px-2">*/}
                                {/*    <Box className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md p-3 w-full md:w-1/3">*/}
                                {/*        <div className="text-sm font-medium">💰 총 미납금</div>*/}
                                {/*        <div className="text-xl font-bold">{formatNumber(totalUnpaidFee)} 원</div>*/}
                                {/*    </Box>*/}
                                {/*    <Box className="bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-3 w-full md:w-1/3">*/}
                                {/*        <div className="text-sm font-medium">💳 납부 완료 금액</div>*/}
                                {/*        <div className="text-xl font-bold">{formatNumber(confirmedFee)} 원</div>*/}
                                {/*    </Box>*/}
                                {/*    <Box className="bg-red-50 text-red-800 border border-red-200 rounded-md p-3 w-full md:w-1/3">*/}
                                {/*        <div className="text-sm font-medium">🧾 미납 금액</div>*/}
                                {/*        <div className="text-xl font-bold">{formatNumber(unpaidFee)} 원</div>*/}
                                {/*    </Box>*/}
                                {/*</Box>*/}


                                <ReusableTable
                                    data={accountPaymentData}
                                    columns={PaymentAccountTableColumns}
                                    options={{
                                        ...PaymentAccountTableOptions(selectedAcctNum),
                                        onColumnFiltersChange: setColumnFilters,
                                        state: { columnFilters }
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

export default AccountPayment;
