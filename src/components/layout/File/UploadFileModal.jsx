import { useState } from 'react';
import Modal from '@/components/common/Modal.jsx';
import { uploadCdrFiles } from '@/service/fileService.js';
import { FiPlus } from 'react-icons/fi';


const UploadFileModal = () => {
    // Modal 핸들러
    const [showModal, setShowModal] = useState(false);

    const [files, setFiles] = useState([]);
    const [uploadStatuses, setUploadStatuses] = useState([]); // 각 파일의 업로드 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const handleFileChange = (e) => {
        setFiles(e.target.files);
        setUploadStatuses([]); // 이전 업로드 상태 초기화
    };


    const handleFileUpload = async () => {
        if (files.length === 0) {
            alert('업로드할 파일을 선택하세요.');
            return;
        }

        setIsLoading(true) // 로딩 시작
        const statuses = [];
        for (const file of files) {
            try {
                await uploadCdrFiles([file]);
                console.log(statuses)
                statuses.push({ fileName: file.name, status: 'success', message: '업로드 성공' });
            } catch (error) {
                console.log(statuses)
                console.log(error)
                statuses.push({ fileName: file.name, status: 'error', message: error.message });
            }
        }
        setUploadStatuses(statuses);
        setIsLoading(false); // 로딩 종료
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-white text-sm text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-600 transition mr-4"
            >
                <FiPlus /> <span className="pl-1">File Uploads</span>
            </button>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h1 className="text-xl font-bold mb-4 pb-5 border-b">CDR & Network Report File Upload</h1>
                <p className="pb-4 font-semibold">CDR, NetworkReport 파일을 한 번에 업로드합니다.</p>

                {/* 여러 파일 선택 */}
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 p-2 border rounded-md"
                    accept=".csv,.cdr"  // 파일 형식 제한
                />

                {/* 업로드 버튼 */}
                <button
                    onClick={handleFileUpload}
                    className={`flex flex-row items-center space-x-2 p-2 rounded-md text-sm text-white transition ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={isLoading}  // 로딩 중일 때 버튼 비활성화
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                        </svg>
                    ) : (
                        <FiPlus />
                    )}
                    <span>{isLoading ? 'Uploading...' : 'Upload Files'}</span>
                </button>

                {/* 업로드 상태 표시 */}
                {uploadStatuses.length > 0 && (
                    <div className="mt-4">
                        {uploadStatuses.map((status, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-md mb-2 ${
                                    status.status === 'success'
                                        ? 'bg-green-100 text-green-800 border border-green-400'
                                        : 'bg-red-100 text-red-800 border border-red-400'
                                }`}
                            >
                                <p className="font-semibold">{status.fileName}</p>
                                <p>{status.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    );
}

export default UploadFileModal;