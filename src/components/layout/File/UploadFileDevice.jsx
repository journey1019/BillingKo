import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '@/components/common/Modal.jsx';
import { uploadFileDevice, postByteUpdateHist } from '@/service/fileService.js';

const UploadFileDevice = () => {
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

    // byte update history 추가
    const [updateResult, setUpdateResult] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false); // ✅ API 호출 버튼 표시 여부

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // change_point 변환 함수 (YYYY-MM-DDTHH:MM -> YYYY-MM-DDTHH:MM:00)
    const formatChangePoint = (dateTimeString) => {
        if (!dateTimeString.includes(":")) return dateTimeString;
        if (dateTimeString.length === 16) return dateTimeString + ":00";
        return dateTimeString;
    };

    // 사용자 입력 핸들러
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSplitInfo((prev) => ({
            ...prev,
            [name]: name === "change_point" ? formatChangePoint(value) : value,
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
        setUpdateResult(null);
        setShowUpdateButton(false);

        try {
            // 1️⃣ 첫 번째 API 요청 (파일 업로드)
            const response = await uploadFileDevice(selectedFile, [splitInfo]);
            setUploadResult(response);
            setLoading(false);

            console.log("✅ Upload Success:", response);

            // ✅ change_result가 있을 경우 추가 API 버튼 활성화
            if (response.change_result) {
                setShowUpdateButton(true);
            }

        } catch (err) {
            console.error("❌ Upload Error:", err.response ? err.response.data : err.message);

            // ✅ 에러 객체를 문자열로 변환하여 렌더링 가능하도록 처리
            const errorMessage = typeof err.response?.data === "object"
                ? JSON.stringify(err.response?.data) // 객체일 경우 JSON 문자열로 변환
                : err.response?.data || "❌ 파일 업로드 실패 (서버 오류)";

            setError(errorMessage); // ✅ 문자열만 저장
            setLoading(false);
        }
    };

    // byteUpdateHist API 호출 실행
    const handleUpdate = async () => {
        if (!uploadResult?.change_result) return;

        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateResult(null);

        try {
            const updateResponse = await postByteUpdateHist(uploadResult.change_result);
            setUpdateResult(updateResponse);
            console.log("✅ Byte Update Success:", updateResponse);
            setShowUpdateButton(false); // ✅ API 호출 완료 후 버튼 숨김
        } catch (updateErr) {
            console.error("❌ Byte Update Error:", updateErr);

            // ✅ 에러 메시지 안전 변환
            const errorMessage = typeof updateErr.response?.data === "object"
                ? JSON.stringify(updateErr.response?.data)
                : updateErr.response?.data || "❌ Byte Update API 호출 실패";

            setUpdateError(errorMessage);
            // setUpdateError(updateErr.response?.data || "❌ Byte Update API 호출 실패");
        } finally {
            setUpdateLoading(false);
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
                {/*{error && <p className="text-red-500 mt-2">{error}</p>}*/}
                {/*{uploadResult && (*/}
                {/*    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">*/}
                {/*        <h3 className="font-bold">✅ Upload Success</h3>*/}
                {/*        <pre className="text-sm">{JSON.stringify(uploadResult, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}
                {uploadResult && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                        <h3 className="font-bold">✅ Upload Success</h3>

                        {/* ✅ before_size & after_size 화살표 비교 + 상세 변경 내용 표시 */}
                        {uploadResult.change_result && uploadResult.change_result.length > 0 ? (
                            <div className="mt-3 p-3 bg-white rounded-lg shadow-md">
                                <h4 className="font-semibold text-lg text-gray-800">📊 Change Result</h4>
                                <ul className="mt-2 text-sm text-gray-700 space-y-4">
                                    {uploadResult.change_result.map((item, index) => (
                                        <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                                            {/* ✅ Serial Number & Change Point */}
                                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">
                                    <b>🔹 Serial:</b> {item.serial_number}
                                </span>
                                                <span className="text-gray-700">
                                    <b>📅 Change Point:</b> {item.change_point}
                                </span>
                                            </div>

                                            {/* ✅ Change Type, Before, After */}
                                            <div className="mb-2 text-gray-700">
                                                <b>🔄 Change Type:</b> {item.change_type}
                                            </div>
                                            <div className="mb-2 flex space-x-2">
                                                <span className="font-semibold text-gray-700">🔙 Before:</span>
                                                <span className="text-blue-600 font-bold">{item.before}</span>
                                                <span className="text-gray-500">➡</span> {/* ✅ 화살표 추가 */}
                                                <span className="font-semibold text-gray-700">🔜 After:</span>
                                                <span className="text-red-600 font-bold">{item.after}</span>
                                            </div>

                                            {/* ✅ Before Size ➡ After Size 비교 */}
                                            <div className="flex items-center space-x-3 bg-gray-200 p-2 rounded-md shadow-inner">
                                                <span className="font-semibold text-gray-800">Before Size:</span>
                                                <span className="text-blue-600 font-bold">{item.before_size.toLocaleString()} bytes</span>
                                                <span className="text-gray-500 text-lg">➡</span> {/* ✅ 화살표 추가 */}
                                                <span className="font-semibold text-gray-800">After Size:</span>
                                                <span className="text-red-600 font-bold">{item.after_size.toLocaleString()} bytes</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700">No change result available.</p>
                        )}
                    </div>
                )}

                {/* ✅ change_result 확인 및 API 호출 버튼 */}
                {showUpdateButton && (
                    <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                        <h3 className="font-bold">🚀 Upload Success</h3>
                        <p className="text-sm">change_result 데이터를 Byte Update API에 전송하시겠습니까?</p>
                        <button
                            onClick={handleUpdate}
                            className={`mt-2 py-2 px-4 rounded-lg text-white ${updateLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? "Updating..." : "Update API Call"}
                        </button>
                    </div>
                )}

                {/*{updateError && <p className="text-red-500 mt-2">{updateError}</p>}*/}
                {/*{updateResult && (*/}
                {/*    <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg">*/}
                {/*        <h3 className="font-bold">✅ Byte Update Success</h3>*/}
                {/*        <pre className="text-sm">{JSON.stringify(updateResult, null, 2)}</pre>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/* ✅ Byte Update API 성공 여부 출력 */}
                {updateResult && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
                        <h3 className="font-bold">✅ Byte Update 성공!</h3>
                        <pre className="text-sm">{JSON.stringify(updateResult, null, 2)}</pre>
                    </div>
                )}

                {/* ❌ Byte Update API 실패 시 에러 메시지 출력 */}
                {updateError && (
                    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                        <h3 className="font-bold">❌ Byte Update 실패</h3>
                        <p className="text-sm">{updateError}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default UploadFileDevice;
