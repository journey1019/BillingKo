import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '@/components/common/Modal.jsx';
import { uploadFileDevice } from '@/service/fileService.js';

const UploadFileDevice = ({ onUploadComplete }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [splitInfo, setSplitInfo] = useState({
        change_point: "",
        timezone: "UTC",
        change_type: "",
        before: "",
        after: ""
    });
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // change_point 변환 함수 (YYYY-MM-DDTHH:MM -> YYYY-MM-DDTHH:MM:00)
    const formatChangePoint = (dateTimeString) => {
        if (!dateTimeString.includes(":")) return dateTimeString; // 오류 방지
        if (dateTimeString.length === 16) return dateTimeString + ":00"; // ✅ 초(`:00`) 추가
        return dateTimeString; // 이미 초까지 있는 경우 변경 없음
    };


    // 사용자 입력 핸들러
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log('value: ', value);
        setSplitInfo((prev) => ({
            ...prev,
            [name]: name === "change_point" ? formatChangePoint(value) : value, // ✅ change_point 변환
        }));
    };

    // 파일 및 데이터 업로드 실행
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("⚠️ 업로드할 파일을 선택하세요.");
            return;
        }

        setLoading(true);
        setError(null);
        setUploadResult(null);

        console.log("📝 업로드 데이터 확인:", {
            file: selectedFile.name,
            splitInfo: JSON.stringify(splitInfo), // ✅ Postman과 동일한 방식
        });

        try {
            const response = await uploadFileDevice(selectedFile, [splitInfo]); // 배열로 변환 후 전송
            setUploadResult(response);
            setLoading(false);

            // ✅ 업로드 성공 후 2초 뒤 자동으로 모달 닫기
            setTimeout(() => {
                setShowModal(false);
                if (onUploadComplete) onUploadComplete();
            }, 2000);
        } catch (err) {
            console.error("❌ Upload Error:", err.response ? err.response.data : err.message);
            setError(err.response?.data || "❌ 파일 업로드 실패 (서버 오류)");
            setLoading(false);
        }
    };

    return (
        <>
            {/* ✅ 모달 트리거 버튼 */}
            <button
                onClick={() => setShowModal(true)}
                className="flex flex-row items-center space-x-2 p-2 rounded-md bg-white text-sm text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-600 transition"
            >
                <FiPlus /> <span className="pl-1">File Uploads</span>
            </button>

            {/* ✅ Modal 창 */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h1 className="text-xl font-bold mb-4 pb-5 border-b">Device File Upload</h1>
                <p className="pb-4 font-semibold">Device 파일과 변경사항을 업로드합니다.</p>

                {/* 파일 선택 */}
                <div className="mb-4">
                    <input type="file" onChange={handleFileChange} />
                </div>

                {/* 사용자 입력 폼 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Change Point</label>
                        <input
                            type="datetime-local"
                            name="change_point"
                            value={splitInfo.change_point}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Timezone</label>
                        <select
                            name="timezone"
                            value={splitInfo.timezone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="UTC">UTC</option>
                            <option value="KST">KST</option>
                            <option value="PST">PST</option>
                            <option value="EST">EST</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Change Type</label>
                        <input
                            type="text"
                            name="change_type"
                            value={splitInfo.change_type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="account / profile / etc"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Before</label>
                        <input
                            type="text"
                            name="before"
                            value={splitInfo.before}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">After</label>
                        <input
                            type="text"
                            name="after"
                            value={splitInfo.after}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* 업로드 버튼 */}
                <button
                    onClick={handleUpload}
                    className={`mt-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload File"}
                </button>

                {/* 결과 메시지 표시 */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {uploadResult && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                        <h3 className="font-bold">✅ Upload Success</h3>
                        <pre className="text-sm">{JSON.stringify(uploadResult, null, 2)}</pre>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default UploadFileDevice;
