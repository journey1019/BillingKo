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
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);
    const { data: invoiceBasicData, loading: invoiceBasicLoading, error:invoiceBasicError } = useApiFetch(fetchInvoicePrint);

    const [selectedRowData, setSelectedRowData] = useState('KO_99999');

    const [monthlyAcctSaveDetailData, setMonthlyAcctSaveDetailData] = useState(null);
    const [monthlyAcctSaveDetailLoading, setMonthlyAcctSaveDetailLoading] = useState(null);
    const [monthlyAcctSaveDetailError, setMonthlyAcctSaveDetailError] = useState(null);


    // useEffect(() => {
    //     setSelectedRowData('KO_99999');
    //     const fetchMonthlyDetails = async () => {
    //         if (!selectedRowData) return ;
    //
    //         setMonthlyAcctSaveDetailLoading(true);
    //         setMonthlyAcctSaveDetailError(null);
    //         try {
    //             const response = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, selectedRowData);
    //             setMonthlyAcctSaveDetailData(response);
    //         } catch (error) {
    //             setMonthlyAcctSaveDetailError(error.message || 'Failed to fetch monthly detail');
    //         } finally {
    //             setMonthlyAcctSaveDetailLoading(false);
    //         }
    //     }
    //     return fetchMonthlyDetails();
    // }, [selectedRowData])

    console.log("monthlyAcctSaveData: ", monthlyAcctSaveData); // 🔍 Debugging
    console.log(invoiceBasicData)
    console.log(monthlyAcctSaveDetailData)



    if (invoiceBasicLoading) return <div>로딩중...</div>;
    if (invoiceBasicError) return <div>에러 발생: {invoiceBasicError.message}</div>;

    return(
        <div className={`grid gap-0 grid-cols-6`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="flex flex-row col-span-6 border-b pb-3 mb-2 border-gray-400 justify-between">
                <h1 className="text-2xl font-base">KO Monthly Account Data</h1>

                <InvoicePreview invoiceBasicData={invoiceBasicData} />
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
                            ...KOMonthlyAccountTableOptions
                        }}
                    />
                </div>
            </div>

        </div>
    )
}

export default KOMonthlyAccountSavePage;