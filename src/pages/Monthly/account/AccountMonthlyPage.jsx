import MonthPicker from '@/components/time/MonthPicker.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import KOMonthlyAccountTableColumns from '@/columns/KOMonthlyAccountTableColumns.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchKOMonthlyAccountIndexData, fetchKOMonthlyAccountDetailData, fetchMonthlyAccountIncludeDeviceDetailData } from '@/service/monthlyAccountService.js';
import { useState, useEffect } from 'react';
import AccountMonthlyOverview from '@/components/form/AccountMonthly/AccountMonthlyOverview.jsx';
import AccountMonthlyOverviewBefo from '@/components/form/AccountMonthly/AccountMonthlyOverviewBefo.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import AccountMonthlyForm from '@/components/form/AccountMonthly/AccountMonthlyForm.jsx';
import InvoiceSaveButton from '@/components/common/InvoiceSaveButton.jsx';
import { IoMdClose } from 'react-icons/io';
import { useSearchParams } from "react-router-dom";

import useAccountMonthlyStore from '@/stores/accountMonthlyStore.js';


/**
 * @desc: 고객별 청구서 수정 페이지
 * */
const AccountMonthlyPage = () => {
    const [searchParams] = useSearchParams();
    const urlYearMonth = searchParams.get("yearMonth"); // ex) '202402'
    const urlAcct = searchParams.get("acctNum");
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth(urlYearMonth || null);
    const {
        monthlyAcctData,
        loading,
        error,
        selectedRowId,
        isExpanded,
        accountDetailData,
        accountDetailLoading,
        accountDetailError,
        fetchMonthlyAcctData,
        fetchAccountDetailData,
        selectRow,
        resetSelection
    } = useAccountMonthlyStore();

    const [columnFilters, setColumnFilters] = useState(() => {
        return urlAcct
            ? [{ id: "acct_num", value: urlAcct }]
            : [];
    });


    useEffect(() => {
        fetchMonthlyAcctData(yearMonth);
    }, [yearMonth]);

    useEffect(() => {
        if (selectedRowId) {
            fetchAccountDetailData(yearMonth, urlAcct ? urlAcct : selectedRowId.acct_num);
        }
    }, [selectedRowId, yearMonth, urlAcct]);

    return(
        <>
            <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
                {/* 상단 제목 및 월 선택 */}
                <div className="col-span-6 border-b pb-3 border-gray-400 flex flex-row justify-between items-center">
                    <h1 className="text-xl font-bold">고객별 청구서 조정 페이지</h1>
                    <InvoiceSaveButton yearMonth={yearMonth}/>
                </div>

                <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">고객 청구서 조정</h1>
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                    </div>

                    {/* 테이블 UI */}
                    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
                        <ReusableTable
                            data={monthlyAcctData || []} // 데이터가 null이면 빈 배열로 설정
                            exportFileName="KO_Monthly_Account_Report"
                            showExportButton={true}
                            columns={KOMonthlyAccountTableColumns}
                            isLoading={loading}
                            error={error}
                            options={{
                                ...KOMonthlyAccountTableOptions(selectedRowId),
                                // meta: {
                                //     onRowSelect: (selectedRow) => {
                                //         if (selectedRowId && selectedRowId.acct_num === selectedRow.acct_num) {
                                //             setSelectedRowId(null);
                                //             setIsExpanded(false);
                                //         } else {
                                //             setSelectedRowId(selectedRow);
                                //             setIsExpanded(true);
                                //         }
                                //     }
                                // }
                                meta: {
                                    onRowSelect: selectRow,
                                },
                                state: {
                                    columnFilters,
                                },
                                onColumnFiltersChange: setColumnFilters,
                            }}
                        />
                    </div>
                </div>

                {isExpanded && selectedRowId && (
                    <div className="p-2 col-span-4">
                        <div className="flex flex-row justify-between mb-6 items-center text-center">
                            <h1 className="text-xl font-bold text-gray-800 align-center text-center justify-center">{selectedRowId.acct_num} _ {selectedRowId.account_info.acct_name}</h1>

                            {/* Buttons */}
                            {/*<div className="flex flex-row space-x-4">*/}
                            {/*    <span>수정</span>*/}
                            {/*    <span>삭제</span>*/}
                            {/*</div>*/}
                            <button
                                onClick={resetSelection}
                                className="p-2 rounded-md text-black hover:text-gray-500"
                            >
                                <IoMdClose />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <AccountMonthlyForm yearMonth={yearMonth} accountDetailData={accountDetailData}
                                                accountDetailLoading={accountDetailLoading}
                                                accountDetailError={accountDetailError}
                            />
                        </div>
                        {/*<div className="flex flex-col p-4 bg-white">*/}
                        {/*    <span className="text-xl font-bold mb-4 text-gray-700">{selectedRowId.acct_num} _ {selectedRowId.account_info.acct_name}</span>*/}
                        {/*    <AccountMonthlyOverview accountDetailData={accountDetailData} accountDetailLoading={accountDetailLoading} accountDetailError={accountDetailError}/>*/}
                        {/*</div>*/}
                        {/*<div className="flex flex-col p-4 bg-white mt-10">*/}
                        {/*    <AccountMonthlyOverviewBefo accountDetailData={accountDetailData} accountDetailLoading={accountDetailLoading} accountDetailError={accountDetailError}/>*/}
                        {/*</div>*/}
                        {/*<TabComponent tabs={tabs} />*/}
                    </div>
                )}
            </div>
        </>
    )
}

export default AccountMonthlyPage;