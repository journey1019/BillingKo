import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchKOMonthlyAccountSaveIndexData } from '@/service/monthlyAccountService.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import KOMonthlyAccountTableColumns from '@/columns/KOMonthlyAccountTableColumns.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';
import InvoicePDFGenerator from '@/components/InvoicePDFGenerator.jsx';
import { fetchInvoicePrint } from '@/service/invoiceService.js';


const KOMonthlyAccountSavePage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);
    const { data: invoiceBasicData, loading: invoiceBasicLoading, error:invoiceBasicError } = useApiFetch(fetchInvoicePrint);

    console.log(invoiceBasicData)

    console.log("monthlyAcctSaveData: ", monthlyAcctSaveData); // 🔍 Debugging


    return(
        <div className={`grid gap-0 grid-cols-6`}>
            {/* 상단 제목 및 월 선택 */}
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">KO Monthly Account Data</h1>
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

            {invoiceBasicData && !invoiceBasicLoading && !invoiceBasicError && (
                <InvoicePDFGenerator invoiceBasicData={invoiceBasicData} />
            )}

        </div>
    )
}

export default KOMonthlyAccountSavePage;