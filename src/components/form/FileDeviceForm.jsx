import { useState } from "react";
import UploadFileDevice from "@/components/layout/File/UploadFileDevice.jsx";
import { fetchByteUpdateHistory } from "@/service/fileService.js";
import MonthPickerArrow from "@/components/time/MonthPickerArrow.jsx";

const FileDeviceForm = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [selectedDate, setSelectedDate] = useState(oneMonthAgo);
    const [serialNumber, setSerialNumber] = useState(""); // ✅ Serial Number 저장
    const [historyData, setHistoryData] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // ✅ YYYYMM 형식으로 변환
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "");

    // ✅ 날짜 선택 변경
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // ✅ Serial Number 변경
    const handleSerialNumberChange = (e) => {
        setSerialNumber(e.target.value);
    };

    // ✅ 업로드 완료 후 자동으로 serial_number & 날짜 입력
    const handleUploadComplete = async (uploadedSerialNumber, uploadedDateIndex) => {
        if (!uploadedSerialNumber || !uploadedDateIndex) return;

        console.log("📝 업로드 완료 후 데이터 자동 입력", {
            serial_number: uploadedSerialNumber,
            date_index: uploadedDateIndex,
        });

        setSerialNumber(uploadedSerialNumber);
        setSelectedDate(new Date(uploadedDateIndex.slice(0, 4), uploadedDateIndex.slice(4, 6) - 1));

        // ✅ 업로드 후 자동 조회
        await fetchHistory(uploadedSerialNumber, uploadedDateIndex);
    };

    // ✅ API 호출하여 데이터 조회
    const fetchHistory = async (serialNum, dateIdx) => {
        if (!serialNum || !dateIdx) {
            setHistoryError("⚠️ Serial Number와 Date Index가 필요합니다.");
            return;
        }

        setHistoryLoading(true);
        setHistoryError(null);
        setHistoryData(null);

        try {
            const response = await fetchByteUpdateHistory(serialNum, dateIdx);
            console.log(response);
            setHistoryData(response);
            console.log("✅ 조회 성공:", response);
        } catch (err) {
            console.error("❌ 조회 실패:", err);
            setHistoryError(err.message || "❌ 데이터 조회 실패");
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">Upload Device Return File</h2>
                    <h2 className="text-xl font-bold text-gray-700">
                        {selectedDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                    </h2>
                </div>
                <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
            </div>

            <div className="flex flex-row md:flex-row justify-between items-center mb-2">
                {/* ✅ 업로드 모달 */}
                <UploadFileDevice onUploadComplete={handleUploadComplete} />

                {/* ✅ Serial Number 입력 */}
                <div className="flex items-center space-x-2">
                    <span className="pr-2">Serial Number :</span>
                    <input
                        type="text"
                        id="serial_number"
                        value={serialNumber}
                        onChange={handleSerialNumberChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-60" // ✅ 크기 조정
                        placeholder="02110049SKYEE22"
                        required
                    />

                    {/* ✅ 조회 버튼 */}
                    <button
                        onClick={() => fetchHistory(serialNumber, yearMonth)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    >
                        조회
                    </button>
                </div>
            </div>

            {/* ✅ 조회 결과 표시 */}
            {historyLoading && <p className="text-blue-500 mt-2">📡 데이터를 불러오는 중...</p>}
            {historyData && (
                <div className="mt-4 p-4 bg-gray-100 text-gray-800 rounded-lg">
                    <h3 className="font-bold">✅ 조회 결과</h3>
                    <pre className="text-sm">{JSON.stringify(historyData, null, 2)}</pre>
                </div>
            )}
            {historyError && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
                    <h3 className="font-bold">❌ 데이터 조회 실패</h3>
                    <p className="text-sm">{historyError}</p>
                </div>
            )}
        </div>
    );
};

export default FileDeviceForm;
