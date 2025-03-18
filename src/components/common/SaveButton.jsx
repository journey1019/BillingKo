// import { useState } from "react";
// import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
// import { FaSave } from 'react-icons/fa';
// import ConfirmModal from '@/components/common/ConfirmModal.jsx';
// import { saveMonthlyData } from '@/service/monthlyService.js';
// import { useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
//
// const SaveButton = ({ yearMonth }) => {
//     const navigate = useNavigate();
//
//     // Monthly Save Button
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//
//     // 알람 메시지 상태
//     const [alert, setAlert] = useState({ type: "", message: "" });
//
//     const MySwal = withReactContent(Swal);
//     const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
//
//     const handleSave = async () => {
//         setShowConfirmModal(false);
//         setSuccessMessage('');
//         setErrorMessage('');
//         setAlert({ type: "", message: "" });
//         setIsLoading(true); // ✅ 로딩 시작
//
//         try {
//             console.log(`Saving data for: ${yearMonth}`);
//             await saveMonthlyData(yearMonth);
//             setSuccessMessage(`Data for ${yearMonth} saved successfully.`);
//             // 성공 시 Success 알람 표시 및 2초 후 페이지 이동
//             setAlert({ type: "success", message: `Data for ${yearMonth} saved successfully.` });
//
//             // ✅ SweetAlert 성공 알람
//             MySwal.fire({
//                 title: "Success!",
//                 text: `Data for ${yearMonth} saved successfully.`,
//                 icon: "success",
//                 timer: 2000,
//                 showConfirmButton: false,
//             });
//
//             setTimeout(() => {
//                 navigate("/ko_monthly"); // 페이지 이동
//             }, 3000);
//         } catch (error) {
//             console.error(error);
//             const errorMsg = error.response?.status === 401
//                 ? "Unauthorized: Please log in again."
//                 : error.message || "Failed to save data.";
//
//             // 실패 시 Error 알람 표시
//             setAlert({ type: "error", message: errorMsg });
//
//             // ✅ SweetAlert 에러 알람
//             MySwal.fire({
//                 title: "Error!",
//                 text: errorMsg,
//                 icon: "error",
//                 timer: 3000,
//                 showConfirmButton: false,
//             });
//
//             setErrorMessage("Unauthorized: Please log in again.");
//             // setErrorMessage(error.message || 'Failed to save data.');
//         }
//     };
//
//     return(
//         <>
//             <button
//                 className="flex flex-row items-center p-2 bg-blue-500 rounded-md text-white"
//                 onClick={() => setShowConfirmModal(true)}
//             >
//                 {isLoading ? <LoadingSpinner /> : <FaSave />}
//                 <span className="pl-2">{isLoading ? 'Saving...' : 'SAVE'}</span>
//             </button>
//             {/* 알람 메시지 표시 */}
//             {alert.message && (
//                 <div
//                     className={`flex items-center p-4 mb-4 text-sm rounded-lg ${alert.type === "success" ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400" : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400"}`}
//                     role="alert">
//                     <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
//                          fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                             d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
//                     </svg>
//                     <span className="sr-only">Info</span>
//                     <div>
//                         <span
//                             className="font-medium">{alert.type === "success" ? "Success alert!" : "Danger alert!"}</span> {alert.message}
//                     </div>
//                 </div>
//             )}
//
//
//             {/* 성공 메시지 */}
//             {successMessage && (
//                 <p className="text-green-600 font-semibold">{successMessage}</p>
//             )}
//             {/* 에러 메시지 */}
//             {errorMessage && (
//                 <p className="text-red-600 font-semibold">{errorMessage}</p>
//             )}
//             {/* Confirm Modal */}
//             <ConfirmModal
//                 show={showConfirmModal}
//                 onClose={() => setShowConfirmModal(false)}
//                 onConfirm={handleSave}
//                 message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 계산된 데이터를 저장하시겠습니까?`}
//                 status="save"
//             />
//         </>
//     )
// }
//
// export default SaveButton;

import { useState } from "react";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { FaSave } from 'react-icons/fa';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { saveMonthlyData } from '@/service/monthlyService.js';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Alert, Snackbar, Tooltip } from "@mui/material"; // ✅ MUI Alert 추가

const SaveButton = ({ yearMonth }) => {
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
            <Tooltip title="단말기-고객 최종 매칭 데이터를 확인 후 저장버튼을 눌러주세요">
                <button
                    className="flex flex-row items-center p-2 bg-blue-500 rounded-md text-white"
                    onClick={() => setShowConfirmModal(true)}
                >
                    {isLoading ? <LoadingSpinner /> : <FaSave />}
                    <span className="pl-2">{isLoading ? 'Saving...' : 'SAVE'}</span>
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
                message={`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월 계산된 데이터를 저장하시겠습니까?`}
                status="save"
            />
        </>
    )
}

export default SaveButton;
