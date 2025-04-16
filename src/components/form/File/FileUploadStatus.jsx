import { useEffect } from 'react';
import useFileUploadStore from '@/stores/fileStore.js';
import useYearMonth from '@/hooks/useYearMonth.js';

import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import UploadFileModal from '@/components/layout/File/UploadFileModal.jsx';
import { Tooltip } from '@mui/material';

import { FaCircleCheck } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import { CiCircleQuestion } from "react-icons/ci";


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

    const getFileDetails = (spId, fileType) => {
        return uploadMonthlyData.find(file => {
            const [id, , type] = file.file_name.split('_');
            return Number(id) === spId && type === fileType;
        });
    };


    // 상단 고정 타입 선언
    const fileTypes = ['CDRv3.csv', 'NetworkReport.csv']; // 순서 고정

    console.log(filteredData)
    return (
        <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold flex flex-row items-center space-x-2">
                    <span>파일 업로드 상태</span>
                    <Tooltip arrow placement="right"
                             title={
                                 <div>
                                     IDP Skywave 파일을 업로드하고,<br />
                                     업로드 현황을 확인할 수 있습니다.
                                 </div>
                             }
                    >
                        <span>
                            <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                        </span>
                    </Tooltip>
                </h2>
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
                    return (
                        <div
                            key={uploadData.sp_id}
                            className="grid grid-cols-[1fr_2fr_repeat(2,1fr)] gap-x-4 items-center bg-gray-100 rounded-md px-3 text-sm relative"
                        >
                            {/* 기본 정보 */}
                            <span>{uploadData.sp_id}</span>
                            <span className="font-medium">{uploadData.alias}</span>

                            {/* 각 fileType에 대해 열 맞춤 렌더링 */}
                            {fileTypes.map((fileType) => {
                                const fileDetails = getFileDetails(uploadData.sp_id, fileType);
                                const isUploaded = uploadedFilesMap[uploadData.sp_id]?.has(fileType);
                                const isExpected = uploadData.include_files.includes(fileType); // 이 항목이 기대되는지

                                return (
                                    <div
                                        key={fileType}
                                        className="relative group cursor-pointer flex flex-col min-h-[40px] justify-center"
                                    >
                                        {/* ✅ 기대된 파일 유형이 있으면 보여주고, 아니면 빈칸만 유지 */}
                                        {isExpected ? (
                                            <>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs text-gray-700 truncate">{fileType}</span>
                                                    {isUploaded
                                                        ? <FaCircleCheck className="text-green-500 w-4 h-4" />
                                                        : <CiCircleCheck className="text-gray-400 w-4 h-4" />}
                                                </div>

                                                {/* Tooltip */}
                                                {isUploaded && fileDetails && (
                                                    <div
                                                        className="absolute left-0 top-full mt-1 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-500 z-10">
                                                        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                                                            <p className="font-semibold text-gray-900 truncate">
                                                                {fileDetails.file_name}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 break-words whitespace-nowrap">
                                                            <p><strong>Update Date:</strong> {new Date(fileDetails.update_date).toLocaleString()}</p>
                                                            <p><strong>User ID:</strong> {fileDetails.user_id}</p>
                                                            <p><strong>File Size:</strong> {fileDetails.file_size} bytes</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-xs text-gray-400 text-center italic">-</div> // ✅ 비어있는 자리 유지
                                        )}
                                    </div>
                                );
                            })}

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default FileUploadStatus;
