import { useState } from "react";
import { uploadDevicesFile } from "@/service/deviceService.js";
import { useNavigate } from 'react-router-dom';

const DeviceNewFile = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    // ✅ 모달 열기
    const openModal = () => {
        setSelectedFile(null); // 파일 선택 초기화
        setUploadStatus(null); // 상태 초기화
        setIsModalOpen(true);
    };

    // ✅ 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
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
            alert("업로드할 파일을 선택하세요.");
            return;
        }

        try {
            setUploadStatus("업로드 중...");
            await uploadDevicesFile([selectedFile]); // ✅ 파일 업로드 함수 호출
            setUploadStatus("업로드 성공!"); // ✅ 성공 메시지 표시
            setTimeout(() => closeModal(), 3000); // 1초 후 모달 닫기
            navigate("/devices");
        } catch (error) {
            setUploadStatus(error.message || "파일 업로드 실패"); // ✅ 오류 메시지 표시
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
                            >
                                ✖
                            </button>
                        </div>

                        {/* ✅ 파일 선택 버튼 */}
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 p-2 rounded-md"
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
                            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            파일 업로드
                        </button>

                        {/* ✅ 업로드 상태 메시지 */}
                        {uploadStatus && (
                            <p className="text-sm text-gray-600 mt-2">{uploadStatus}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceNewFile;
