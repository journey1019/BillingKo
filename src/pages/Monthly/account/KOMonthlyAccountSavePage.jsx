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
import Accordion from '@/components/ui/Accordions/Accordion.jsx';
import SimpleAccordion from '@/components/ui/Accordions/SimpleAccordion.jsx';
import { IoMdClose } from 'react-icons/io';

import useKOMonthlyAccountSaveStore from '@/stores/koMonthlySaveStore.js';
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { getExportDataFromTable } from '@/utils/exportHelpers';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';

/**
 * @desc: 청구서 페이지
 * */
const KOMonthlyAccountSavePage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();

    const {
        invoiceBasicData,
        invoiceBasicLoading,
        invoiceBasicError,
        fetchInvoiceBasicData,

        monthlyAcctSaveData,
        monthlyAcctSaveLoading,
        monthlyAcctSaveError,
        fetchMonthlyAcctSaveData,

        selectedRowData,
        setSelectedRowData,
        resetSelection,
        isExpanded,
        setYearMonth,

        monthlyAcctSaveDetailData,
        monthlyAcctSaveDetailLoading,
        monthlyAcctSaveDetailError,
        fetchMonthlyAcctSaveDetailData,
    } = useKOMonthlyAccountSaveStore();

    useEffect(() => {
        if (yearMonth) setYearMonth(yearMonth);
    }, [yearMonth]);

    useEffect(() => {
        fetchInvoiceBasicData();
    }, []);

    useEffect(() => {
        if (yearMonth) fetchMonthlyAcctSaveData();
    }, [yearMonth]);

    useEffect(() => {
        if (selectedRowData?.acct_num) {
            fetchMonthlyAcctSaveDetailData(selectedRowData.acct_num);
        }
    }, [selectedRowData]);

    if (invoiceBasicLoading) return <div>로딩중...</div>;
    if (invoiceBasicError) return <div>에러 발생: {invoiceBasicError.message}</div>;

    const handleExportCSV = () => {
        const sortedData = [...monthlyAcctSaveData].sort((a, b) => {
            return a.acct_num.localeCompare(b.acct_num);
        });
        const exportData = getExportDataFromTable(KOMonthlyAccountTableColumns, sortedData);
        exportToCSV(exportData, 'Final_Bill.csv');
    };

    const handleExportExcel = () => {
        const sortedData = [...monthlyAcctSaveData].sort((a, b) => {
            return a.acct_num.localeCompare(b.acct_num);
        });
        const exportData = getExportDataFromTable(KOMonthlyAccountTableColumns, sortedData);
        exportToExcel(exportData, 'Final_Bill.xlsx');
    };

    console.log(selectedRowData)

    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="flex flex-row col-span-6 border-b pb-3 mb-2 border-gray-400 justify-between items-center">
                <h1 className="text-xl font-bold">최종 청구서 확인 및 출력 페이지</h1>

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
                <SimpleAccordion items={[{title: "결제내역 요약", content: (<PaymentSummary monthlyAcctSaveData={monthlyAcctSaveData}/>)}]} allOpen={true}/>
            </div>

            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">최종 청구서 테이블</h1>
                    <div className="flex flex-row items-center space-x-4">
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                        {/*<DataActionDropdown*/}
                        {/*    onExportCSV={() => exportToCSV(monthlyAcctSaveData, 'Final_Bill.csv')}*/}
                        {/*    onExportExcel={() => exportToExcel(monthlyAcctSaveData, 'Final_Bill.xlsx')}*/}
                        {/*    onRefresh={fetchMonthlyAcctSaveData}*/}
                        {/*/>*/}
                        <DataActionDropdown
                            onExportCSV={handleExportCSV}
                            onExportExcel={handleExportExcel}
                            onRefresh={fetchMonthlyAcctSaveData}
                        />
                    </div>
                </div>

                {/* 테이블 UI */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <ReusableTable
                        data={monthlyAcctSaveData || []} // 데이터가 null이면 빈 배열로 설정
                        columns={KOMonthlyAccountTableColumns}
                        isLoading={monthlyAcctSaveLoading}
                        error={monthlyAcctSaveError}
                        options={{
                            ...KOMonthlyAccountTableOptions(selectedRowData),
                            meta: {
                                onRowSelect: (row) => setSelectedRowData(row),
                            },
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
                                             accountDetailData={monthlyAcctSaveDetailData}
                                             monthlyAcctSaveData={monthlyAcctSaveData} />
                            <GiroPDFPrint yearMonth={yearMonth} invoiceBasicData={invoiceBasicData}
                                          accountDetailData={monthlyAcctSaveDetailData}
                                          monthlyAcctSaveData={monthlyAcctSaveData} />
                            <button
                                onClick={resetSelection}
                                className="p-2 rounded-md text-black hover:text-gray-500"
                            >
                                <IoMdClose />
                            </button>

                        </div>
                    </div>
                    <TabComponent tabs={[
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
                    ]} drag="Y"/>
                </div>
            )}
        </div>
    )
}

export default KOMonthlyAccountSavePage;