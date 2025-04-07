import { useEffect } from 'react';
import useFileUploadStore from '@/stores/fileStore.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import UploadFileModal from '@/components/layout/File/UploadFileModal.jsx';
import { FaCircleCheck } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";


const FileUploadStatus = () => {
    // const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    // const { data: uploadHistoryAllData, loading: uploadHistoryAllLoading, error: uploadHistoryAllError } = useApiFetch(fetchUploadHistoryAllFiles);
    // const { data: uploadMonthlyData, loading: uploadMonthlyLoading, error: uploadMonthlyError } = useApiFetch(fetchUploadFileMonthly, yearMonth);


    const {
        uploadHistoryAllData,
        uploadMonthlyData,
        fetchAll,
        fetchMonthly,
        loading,
    } = useFileUploadStore();

    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();


    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (yearMonth) fetchMonthly(yearMonth);
    }, [yearMonth]);

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

    console.log('업로드 : ', uploadMonthlyData)
    console.log('이번달 : ', uploadedFilesMap)

    const getFileDetails = (spId, fileType) => {
        return uploadMonthlyData.find(file => {
            const [id, , type] = file.file_name.split('_');
            return Number(id) === spId && type === fileType;
        });
    };


    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">파일 업로드 상태</h2>
                <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
            </div>

            <div className="flex flex-row justify-between items-center mb-4">
                <UploadFileModal />
                <div className="flex flex-row space-x-4 rounded-md ">
                    <div className="flex flex-row text-sm items-center space-x-2">
                        <FaCircleCheck className="text-green-500 w-4 h-4"/>
                        <span>업로드 완료</span>
                    </div>
                    <div className="flex flex-row text-sm items-center space-x-2">
                        <CiCircleCheck />
                        <span>업로드 미완료</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filteredData?.map((uploadData) => {
                    const uploadedFiles = uploadedFilesMap[uploadData.sp_id] || new Set();

                    return (
                        <div
                            key={uploadData.sp_id}
                            className="grid grid-cols-4 gap-4 items-center bg-gray-100 rounded-md p-3 text-sm relative"
                        >
                            <span>{uploadData.sp_id}</span>
                            <span className="font-medium">{uploadData.alias}</span>

                            <div className="col-span-2 flex space-x-4">
                                {uploadData.include_files.map((fileType) => {
                                    const fileDetails = getFileDetails(uploadData.sp_id, fileType);
                                    const isUploaded = uploadedFiles.has(fileType);
                                    console.log(uploadData)
                                    console.log(uploadData)
                                    console.log(fileDetails)
                                    console.log(fileType)

                                    return (
                                        <div key={fileType} className="relative group cursor-pointer">
                                            <span className="flex flex-row items-center">
                                                <span className="pr-2">{fileType}</span>
                                                {isUploaded ? <><FaCircleCheck className="text-green-500 w-4 h-4"/></> : <><CiCircleCheck className="w-4 h-4"/></>}
                                            </span>

                                            {isUploaded && fileDetails && (
                                                <div
                                                    className="absolute left-0 top-full mt-1 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-500 z-10">
                                                    <div
                                                        className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {fileDetails.file_name}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 break-words whitespace-nowrap">
                                                        <p>
                                                            <strong>Update Date:</strong>{' '}
                                                            {new Date(fileDetails.update_date).toLocaleString()}
                                                        </p>
                                                        <p>
                                                            <strong>User ID:</strong> {fileDetails.user_id}
                                                        </p>
                                                        <p>
                                                            <strong>File Size:</strong> {fileDetails.file_size} bytes
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default FileUploadStatus;
