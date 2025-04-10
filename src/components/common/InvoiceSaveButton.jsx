import { useState } from "react";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { FaSave } from 'react-icons/fa';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { saveInvoiceData } from '@/service/monthlyService.js';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Alert, Popover, Snackbar, Tooltip } from '@mui/material'; // ✅ MUI Alert 추가

const InvoiceSaveButton = ({ yearMonth }) => {
    const navigate = useNavigate();

    // Monthly Save Button
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
    const MySwal = withReactContent(Swal);

    const handleSave = async () => {
        setShowConfirmModal(false);
        setAlert({ type: "", message: "" });
        setIsLoading(true); // ✅ 로딩 시작

        try {
            console.log(`Saving data for: ${yearMonth}`);
            await saveInvoiceData(yearMonth);

            // ✅ 성공 알림 표시
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
                navigate("/ko_monthly_result"); // 페이지 이동
            }, 3000);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.status === 401
                ? "Unauthorized: Please log in again."
                : error.message || "Failed to save data.";

            // ✅ 실패 알림 표시
            setAlert({ type: "error", message: errorMsg });

            // ✅ SweetAlert 에러 알람
            MySwal.fire({
                title: "Error!",
                text: errorMsg,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        } finally {
            setIsLoading(false); // ✅ 로딩 종료
        }
    };

    return(
        <>
            <Tooltip title="모든 수정을 마친 후 눌러주세요">
                <button
                    onClick={() => setShowConfirmModal(true)}
                    className={`flex flex-row items-center space-x-2 p-2 rounded-md text-white transition ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"
                                  strokeLinecap="round"></path>
                        </svg>
                    ) : (
                        <FaSave />
                    )}
                    <span>{isLoading ? 'Saving...' : 'Save Invoice'}</span>
                </button>
            </Tooltip>

            {/* ✅ MUI Alert을 Snackbar로 감싸서 표시 */}
            <Snackbar
                open={Boolean(alert.message)}
                autoHideDuration={3000}
                onClose={() => setAlert({ type: "", message: "" })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={alert.type}
                    onClose={() => setAlert({ type: "", message: "" })}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            {/* Confirm Modal */}
            <ConfirmModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleSave}
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 청구서 최종 데이터를 저장하시겠습니까?`}
                status="save"
            />
        </>
    )
}

export default InvoiceSaveButton;
