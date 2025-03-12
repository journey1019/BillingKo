import { BiBuildings } from "react-icons/bi";
import Move from '@/components/construct/main/Move.jsx';
import Receivables from '@/components/construct/main/Receivables.jsx';
import HorizontalNonLinearStepper from '@/components/module/HorizontalNonLinearStepper.jsx';
import PaymentStatus from '@/components/construct/main/PaymentStatus.jsx';
import NonPaymentStatus from '@/components/construct/main/NonPaymentStatus.jsx';

import useApiFetch from '@/hooks/useApiFetch.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import Stock from '@/components/construct/main/Stock.jsx';
import Sales from '@/components/construct/main/Sales.jsx';

const Homepage = () => {
    const user_name = localStorage.getItem("user_name");
    console.log(localStorage.getItem("token"))

    // ✅ 공통으로 사용할 상태 (yearMonth & monthlyAcctSaveData)
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);

    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row space-x-4 px-2 py-4 items-center">
                <div className="p-2 border border-2 border-gray-400 rounded-md">
                    <BiBuildings className="w-6 h-6 text-gray-600"/>
                </div>
                <div className="items-center text-xl font-semibold">Hello, {user_name}</div>
            </div>


            {/*<Move />*/}

            <div className="grid gap-4 grid-cols-2">
                <Receivables
                    yearMonth={yearMonth}
                    monthlyAcctSaveData={monthlyAcctSaveData}
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
            {/*    loading={loading}*/}
            {/*    error={error}*/}
            {/*/>*/}


            <PaymentStatus
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                yearMonth={yearMonth}
                monthlyAcctSaveData={monthlyAcctSaveData}
                loading={loading}
                error={error}
            />

            {/*<div className="flex flex-row w-1/2">*/}
            {/*    <HorizontalNonLinearStepper/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Homepage;
