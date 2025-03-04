import { fetchUploadHistoryAllFiles, fetchUploadFileMonthly, fetchUploadHistoryDetailFiles } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { FileUploadHistoryTableColumns } from '@/columns/FileUploadHistoryTableColumns.jsx';
import { FileUploadTableOptions } from '@/options/FileUploadTableOptions.jsx';
import React, { useEffect, useState } from 'react';
import UploadHistoryDetailForm from '@/components/form/File/UploadHistoryDetailForm.jsx';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const navigate = useNavigate();
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: uploadHistoryAllData, loading: uploadHistoryAllLoading, error: uploadHistoryAllError } = useApiFetch(fetchUploadHistoryAllFiles);
    const { data: uploadMonthlyData, loading: uploadMonthlyLoading, error: uploadMonthlyError } = useApiFetch(fetchUploadFileMonthly, yearMonth);
    const { data: uploadHistoryDetailData, loading: uploadHistoryDetailLoading, error: uploadHistoryDetailError } = useApiFetch(fetchUploadHistoryDetailFiles, selectedRowData?.sp_id);

    // useEffect(() => {
    //     if(!selectedRowData) return null;
    //     const fetchData = async () => {
    //
    //     }
    //     return fetchData;
    // }, [selectedRowData]);

    // 조건을 만족하는 데이터 필터링
    const filteredData = uploadHistoryAllData?.filter(item => {
        if (item.use_yn !== 'Y') return false; // use_yn이 'Y'인 데이터만 포함

        const activeIndex = Number(item.active_index); // 활성화 시작일
        const deactiveIndex = item.deactive_index ? Number(item.deactive_index) : Infinity; // 비활성화일이 없으면 무한대 처리

        const currentYearMonth = Number(yearMonth); // 현재 선택된 연월

        return activeIndex <= currentYearMonth && currentYearMonth <= deactiveIndex;
    }) || [];
    console.log('filteredData : ', filteredData)


    // 숫자 부분 추출 후 중복 제거하여 배열로 변환
    const uniqueFileSPID = Array.from(
        new Set(uploadMonthlyData?.map(item => item.file_name.split('_')[0])) // `_` 앞의 숫자 추출 후 Set으로 중복 제거
    );
    console.log(uniqueFileSPID);

    // 조건을 만족하는 새로운 배열 생성 (use_yn === 'Y' && sp_id가 uniqueFileSPID에 포함)
    const filteredUploadHistoryData = uploadHistoryAllData?.filter(
        (item) => item.use_yn === 'Y' && uniqueFileSPID.includes(item.sp_id)
    ) || [];
    // `use_yn === 'N'`인 행을 제거
    const filteredUseData = uploadHistoryAllData?.filter(item => item.use_yn !== 'N') || [];
    console.log('filteredUploadHistoryData : ', filteredUploadHistoryData)
    console.log('filteredUseData : ', filteredUseData)

    console.log('uploadHistoryAllData : ', uploadHistoryAllData)
    console.log('uploadMonthlyData : ', uploadMonthlyData)
    console.log('uploadHistoryDetailData : ', uploadHistoryDetailData)

    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                <div className="flex flex-row justify-between py-2">
                    <span className="font-bold">Service Provider</span>
                    <button onClick={() => navigate('/upload/new')}
                            className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                        <FiPlus />
                        <span>New</span>
                    </button>
                </div>
                <ReusableTable
                    data={uploadHistoryAllData || []}
                    columns={FileUploadHistoryTableColumns}
                    isLoading={uploadHistoryAllLoading}
                    error={uploadHistoryAllError}
                    options={{
                        ...FileUploadTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log(selectedRow);
                                if (selectedRowData && selectedRow.sp_id === selectedRow.sp_id) {
                                    setSelectedRowData(null);
                                    setIsExpanded(false);
                                } else {
                                    setSelectedRowData(selectedRow);
                                    setIsExpanded(true);
                                }
                            },
                        },
                    }}
                />
            </div>

            {isExpanded && selectedRowData && (
                <div className="p-2 col-span-4">
                    {/*<div className="flex flex-row justify-between">*/}
                    {/*    <h1 className="text-2xl p-2">{selectedRowData.sp_id}</h1>*/}
                    {/*</div>*/}

                    {/* Detail & Edit Page */}
                    <UploadHistoryDetailForm detailData={uploadHistoryDetailData} />
                    {/*<div className="grid-cols-2">*/}
                    {/*    <UploadHistoryDetailForm detailData={uploadHistoryDetailData} />*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    )
}


export default FileUpload;