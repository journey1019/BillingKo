import { useState } from "react";
import { FaSave } from 'react-icons/fa';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { saveMonthlyData } from '@/service/monthlyService.js';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Alert, Snackbar, Tooltip } from "@mui/material"; // ✅ MUI Alert 추가
import { getLastMonthYYYYMM } from '@/utils/formatHelpers.jsx';

import { hasPermission } from '@/utils/permissionUtils.js';
import CountAlertBox from '@/components/common/CountAlertBox.jsx';

const SaveButton = ({ yearMonth }) => {
    const navigate = useNavigate();
    const befoMonth = getLastMonthYYYYMM(); // 오늘날 기준에서 저번달 'YYYYMM'

    // Monthly Save Button
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
    const MySwal = withReactContent(Swal);

    const isCurrentTargetMonth = yearMonth === befoMonth;

    // User Role
    const userRole = localStorage.getItem('user_role');
    const isAuthorized = hasPermission('saveMonthly', userRole);
    const [alertBox, setAlertBox] = useState(null);


    const handleOpenConfirm = () => {
        if (!isAuthorized) { // 권한 X
            setAlertBox({
                type: 'error',
                message: '이 작업은 권한이 있는 사용자만 수행할 수 있습니다.',
            });

            return;
        }
        if (isCurrentTargetMonth) { // 권한 O
            setShowConfirmModal(true);
        }
    };


    const handleSave = async () => {
        if(!isCurrentTargetMonth) return; // 잘못된 실행 방지

        setShowConfirmModal(false);
        setAlert({ type: "", message: "" });
        setIsLoading(true); // ✅ 로딩 시작

        try {
            // console.log(`Saving data for: ${yearMonth}`);
            await saveMonthlyData(yearMonth);

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
                navigate("/ko_monthly"); // 페이지 이동
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
            <Tooltip title={isCurrentTargetMonth ? <div>단말기와 고객의 최종 매칭 내용을 확인한 후 저장해 주세요.<br />저장 후에는 수정하거나 다시 저장할 수 없습니다.</div> : '저장 및 조정은 이번 달 청구서 대상인 전월 데이터에만 가능합니다.'}>
                <button
                    onClick={handleOpenConfirm}
                    className={`flex flex-row items-center space-x-2 p-2 rounded-md text-white transition ${
                        !isCurrentTargetMonth
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                        </svg>
                    ) : (
                        <FaSave />
                    )}
                    <span>{isLoading ? 'Saving...' : 'Save Monthly'}</span>
                </button>
            </Tooltip>
            <CountAlertBox
                type={alertBox?.type}
                message={alertBox?.message}
                onClose={() => setAlertBox(null)}
            />



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
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 계산된 데이터를 저장하시겠습니까?`}
                status="save"
            />
        </>
    )
}

export default SaveButton;
