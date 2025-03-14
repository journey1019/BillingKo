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
import GiroPDFPrint from '@/components/giro/GiroPDFPrint.jsx';
import GiroPDFPreview from '@/components/giro/GiroPDFPreview.jsx';
import TabComponent from '@/components/layout/TabComponent.jsx';
import PaymentSummary from '@/components/construct/monthly/PaymentSummary.jsx';
import InvoicePDFMergedDownload from '@/components/invoice/InvoicePDFMergedDownload.jsx';
import GiroPDFMergedDownload from '@/components/giro/GiroPDFMergedDownload.jsx';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import InvoicePDFMergedPrintDirect from '@/components/invoice/InvoicePDFMergedPrintDirect.jsx';
import GiroPDFMergedPrintDirect from '@/components/giro/GiroPDFMergedPrintDirect.jsx';


/**
 * @desc: 청구서 페이지
 * */
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

    const tabs = [
        { id: 1, label: 'Invoice PDF', content: <InvoicePDFPreview
                yearMonth={yearMonth}
                invoiceBasicData={invoiceBasicData}
                accountDetailData={monthlyAcctSaveDetailData}
            />},
        { id: 2, label: 'Giro PDF', content: <GiroPDFPreview
                yearMonth={yearMonth}
                invoiceBasicData={invoiceBasicData}
                accountDetailData={monthlyAcctSaveDetailData}
            />
        },
    ];
    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="flex flex-row col-span-6 border-b pb-3 mb-2 border-gray-400 justify-between items-center">
                <h1 className="text-xl font-bold">결제내역 요약</h1>

                <div className="flex flex-row space-x-4">
                    <InvoicePDFMergedPrintDirect
                        yearMonth={yearMonth}
                        invoiceBasicData={invoiceBasicData}
                        monthlyAcctSaveData={monthlyAcctSaveData}
                    />
                    <GiroPDFMergedPrintDirect
                        yearMonth={yearMonth}
                        invoiceBasicData={invoiceBasicData}
                        monthlyAcctSaveData={monthlyAcctSaveData}
                    />
                    {/*<InvoicePDFMergedDownload*/}
                    {/*    yearMonth={yearMonth}*/}
                    {/*    invoiceBasicData={invoiceBasicData}*/}
                    {/*    monthlyAcctSaveData={monthlyAcctSaveData}*/}
                    {/*/>*/}
                    {/*<GiroPDFMergedDownload*/}
                    {/*    yearMonth={yearMonth}*/}
                    {/*    invoiceBasicData={invoiceBasicData}*/}
                    {/*    monthlyAcctSaveData={monthlyAcctSaveData}*/}
                    {/*/>*/}
                </div>
            </div>

            {/* 납부현황 */}
            <div className="flex flex-row col-span-6 pb-3 mb-2 border-gray-400 justify-between items-center">
                <PaymentSummary monthlyAcctSaveData={monthlyAcctSaveData}/>
            </div>

            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">최종 청구서 테이블</h1>
                    <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
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
                                    if (selectedRowData && selectedRowData.acct_num === selectedRow.acct_num) {
                                        // ✅ 같은 Row를 클릭한 경우 isExpanded를 false로 변경하여 닫기
                                        setSelectedRowData(null);
                                        setIsExpanded(false);
                                    } else {
                                        // ✅ 다른 Row를 클릭한 경우 isExpanded 유지
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
                    <div className="flex flex-row mb-4 justify-between items-center">
                        <h1 className="text-xl font-bold">{selectedRowData.acct_num}</h1>
                        <div className="flex flex-row space-x-4">
                            <InvoicePDFPrint yearMonth={yearMonth} invoiceBasicData={invoiceBasicData}
                                             accountDetailData={monthlyAcctSaveDetailData} monthlyAcctSaveData={monthlyAcctSaveData} />
                            <GiroPDFPrint yearMonth={yearMonth} invoiceBasicData={invoiceBasicData}
                                          accountDetailData={monthlyAcctSaveDetailData} monthlyAcctSaveData={monthlyAcctSaveData} />
                        </div>
                    </div>
                    <TabComponent tabs={tabs} />
                </div>
            )}
        </div>
    )
}

export default KOMonthlyAccountSavePage;