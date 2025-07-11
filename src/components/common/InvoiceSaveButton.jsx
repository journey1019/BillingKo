import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { saveInvoiceData, deleteAccountInvoice } from '@/service/monthlyService.js';
import { hasPermission } from '@/utils/permissionUtils.js';

import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import CountAlertBox from '@/components/common/CountAlertBox.jsx';

import { Alert, Popover, Snackbar, Tooltip } from '@mui/material'; // ✅ MUI Alert 추가
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSave } from 'react-icons/fa';


const InvoiceSaveButton = ({ yearMonth, monthlyAcctSaveData= [] }) => {
    const navigate = useNavigate();

    // Monthly Save Button
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
    const MySwal = withReactContent(Swal);

    const [alertBox, setAlertBox] = useState(null);
    const userRole = localStorage.getItem("user_role");
    const isAuthorized = hasPermission("accountInvoice", userRole);

    const handleSave = async () => {
        setShowConfirmModal(false);
        setAlert({ type: "", message: "" });
        setIsLoading(true); // ✅ 로딩 시작

        try {
            // console.log(`Saving data for: ${yearMonth}`);
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

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        setAlert({ type: "", message: "" });
        setIsLoading(true);

        try {
            await deleteAccountInvoice(yearMonth);
            setAlert({ type: "success", message: `Data for ${yearMonth} deleted successfully.` });
            MySwal.fire({ title: "Deleted!", text: `Data for ${yearMonth} deleted successfully.`, icon: "success", timer: 2000, showConfirmButton: false });
            window.location.href = `/ko_monthly_account?yearMonth=${yearMonth}`
            // setTimeout(() => navigate("/ko_monthly_result"), 3000); //여기여기여기
        } catch (error) {
            const errorMsg = error.response?.status === 401 ? "Unauthorized: Please log in again." : error.message || "Failed to delete data.";
            setAlert({ type: "error", message: errorMsg });
            MySwal.fire({ title: "Error!", text: errorMsg, icon: "error", timer: 3000, showConfirmButton: false });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveModal = () => {
        if (!isAuthorized) {
            setAlertBox({
                type: "error",
                message: "이 작업은 권한이 있는 사용자만 접근할 수 있습니다.",
            });
            return;
        }

        setShowConfirmModal(true)
    }
    const handleDeleteModal = () => {
        if (!isAuthorized) {
            setAlertBox({
                type: "error",
                message: "이 작업은 권한이 있는 사용자만 접근할 수 있습니다.",
            });
            return;
        }

        setShowDeleteConfirm(true)
    }

    return(
        <div className="flex flex-row space-x-2">
            <CountAlertBox
                type={alertBox?.type}
                message={alertBox?.message}
                onClose={() => setAlertBox(null)}
            />

            <Tooltip title="모든 수정을 마친 후 눌러주세요">
                <button
                    onClick={handleSaveModal}
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


            {/* Delete Button */}
            <Tooltip title="청구 데이터 삭제 (저장된 최종 청구서 데이터 있을 때 삭제 가능">
                <button onClick={handleDeleteModal} className={`flex flex-row items-center space-x-2 p-2 rounded-md text-white transition ${!monthlyAcctSaveData?.length || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`} disabled={!monthlyAcctSaveData?.length || isLoading}>
                    {isLoading ?
                        <svg className="w-5 h-5 animate-spin mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"
                                  strokeLinecap="round"></path>
                        </svg>
                        : <span>Delete Invoice</span>}
                </button>
            </Tooltip>

            {/* Alert */}
            <Snackbar open={Boolean(alert.message)} autoHideDuration={3000}
                      onClose={() => setAlert({ type: '', message: '' })}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })}>
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

            {/* Delete Confirm */}
            <ConfirmModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 청구서 데이터를 삭제하시겠습니까?`}
                status="delete"
            />
        </div>
    )
}

export default InvoiceSaveButton;
