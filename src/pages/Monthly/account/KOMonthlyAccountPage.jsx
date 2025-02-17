import { useState } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { fetchKOMonthlyAccountIndexData } from "@/service/monthlyAccountService.js";
import useYearMonth from "@/hooks/useYearMonth.js";
import MonthPicker from "@/components/time/MonthPicker.jsx";
import ReusableTable from "@/components/table/ReusableTable.jsx";
import KOMonthlyAccountTableColumns from "@/columns/KOMonthlyAccountTableColumns.jsx";
import { formatNumber } from '@/utils/formatHelpers.jsx';
import { KOMonthlyAccountTableOptions } from '@/options/KOMonthlyAccountTableOptions.jsx';

const KOMonthlyAccountPage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountIndexData, yearMonth);

    console.log("monthlyAcctData: ", monthlyAcctData); // 🔍 Debugging


    return (
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
                        data={monthlyAcctData || []} // 데이터가 null이면 빈 배열로 설정
                        exportFileName="KO_Monthly_Account_Report"
                        showExportButton={true}
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
    );
};

export default KOMonthlyAccountPage;
