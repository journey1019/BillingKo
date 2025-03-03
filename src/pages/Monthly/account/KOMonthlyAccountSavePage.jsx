import { useState, useEffect } from 'react';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchKOMonthlyAccountSaveIndexData, fetchKOMonthlyAccountSaveIndexDetailData } from '@/service/monthlyAccountService.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import KOMonthlyAccountTableColumns from '@/columns/KOMonthlyAccountTableColumns.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';
import { fetchInvoicePrint } from '@/service/invoiceService.js';
import InvoicePDFPrint from '@/components/invoice/InvoicePDFPrint.jsx';
import InvoicePDFPreview from '@/components/invoice/InvoicePDFPreview.jsx';
import { MdAttachMoney, MdMoneyOffCsred } from "react-icons/md";

const KOMonthlyAccountSavePage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: invoiceBasicData, loading: invoiceBasicLoading, error:invoiceBasicError } = useApiFetch(fetchInvoicePrint); // 청구서 필요 양식
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth); // 청구서 양식에 삽입될 데이터

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const [monthlyAcctSaveDetailData, setMonthlyAcctSaveDetailData] = useState(null);
    const [monthlyAcctSaveDetailLoading, setMonthlyAcctSaveDetailLoading] = useState(false);
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
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="flex flex-row col-span-6 border-b pb-3 mb-2 border-gray-400 justify-between items-center">
                <h1 className="text-2xl font-base">All Invoices</h1>

                <InvoicePDFPrint yearMonth={yearMonth} invoiceBasicData={invoiceBasicData}
                                 accountDetailData={monthlyAcctSaveDetailData} />
            </div>

            {/* 납부현황 */}
            <div className="flex flex-row col-span-6 pb-3 mb-2 border-gray-400 justify-between items-center">
                <div className="grid grid-cols-6 py-5 px-10 rounded-md bg-white w-full shadow-md">
                    <div className="col-span-2">
                        <span className="text-xs text-gray-500">Payment Summary</span>
                        <div className="flex flex-row space-x-4 items-center py-2">
                            <div className="p-2 rounded-full bg-blue-200 text-blue-500"><MdAttachMoney
                                className="w-5 h-5" /></div>
                            <span>$672.19</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <span className="text-xs text-gray-500">Total Outstanding Receivables</span>
                        <div className="flex flex-row space-x-4 items-center py-2">
                            <div className="p-2 rounded-full bg-red-200 text-red-500"><MdMoneyOffCsred
                                className="w-5 h-5" /></div>
                            <span>$672.19</span>
                        </div>
                    </div>
                    <div className="col-span-2 text-xs text-gray-500">평균 - 미납</div>
                </div>
            </div>

            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
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
                                        setIsExpanded(false);
                                    } else {
                                        setSelectedRowData(selectedRow);
                                        setIsExpanded(true);
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {isExpanded && selectedRowData && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-row justify-between">
                        <h1 className="text-2xl p-2">{selectedRowData.customer_name || 'Customer'}</h1>
                        <div className="flex flex-row space-x-4">
                            <span>수정</span>
                            <span>삭제</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                        {/* PDF 미리보기 추가 */}
                        <InvoicePDFPreview
                            yearMonth={yearMonth}
                            invoiceBasicData={invoiceBasicData}
                            accountDetailData={monthlyAcctSaveDetailData}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default KOMonthlyAccountSavePage;