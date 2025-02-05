import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { uploadCdrFile } from '@/service/fileService.js';

const UploadFilePage = () => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');  // 이전 에러 초기화
        setSuccessMessage('');  // 이전 성공 메시지 초기화
    };

    const handleFileUpload = async () => {
        if (!file) {
            setErrorMessage('파일을 선택해주세요.');
            return;
        }

        try {
            const response = await uploadCdrFile(file);
            setSuccessMessage('파일 업로드에 성공했습니다!');
            setErrorMessage('');  // 에러 초기화
        } catch (error) {
            setErrorMessage(error.message);  // 사용자 친화적 에러 메시지 설정
        }
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold mb-4">CDR 파일 업로드</h1>

            {/* 파일 선택 */}
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 p-2 border rounded-md"
                accept=".csv,.cdr"  // 파일 형식 제한
            />

            {/* 업로드 버튼 */}
            <button
                onClick={handleFileUpload}
                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition"
            >
                <FiPlus />
                <span>Upload CDR</span>
            </button>

            {/* 성공 메시지 */}
            {successMessage && (
                <p className="mt-4 text-green-600 font-semibold">
                    {successMessage}
                </p>
            )}

            {/* 에러 메시지 */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-400 rounded">
                    <p className="font-bold">에러 발생:</p>
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
};

export default UploadFilePage;
