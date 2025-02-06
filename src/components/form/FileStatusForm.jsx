import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchFileUpdateHistory } from '@/service/fileService.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 필수 CDR 파일 리스트 생성
const generateCDRFiles = (yearMonth) => [
    `122123_${yearMonth}_CDRv3.csv`,
    `122693_${yearMonth}_CDRv3.csv`,
    `123252_${yearMonth}_CDRv3.csv`,
    `123343_${yearMonth}_CDRv3.csv`,
    `123700_${yearMonth}_CDRv3.csv`,
];

const generateNetworkReportFiles = (yearMonth) => [
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

    const [cdrUploadedFiles, setCdrUploadedFiles] = useState([]);
    const [cdrMissingFiles, setCdrMissingFiles] = useState([]);
    const [nrUploadedFiles, setNrUploadedFiles] = useState([]);
    const [nrMissingFiles, setNrMissingFiles] = useState([]);

    useEffect(() => {
        if (fileHistoryData) {
            const cdrRequiredFiles = generateCDRFiles(yearMonth);
            const nrRequiredFiles = generateNetworkReportFiles(yearMonth);

            const uploadedFileNames = fileHistoryData.map(file => file.file_name);

            const cdrUploaded = fileHistoryData.filter(file => cdrRequiredFiles.includes(file.file_name));
            const nrUploaded = fileHistoryData.filter(file => nrRequiredFiles.includes(file.file_name));

            const cdrMissing = cdrRequiredFiles.filter(file => !uploadedFileNames.includes(file));
            const nrMissing = nrRequiredFiles.filter(file => !uploadedFileNames.includes(file));

            setCdrUploadedFiles(cdrUploaded);
            setCdrMissingFiles(cdrMissing);
            setNrUploadedFiles(nrUploaded);
            setNrMissingFiles(nrMissing);
        }
    }, [fileHistoryData, yearMonth]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        refetch();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Failed to fetch file status: {error}</p>;

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                <h2 className="text-lg font-bold">File Upload Status for {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
                <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* CDR Files Section */}
                <div>
                    <h3 className="text-base font-semibold text-blue-600">CDR Files</h3>
                    <div className="grid gap-2">
                        {cdrUploadedFiles.map((file, index) => (
                            <div
                                key={`cdr-uploaded-${index}`}
                                className="relative min-h-[40px] text-sm md:text-xs flex items-center bg-green-100 text-green-800 p-2 rounded-md shadow-sm group"
                            >
                                ✅ {file.file_name}
                                <div className="absolute top-full mt-1 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded-lg shadow-md z-10">
                                    <p><strong>Update Date:</strong> {new Date(file.update_date).toLocaleString()}</p>
                                    <p><strong>User ID:</strong> {file.user_id}</p>
                                    <p><strong>File Size:</strong> {file.file_size} bytes</p>
                                </div>
                            </div>
                        ))}
                        {cdrMissingFiles.map((file, index) => (
                            <div key={`cdr-missing-${index}`} className="min-h-[40px] text-sm md:text-xs flex items-center bg-red-100 text-red-800 p-2 rounded-md shadow-sm">
                                ❌ {file}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Network Report Files Section */}
                <div>
                    <h3 className="text-base font-semibold text-blue-600">Network Report Files</h3>
                    <div className="grid gap-2">
                        {nrUploadedFiles.map((file, index) => (
                            <div
                                key={`nr-uploaded-${index}`}
                                className="relative min-h-[40px] text-sm md:text-xs flex items-center bg-green-100 text-green-800 p-2 rounded-md shadow-sm group"
                            >
                                ✅ {file.file_name}
                                <div className="absolute top-full mt-1 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded-lg shadow-md z-10">
                                    <p><strong>Update Date:</strong> {new Date(file.update_date).toLocaleString()}</p>
                                    <p><strong>User ID:</strong> {file.user_id}</p>
                                    <p><strong>File Size:</strong> {file.file_size} bytes</p>
                                </div>
                            </div>
                        ))}
                        {nrMissingFiles.map((file, index) => (
                            <div key={`nr-missing-${index}`} className="min-h-[40px] text-sm md:text-xs flex items-center bg-red-100 text-red-800 p-2 rounded-md shadow-sm">
                                ❌ {file}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileStatusForm;
