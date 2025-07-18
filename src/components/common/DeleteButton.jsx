import { useState, useEffect } from "react";
import { useStepperStore } from "@/stores/stepperStore";
import { delKOMonthlyData } from '@/service/monthlyService.js';
import { MdDelete } from "react-icons/md";
import useKOMonthlyStore from '@/stores/koMonthlyStore.js';

import { Alert, Snackbar, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { hasPermission } from '@/utils/permissionUtils.js';
import CountAlertBox from '@/components/common/CountAlertBox.jsx';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { getCurrentYearMonth } from '@/utils/dateUtils.js';

const DeleteButton = ({ yearMonth }) => {
    // 저장한 Monthly 데이터
    const { koMonthlyData, fetchKOMonthlyData } = useKOMonthlyStore();
    useEffect(() => {
        fetchKOMonthlyData(yearMonth);
    }, [yearMonth]);
    const currentYearMonth = getCurrentYearMonth();

    // Navbar Step Data
    const stepMap = useStepperStore((state) => state.stepMap);
    const deviceInvoiceStep = stepMap.device; // Y or N

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
    const MySwal = withReactContent(Swal);

    // 무조건 이번달만 가능하도록?
    const isCurrentTargetMonth = !!yearMonth
        && Array.isArray(koMonthlyData)
        && koMonthlyData.length > 0
        && deviceInvoiceStep !== 'Y';



    // User Role
    const userRole = localStorage.getItem('user_role');
    const isAuthorized = hasPermission('deleteMonthly', userRole);
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

    const handleDelete = async () => {
        if(!isCurrentTargetMonth) return; // 잘못된 실행 방지

        setShowConfirmModal(false);
        setAlert({ type: "", message: "" });
        setIsLoading(true); // ✅ 로딩 시작

        try {
            await delKOMonthlyData(yearMonth);

            // ✅ 성공 알림 표시
            setAlert({ type: "success", message: `Data for ${yearMonth} saved successfully.` });

            // ✅ SweetAlert 성공 알람
            MySwal.fire({
                title: "Success!",
                text: `Data for ${yearMonth} deleted successfully.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
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
            <Tooltip title={isCurrentTargetMonth ? <div>단말기와 고객의 최종 매칭 내용을 확인한 후 저장해 주세요.<br />저장 후에는 수정하거나 다시 저장할 수 없습니다.</div> : '진행 상태에서 "단말별 청구서"가 완료된 경우, 삭제할 수 없습니다.'}>
                <button
                    onClick={handleOpenConfirm}
                    className={`flex flex-row items-center space-x-2 p-2 rounded-md text-white transition ${
                        !isCurrentTargetMonth
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"
                                  strokeLinecap="round"></path>
                        </svg>
                    ) : (
                        <MdDelete />
                    )}
                    <span>{isLoading ? 'Delete...' : 'Delete Monthly'}</span>
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
                onConfirm={handleDelete}
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 계산된 데이터를 삭제하시겠습니까?`}
                status="delete"
            />
        </>
    )
}

export default DeleteButton;