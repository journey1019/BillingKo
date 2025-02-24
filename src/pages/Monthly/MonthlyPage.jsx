import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { fetchMonthlyData, saveMonthlyData, fetchMonthlyDetailData } from '@/service/monthlyService.js'; // API 호출 함수
import { MonthlyTableColumns } from "@/columns/MonthlyTableColumns.jsx";
import { MonthlyTableOptions } from "@/options/MonthlyTableOptions.jsx";
import ReusableTable from "@/components/table/ReusableTable.jsx";
import MonthPicker from "@/components/time/MonthPicker.jsx";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

import { useNavigate } from 'react-router-dom';

import { FaSave } from "react-icons/fa";
import ConfirmModal from '@/components/common/ConfirmModal.jsx';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useYearMonth from '@/hooks/useYearMonth.js';
import KOMonthlyForm from '@/components/form/Monthly/KOMonthlyForm.jsx';
import MonthlyForm from '@/components/form/Monthly/MonthlyForm.jsx';

const MonthlyPage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const navigate = useNavigate();

    // Monthly Save Button
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 알람 메시지 상태
    const [alert, setAlert] = useState({ type: "", message: "" });

    const MySwal = withReactContent(Swal);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    const handleSave = async () => {
        setShowConfirmModal(false);
        setSuccessMessage('');
        setErrorMessage('');
        setAlert({ type: "", message: "" });
        setIsLoading(true); // ✅ 로딩 시작

        try {
            console.log(`Saving data for: ${yearMonth}`);
            await saveMonthlyData(yearMonth);
            setSuccessMessage(`Data for ${yearMonth} saved successfully.`);
            // 성공 시 Success 알람 표시 및 2초 후 페이지 이동
            setAlert({ type: "success", message: `Data for ${yearMonth} saved successfully.` });

            // ✅ SweetAlert 성공 알람
            MySwal.fire({
                title: "Success!",
                text: `Data for ${yearMonth} saved successfully.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate("/ko_monthly"); // 페이지 이동
            }, 3000);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.status === 401
                ? "Unauthorized: Please log in again."
                : error.message || "Failed to save data.";

            // 실패 시 Error 알람 표시
            setAlert({ type: "error", message: errorMsg });

            // ✅ SweetAlert 에러 알람
            MySwal.fire({
                title: "Error!",
                text: errorMsg,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });

            setErrorMessage("Unauthorized: Please log in again.");
            // setErrorMessage(error.message || 'Failed to save data.');
        }
    };


    // API 호출: useApiFetch를 활용
    const { data, loading, error } = useApiFetch(fetchMonthlyData, yearMonth);

    // Table Row Click
    const [selectedRowData, setSelectedRowData] = useState(null); // 선택된 Row의 데이터 저장
    const [isExpanded, setIsExpanded] = useState(false);

    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);


    console.log(yearMonth)
    useEffect(() => {
        const fetchMonthlyDetail = async () => {
            if(!selectedRowData) return;

            console.log(selectedRowData)
            setDetailLoading(true);
            setDetailError(null);
            try{
                const response = await fetchMonthlyDetailData(yearMonth, selectedRowData.serial_number);
                setDetailData(response);
            } catch (error) {
                setDetailError(error.message || "Failed to fetch detail data");
            } finally {
                setDetailLoading(false);
            }
        }

        fetchMonthlyDetail();
    }, [selectedRowData]);
    console.log('detail monthly data', detailData)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                isExpanded &&
                !event.target.closest(".expanded-container") // ✅ 상세정보 영역 클릭 제외
            ) {
                setIsExpanded(false);
                setSelectedRowData(null);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isExpanded]);


    console.log('monthly data: ', data)
    console.log(isExpanded)
    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            {/* Save */}
            <div className="col-span-6 flex flex-row justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Monthly Data Save</h1>
                <button
                    className="flex flex-row items-center p-2 bg-blue-500 rounded-md text-white"
                    onClick={() => setShowConfirmModal(true)}
                >
                    {isLoading ? <LoadingSpinner /> : <FaSave />}
                    <span className="pl-2">{isLoading ? 'Saving...' : 'SAVE'}</span>
                </button>
            </div>

            {/* 알람 메시지 표시 */}
            {alert.message && (
                <div
                    className={`flex items-center p-4 mb-4 text-sm rounded-lg ${alert.type === "success" ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400" : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400"}`}
                    role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        <span
                            className="font-medium">{alert.type === "success" ? "Success alert!" : "Danger alert!"}</span> {alert.message}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={`${isExpanded ? "col-span-2" : "col-span-6"}`}>
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
                <ReusableTable
                    columns={MonthlyTableColumns}
                    data={data || []}
                    options={{
                        ...MonthlyTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                if (selectedRowData && selectedRowData.serial_number === selectedRow.serial_number) {
                                    // ✅ 이미 선택된 Row를 다시 클릭하면 닫기
                                    setIsExpanded(false);
                                    setSelectedRowData(null);
                                } else {
                                    // ✅ 새 Row를 선택하면 열기
                                    setSelectedRowData(selectedRow);
                                    setIsExpanded(true);
                                }
                            }
                        }
                    }}
                    isLoading={detailLoading}
                    error={detailError}
                />
            </div>

            {isExpanded && selectedRowData && (
                <div className="p-2 col-span-4 expanded-container">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <span className="text-black font-semibold pr-3">Data Index:</span>
                                <h2 className="py-1 text-lg font-bold text-red-600">{selectedRowData.dataIndex}</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSelectedRowData(null);
                                }}
                                className="p-2 bg-red-500 text-white rounded-md"
                            >
                                닫기
                            </button>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <pre className="text-sm text-gray-700">{JSON.stringify(selectedRowData, null, 2)}</pre>
                            {detailLoading ? (
                                <LoadingSpinner/>
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailError}</p>
                            ) : (
                                <MonthlyForm
                                    detailData={detailData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 계산된 데이터를 저장하시겠습니까?`}
                status="save"
            />
        </div>
    );
};

export default MonthlyPage;
