import { fetchUploadHistoryAllFiles, fetchUploadFileMonthly } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import { MdEdit } from "react-icons/md";
import UploadFileModal from '@/components/layout/File/UploadFileModal.jsx';

const FileUploadStatus = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: uploadHistoryAllData, loading: uploadHistoryAllLoading, error: uploadHistoryAllError } = useApiFetch(fetchUploadHistoryAllFiles);
    const { data: uploadMonthlyData, loading: uploadMonthlyLoading, error: uploadMonthlyError } = useApiFetch(fetchUploadFileMonthly, yearMonth);

    // 조건을 만족하는 데이터 필터링
    const filteredData = uploadHistoryAllData?.filter(item => {
        if (item.use_yn !== 'Y') return false; // use_yn이 'Y'인 데이터만 포함

        const activeIndex = Number(item.active_index); // 활성화 시작일
        const deactiveIndex = item.deactive_index ? Number(item.deactive_index) : Infinity; // 비활성화일이 없으면 무한대 처리

        const currentYearMonth = Number(yearMonth); // 현재 선택된 연월

        return activeIndex <= currentYearMonth && currentYearMonth <= deactiveIndex;
    }) || [];

    // 업로드된 파일 매핑 (sp_id → 업로드된 파일 목록)
    const uploadedFilesMap = uploadMonthlyData?.reduce((acc, file) => {
        const parts = file.file_name.split('_');
        const spId = Number(parts[0]); // 파일 이름에서 sp_id 추출
        const fileType = parts.slice(-1)[0]; // 마지막 요소가 파일 타입

        if (!acc[spId]) acc[spId] = new Set();
        acc[spId].add(fileType); // 업로드된 파일 타입 저장
        return acc;
    }, {}) || {};

    const handleUploadComplete = () => {
        // 업로드 완료 시 데이터 갱신
        refetch();
    }

    console.log('업로드 : ', uploadMonthlyData)
    console.log('이번달 : ', uploadedFilesMap)

    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">File Upload Status for</h2>
                    <h2 className="text-xl font-bold text-gray-700">{selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    })}</h2>
                </div>
                <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                <UploadFileModal onUploadComplete={handleUploadComplete} />
            </div>

            <div>
                <div className="flex flex-row justify-between pb-2">
                    <h3 className="text-base font-semibold text-blue-600">List of files to upload</h3>
                    <button className="p-1 border-2 border-gray-800 rounded-md hover:bg-gray-200"
                            onClick={() => console.log('service provider 수정 페이지로 이동')}><MdEdit />
                    </button>
                </div>
                <div className="">
                    {filteredData?.map((uploadData) => {
                        const spId = uploadData.sp_id;
                        const requiredFiles = uploadData.include_files; // 업로드해야 할 파일 리스트
                        const uploadedFiles = uploadedFilesMap[spId] || new Set(); // 해당 sp_id에 업로드된 파일 목록

                        return (
                            <div key={spId}
                                 className="flex flex-row bg-gray-300 rounded-md p-2 text-sm mb-2 justify-between">
                                <div className="grid grid-cols-2 space-x-4">
                                    <span className="col-span-1">{uploadData.alias}</span>
                                    <span className="col-span-1">{spId}</span>
                                </div>
                                <div className="flex flex-row space-x-4">
                                    {requiredFiles.map(fileType => (
                                        <div key={fileType} className="space-x-4">
                                            <span>{fileType}</span>
                                            {uploadedFiles.has(fileType) ? "✅" : "☑️"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FileUploadStatus;
