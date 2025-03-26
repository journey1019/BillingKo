import { useState } from "react";
import { uploadDevicesFile } from "@/service/deviceService.js";
import { useNavigate } from "react-router-dom";

const DeviceNewFile = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [alertType, setAlertType] = useState(""); // ✅ 성공 또는 실패 유형 저장
    const [isUploading, setIsUploading] = useState(false); // ✅ 업로드 중 상태

    // ✅ 모달 열기
    const openModal = () => {
        setSelectedFile(null);
        setUploadStatus(null);
        setAlertType("");
        setIsModalOpen(true);
    };

    // ✅ 모달 닫기
    const closeModal = () => {
        if (!isUploading) { // 업로드 중이 아닐 때만 닫기 허용
            setIsModalOpen(false);
        }
    };

    // ✅ 파일 선택 핸들러
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // ✅ 파일 업로드 핸들러
    const handleUpload = async () => {
        if (!selectedFile) {
            setAlertType("error");
            setUploadStatus("업로드할 파일을 선택하세요.");
            return;
        }

        setIsUploading(true); // ✅ 업로드 시작
        setUploadStatus("업로드 중...");
        setAlertType("");

        try {
            await uploadDevicesFile([selectedFile]); // ✅ 파일 업로드 API 호출
            setUploadStatus("업로드 성공!");
            setAlertType("success");

            // ✅ 모달을 닫고 "/devices"로 이동
            setTimeout(() => {
                setIsModalOpen(false);
                navigate("/devices");
            }, 1500);
        } catch (error) {
            setAlertType("error");
            setUploadStatus(error.message || "파일 업로드 실패");
        } finally {
            setIsUploading(false); // ✅ 업로드 완료 후 버튼 다시 활성화
        }
    };

    return (
        <div>
            {/* ✅ 파일 업로드 버튼 (모달 열기) */}
            <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                File Upload
            </button>

            {/* ✅ 모달 (isModalOpen 상태에 따라 표시) */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        {/* ✅ 모달 헤더 */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">파일 업로드</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={isUploading} // ✅ 업로드 중일 때 닫기 방지
                            >
                                ✖
                            </button>
                        </div>

                        <div className="pb-2">
                            <span className="text-sm text-gray-500">CSV 파일로 단말기 정보들을 추가할 수 있습니다.</span>
                        </div>

                        {/* ✅ Alert 메시지 */}
                        {uploadStatus && (
                            <div
                                className={`flex items-center p-4 mb-4 text-sm rounded-lg 
                                    ${alertType === "success"
                                    ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
                                    : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400"
                                }`
                                }
                                role="alert"
                            >
                                <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <span className="sr-only">Info</span>
                                <div>
                                    <span className="font-medium">{alertType === "success" ? "업로드 성공!" : "업로드 실패!"}</span> {uploadStatus}
                                </div>
                            </div>
                        )}

                        {/* ✅ 파일 선택 버튼 */}
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
                            disabled={isUploading} // ✅ 업로드 중 파일 선택 방지
                        />

                        {/* ✅ 선택된 파일명 표시 */}
                        {selectedFile && (
                            <p className="text-sm text-gray-600 mt-2">
                                선택된 파일: {selectedFile.name}
                            </p>
                        )}

                        {/* ✅ 업로드 버튼 */}
                        <button
                            onClick={handleUpload}
                            className={`mt-4 w-full px-4 py-2 rounded-md 
                                ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`
                            }
                            disabled={isUploading} // ✅ 업로드 중 버튼 비활성화
                        >
                            {isUploading ? "업로드 중..." : "파일 업로드"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceNewFile;
