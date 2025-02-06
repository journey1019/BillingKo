import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchFileUpdateHistory } from '@/service/fileService.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';

// 필수 파일 리스트 생성 함수
const generateRequiredFiles = (yearMonth) => [
    `122123_${yearMonth}_CDRv3.csv`,
    `122693_${yearMonth}_CDRv3.csv`,
    `123252_${yearMonth}_CDRv3.csv`,
    `123343_${yearMonth}_CDRv3.csv`,
    `123700_${yearMonth}_CDRv3.csv`,
    `122123_${yearMonth}_NetworkReport.csv`,
    `122693_${yearMonth}_NetworkReport.csv`,
    `123225_${yearMonth}_NetworkReport.csv`,
    `123252_${yearMonth}_NetworkReport.csv`,
    `123343_${yearMonth}_NetworkReport.csv`,
    `123700_${yearMonth}_NetworkReport.csv`,
];

const FileStatusForm = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const [selectedDate, setSelectedDate] = useState(oneMonthAgo);
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "");

    const { data: fileHistoryData, loading, error, refetch } = useApiFetch(() => fetchFileUpdateHistory(yearMonth));

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [missingFiles, setMissingFiles] = useState([]);

    useEffect(() => {
        if (fileHistoryData) {
            const requiredFiles = generateRequiredFiles(yearMonth);
            const uploadedFileNames = fileHistoryData.map(file => file.file_name);
            const missing = requiredFiles.filter(file => !uploadedFileNames.includes(file));
            const uploaded = requiredFiles.filter(file => uploadedFileNames.includes(file));
            setUploadedFiles(uploaded);
            setMissingFiles(missing);
        }
    }, [fileHistoryData, yearMonth]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        refetch(); // 선택된 날짜에 따라 데이터 다시 불러오기
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Failed to fetch file status: {error}</p>;

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">File Upload Status for {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
                <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
            </div>

            {/* 업로드된 파일 */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600">Uploaded Files</h3>
                <ul className="grid grid-cols-2 gap-2">
                    {uploadedFiles.map(file => (
                        <li key={file} className="bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-sm">
                            {file}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 누락된 파일 */}
            <div>
                <h3 className="text-lg font-semibold text-red-600">Missing Files</h3>
                <ul className="grid grid-cols-2 gap-2">
                    {missingFiles.length > 0 ? (
                        missingFiles.map(file => (
                            <li key={file} className="bg-red-100 text-red-800 px-4 py-2 rounded-md shadow-sm">
                                {file}
                            </li>
                        ))
                    ) : (
                        <li className="text-green-800">All required files are uploaded!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FileStatusForm;
