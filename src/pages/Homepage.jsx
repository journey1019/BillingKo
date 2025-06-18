import { useEffect, useState, useMemo } from "react";
import { BiBuildings } from "react-icons/bi";
import Receivables from '@/components/construct/main/Receivables.jsx';
import HorizontalNonLinearStepper from '@/components/module/HorizontalNonLinearStepper.jsx';
import PaymentStatus from '@/components/construct/main/PaymentStatus.jsx';
import NonPaymentStatus from '@/components/construct/main/NonPaymentStatus.jsx';

import useApiFetch from '@/hooks/useApiFetch.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import Stock from '@/components/construct/main/Stock.jsx';
import Sales from '@/components/construct/main/Sales.jsx';

import usePaymentStore from '@/stores/paymentStore.js';
import InlineEditableTable from '@/components/construct/main/InlineEditableTable.jsx';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditablePaymentTable from '@/components/table/Edit/EditablePaymentTable.jsx';


const Homepage = () => {
    // ✅ 공통으로 사용할 상태 (yearMonth & monthlyAcctSaveData)
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();

    const { monthlyAcctSaveData, loading, error, fetchMonthlyAcctSaveData } = usePaymentStore();

    useEffect(() => {
        fetchMonthlyAcctSaveData(yearMonth);
    }, [yearMonth]);

    const user_name = localStorage.getItem("user_name");
    const token = localStorage.getItem("token");
    // console.log(token);

    console.log(monthlyAcctSaveData)
    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                <div className="p-2 border border-2 border-gray-400 rounded-md">
                    <BiBuildings className="w-6 h-6 text-gray-600"/>
                </div>
                <div className="items-center text-xl font-semibold">Hello, {user_name}</div>
            </div>


            <div className="grid gap-4 grid-cols-2">
                <Receivables
                    fetchMonthlyAcctSaveData={fetchMonthlyAcctSaveData}
                    loading={loading} error={error} monthlyAcctSaveData={monthlyAcctSaveData} yearMonth={yearMonth}
                />

                {/*<div className="grid gap-2 grid-cols-3">*/}
                {/*    <div className="col-span-2">*/}
                {/*        <Sales />*/}
                {/*    </div>*/}
                {/*    <div className="col-span-1">*/}
                {/*        <Stock />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>


            {/*<NonPaymentStatus*/}
            {/*    selectedDate={selectedDate}*/}
            {/*    handleDateChange={handleDateChange}*/}
            {/*    yearMonth={yearMonth}*/}
            {/*    monthlyAcctSaveData={monthlyAcctSaveData}*/}
            {/*/>*/}

            {/** 납부 테이블 */}
            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
            {/*    <InlineEditableTable*/}
            {/*        selectedDate={selectedDate}*/}
            {/*        handleDateChange={handleDateChange}*/}
            {/*        yearMonth={yearMonth}*/}
            {/*        monthlyAcctSaveData={monthlyAcctSaveData}*/}
            {/*        loading={loading}*/}
            {/*        error={error}*/}
            {/*    />*/}
            {/*</LocalizationProvider>*/}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <EditablePaymentTable fetchMonthlyAcctSaveData={fetchMonthlyAcctSaveData}
                                      loading={loading} error={error} data={monthlyAcctSaveData} yearMonth={yearMonth}
                                      selectedDate={selectedDate} handleDateChange={handleDateChange}
                />
            </LocalizationProvider>


            {/* Left - Right 영역 구분 */}
            {/*<PaymentStatus*/}
            {/*    selectedDate={selectedDate}*/}
            {/*    handleDateChange={handleDateChange}*/}
            {/*    yearMonth={yearMonth}*/}
            {/*    monthlyAcctSaveData={monthlyAcctSaveData}*/}
            {/*    loading={loading}*/}
            {/*    error={error}*/}
            {/*/>*/}

            {/*<div className="flex flex-row w-1/2">*/}
            {/*    <HorizontalNonLinearStepper/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Homepage;
