import { useState } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { fetchMonthlyData, saveMonthlyData } from '@/service/monthlyService.js'; // API 호출 함수
import { MonthlyTableColumns } from "@/columns/MonthlyTableColumns.jsx";
import { MonthlyTableOptions } from "@/options/MonthlyTableOptions.jsx";
import ReusableTable from "@/components/table/ReusableTable.jsx";
import MonthPicker from "@/components/time/MonthPicker.jsx";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

import { useNavigate } from 'react-router-dom';

import { FiPlus } from 'react-icons/fi';
import { FaSave } from "react-icons/fa";
import ConfirmModal from '@/components/common/ConfirmModal.jsx';

const MonthlyPage = () => {
    // 기본값: 현재 날짜 기준 한 달 전
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [selectedDate, setSelectedDate] = useState(oneMonthAgo);
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "") // YYYYMM 형식
    const navigate = useNavigate();

    // Monthly Save Button
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        setShowConfirmModal(false);  // 모달 닫기
        setSuccessMessage('');  // 이전 메시지 초기화
        setErrorMessage('');

        try {
            // 저장할 데이터 예시 (필요에 따라 확장 가능)
            const data = {
                summary: "월별 데이터 저장 요청",
                timestamp: new Date().toISOString(),
            };
            await saveMonthlyData(yearMonth, data);
            setSuccessMessage(`Data for ${yearMonth} saved successfully.`);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to save data.');
        }
    };


    // API 호출: useApiFetch를 활용
    const { data, loading, error } = useApiFetch(fetchMonthlyData, yearMonth);

    // Table Row Click
    const [selectedRow, setSelectedRow] = useState(null); // 선택된 Row의 데이터 저장

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Row 클릭 핸들러
    const handleRowClick = (row) => {
        setSelectedRow(row.original); // 클릭된 Row 데이터 저장
        const drawer = document.getElementById("drawer-body-scrolling");
        if (drawer) {
            drawer.classList.remove("hidden", "-translate-x-full");
        }
    };

    // Drawer 닫기
    const closeDrawer = () => {
        setSelectedRow(null);
        const drawer = document.getElementById("drawer-body-scrolling");
        if (drawer) {
            drawer.classList.add("hidden", "-translate-x-full");
        }
    };

    // if (loading) return <LoadingSpinner/>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="grid gap-0 grid-cols-1">
            <div className="flex flex-row justify-between col-span-1 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Monthly Data Save</h1>
                <button
                    className="flex flex-row items-center p-2 bg-blue-500 rounded-md text-white"
                    onClick={() => setShowConfirmModal(true)}
                >
                    <FaSave />
                    <span className="pl-2">SAVE</span>
                </button>
            </div>

            <div className="flex flex-row items-center justify-between mb-3">
                <h1 className="text-lg font-bold">
                    Selected Month:{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                    })}
                </h1>
                <div className="flex flex-row z-10">
                    <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                </div>
            </div>
            {loading ? <LoadingSpinner /> : (
                <ReusableTable
                    columns={MonthlyTableColumns}
                    data={data}
                    options={{
                        ...MonthlyTableOptions,
                        onRowClick: handleRowClick,
                        // onRowClick: (row) => (console.log(row.original)),
                    }}
                />
            )}

            {/* Drawer */}
            <div
                id="drawer-body-scrolling"
                className="fixed top-0 right-0 z-40 h-screen w-1/3 p-4 bg-white shadow-lg hidden transition-transform transform translate-x-full"
                role="dialog"
                tabIndex="-1"
            >
                <div className="drawer-header p-4 border-b">
                    <h3 className="drawer-title text-lg font-semibold">Row Details</h3>
                    <button
                        type="button"
                        className="btn btn-text btn-circle btn-sm absolute right-3 top-3"
                        aria-label="Close"
                        onClick={closeDrawer}
                    >
                        <span>✕</span>
                    </button>
                </div>
                <div className="drawer-body p-4">
                    {selectedRow ? (
                        <>
                            <h2 className="text-lg font-bold">Details</h2>
                            <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
                        </>
                    ) : (
                        <p>No row selected.</p>
                    )}
                </div>
                <div className="drawer-footer p-4 border-t">
                    <button type="button" className="btn btn-soft btn-secondary" onClick={closeDrawer}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary">
                        Save changes
                    </button>
                </div>
            </div>


            {/* 성공 메시지 */}
            {successMessage && (
                <p className="text-green-600 font-semibold">{successMessage}</p>
            )}
            {/* 에러 메시지 */}
            {errorMessage && (
                <p className="text-red-600 font-semibold">{errorMessage}</p>
            )}
            {/* Confirm Modal */}
            <ConfirmModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleSave}
                message={`Are you sure you want to save data for ${yearMonth}?`}
                status="save"
            />
        </div>
    );
};

export default MonthlyPage;
