import { useState, useEffect } from 'react';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchKOMonthlyAccountSaveIndexData, fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import KOMonthlyAccountTableColumns from '@/columns/KOMonthlyAccountTableColumns.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';
import { fetchInvoicePrint } from '@/service/invoiceService.js';
import InvoicePreview from '@/components/Invoice/InvoicePreview';

const KOMonthlyAccountSavePage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: invoiceBasicData, loading: invoiceBasicLoading, error:invoiceBasicError } = useApiFetch(fetchInvoicePrint); // 청구서 필요 양식
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth); // 청구서 양식에 삽입될 데이터

    const [selectedRowData, setSelectedRowData] = useState({});

    const [monthlyAcctSaveDetailData, setMonthlyAcctSaveDetailData] = useState(null);
    const [monthlyAcctSaveDetailLoading, setMonthlyAcctSaveDetailLoading] = useState(null);
    const [monthlyAcctSaveDetailError, setMonthlyAcctSaveDetailError] = useState(null);

    useEffect(() => {
        const fetchMonthlyDetail = async () => {
            if (!selectedRowData?.acct_num) return;

            setMonthlyAcctSaveDetailLoading(true);
            setMonthlyAcctSaveDetailError(null);
            try {
                const response = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, selectedRowData.acct_num);
                setMonthlyAcctSaveDetailData(response);
            } catch (error) {
                setMonthlyAcctSaveDetailError(error.message || 'Failed to fetch monthly detail');
            } finally {
                setMonthlyAcctSaveDetailLoading(false);
            }
        };

        fetchMonthlyDetail(); // `return fetchMonthlyDetail;`이 아니라 함수 실행!
    }, [selectedRowData]);

    if (invoiceBasicLoading) return <div>로딩중...</div>;
    if (invoiceBasicError) return <div>에러 발생: {invoiceBasicError.message}</div>;

    console.log('monthlyAcctSaveData : ', monthlyAcctSaveData)
    console.log('monthlyAcctSaveDetailData : ', monthlyAcctSaveDetailData)

    return(
        <div className={`grid gap-0 grid-cols-6`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="flex flex-row col-span-6 border-b pb-3 mb-2 border-gray-400 justify-between">
                <h1 className="text-2xl font-base">KO Monthly Account Data</h1>

                <InvoicePreview yearMonth={yearMonth} invoiceBasicData={invoiceBasicData} accountDetailData={monthlyAcctSaveDetailData}/>
            </div>

            <div className={`p-2 col-span-6`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">KO Monthly Account Data</h1>
                    <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                </div>

                {/* 테이블 UI */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <ReusableTable
                        data={monthlyAcctSaveData || []} // 데이터가 null이면 빈 배열로 설정
                        columns={KOMonthlyAccountTableColumns}
                        isLoading={loading}
                        error={error}
                        options={{
                            ...KOMonthlyAccountTableOptions,
                            meta: {
                                onRowSelect: (selectedRow) => {
                                    console.log('Account Monthly Table Row Selected: ', selectedRow);
                                    if (selectedRowData && selectedRow.acct_num === selectedRow.acct_num) {
                                        setSelectedRowData(null);
                                    } else {
                                        setSelectedRowData(selectedRow);
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default KOMonthlyAccountSavePage;