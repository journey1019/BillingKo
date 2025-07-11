import { useEffect, useState, useMemo } from "react";

import useYearMonth from '@/hooks/useYearMonth.js';
import usePaymentStore from '@/stores/paymentStore.js';

import Receivables from '@/components/construct/main/Receivables.jsx';
import EditablePaymentTable from '@/components/table/Edit/EditablePaymentTable.jsx';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BiBuildings } from "react-icons/bi";
import HomeProgressButton from '../components/common/HomeProgressButton.jsx';

const Homepage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { monthlyAcctSaveData, loading, error, fetchMonthlyAcctSaveData } = usePaymentStore();

    useEffect(() => {
        fetchMonthlyAcctSaveData(yearMonth);
    }, [yearMonth]);

    return (
        <div className="grid gap-0 grid-cols-1">
            {/** Hellow User */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                    <div className="p-2 border border-2 border-gray-400 rounded-md">
                        <BiBuildings className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="items-center text-xl font-semibold">Hello, {localStorage.getItem('user_name')}</div>
                </div>
                <HomeProgressButton />
            </div>

            {/** 현황 한눈에 보기 */}
            <div className="grid grid-cols-1">
                <Receivables
                    fetchMonthlyAcctSaveData={fetchMonthlyAcctSaveData}
                    loading={loading} error={error} monthlyAcctSaveData={monthlyAcctSaveData} yearMonth={yearMonth}
                />
            </div>

            {/** 납부 테이블 */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <EditablePaymentTable fetchMonthlyAcctSaveData={fetchMonthlyAcctSaveData}
                                      loading={loading} error={error} data={monthlyAcctSaveData} yearMonth={yearMonth}
                                      selectedDate={selectedDate} handleDateChange={handleDateChange}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Homepage;
