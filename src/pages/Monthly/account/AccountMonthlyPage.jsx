import MonthPicker from '@/components/time/MonthPicker.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import KOMonthlyAccountTableColumns from '@/columns/KOMonthlyAccountTableColumns.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchKOMonthlyAccountDetailData, fetchKOMonthlyAccountIndexData } from '@/service/monthlyAccountService.js';
import { useState, useEffect } from 'react';
import AccountMonthlyOverview from '@/components/form/AccountMonthly/AccountMonthlyOverview.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import AccountMonthlyTransaction from '@/components/form/AccountMonthly/AccountMonthlyTransaction.jsx';


/**
 * @desc: 고객별 데이터 페이지
 * */
const AccountMonthlyPage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountIndexData, yearMonth);

    const [selectedRowId, setSelectedRowId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    console.log("monthlyAcctData: ", monthlyAcctData);

    const [accountDetailData, setAccountDetailData] = useState(null);
    const [accountDetailLoading, setAccountDetailLoading] = useState(false);
    const [accountDetailError, setAccountDetailError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if(!selectedRowId?.acct_num) return;

            setAccountDetailLoading(true);
            setAccountDetailError(null);
            try {
                const response = await fetchKOMonthlyAccountDetailData(yearMonth, selectedRowId.acct_num);
                setAccountDetailData(response)
            } catch (error) {
                setAccountDetailData(error.message || 'Failed to fetch Account Monthly Detail');
            } finally {
                setAccountDetailLoading(false);
            }
        }
        fetchData();
    }, [selectedRowId]);
    console.log(accountDetailData)



    const tabs = [
        { id: 1, label: 'Overview', content: <AccountMonthlyOverview accountDetailData={accountDetailData} accountDetailLoading={accountDetailLoading} accountDetailError={accountDetailError}/>},
        { id: 2, label: 'Transaction', content: <AccountMonthlyTransaction /> },
    ];

    return(
        <>
            <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
                {/* 상단 제목 및 월 선택 */}
                <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                    <h1 className="text-2xl font-base">고객별 테이블</h1>
                </div>

                <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">All Account</h1>
                        <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                    </div>

                    {/* 테이블 UI */}
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <ReusableTable
                            data={monthlyAcctData || []} // 데이터가 null이면 빈 배열로 설정
                            exportFileName="KO_Monthly_Account_Report"
                            showExportButton={true}
                            columns={KOMonthlyAccountTableColumns}
                            isLoading={loading}
                            error={error}
                            options={{
                                ...KOMonthlyAccountTableOptions,
                                meta: {
                                    onRowSelect: (selectedRow) => {
                                        if (selectedRowId && selectedRowId.acct_num === selectedRow.acct_num) {
                                            setSelectedRowId(null);
                                            setIsExpanded(false);
                                        } else {
                                            setSelectedRowId(selectedRow);
                                            setIsExpanded(true);
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {isExpanded && selectedRowId && (
                    <div className="p-2 col-span-4">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-xl font-bold mb-4 text-gray-700">{selectedRowId.acct_num} _ {selectedRowId.account_info.acct_name}</h1>

                            {/* Buttons */}
                            {/*<div className="flex flex-row space-x-4">*/}
                            {/*    <span>수정</span>*/}
                            {/*    <span>삭제</span>*/}
                            {/*</div>*/}
                        </div>
                        <div className="flex flex-col p-4 bg-white">
                            {/*<span className="text-xl font-bold mb-4 text-gray-700">{selectedRowId.acct_num} _ {selectedRowId.account_info.acct_name}</span>*/}
                            <AccountMonthlyOverview accountDetailData={accountDetailData} accountDetailLoading={accountDetailLoading} accountDetailError={accountDetailError}/>
                        </div>
                        {/*<TabComponent tabs={tabs} />*/}
                    </div>
                )}
            </div>
        </>
    )
}

export default AccountMonthlyPage;