import { fetchUploadHistoryAllFiles, fetchUploadFileMonthly, fetchUploadHistoryDetailFiles } from '@/service/fileService.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import { deleteUpload } from '@/service/fileService.js';
import useAlert from '@/hooks/useAlert';
import useApiFetch from '@/hooks/useApiFetch.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { FileUploadHistoryTableColumns } from '@/columns/FileUploadHistoryTableColumns.jsx';
import { FileUploadTableOptions } from '@/options/FileUploadTableOptions.jsx';
import React, { useEffect, useState } from 'react';
import UploadHistoryDetailForm from '@/components/form/File/UploadHistoryDetailForm.jsx';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UploadFileTabOverview from './UploadFileTabOverview.jsx';
import TabComponent from '../../layout/TabComponent.jsx';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';

const FileUpload = () => {
    const navigate = useNavigate();
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { showConfirm, showSuccess, showError } = useAlert(); // ✅ 커스텀 훅 사용

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: uploadHistoryAllData, loading: uploadHistoryAllLoading, error: uploadHistoryAllError } = useApiFetch(fetchUploadHistoryAllFiles);
    const { data: uploadMonthlyData, loading: uploadMonthlyLoading, error: uploadMonthlyError } = useApiFetch(fetchUploadFileMonthly, yearMonth);
    const { data: uploadHistoryDetailData, loading: uploadHistoryDetailLoading, error: uploadHistoryDetailError } = useApiFetch(fetchUploadHistoryDetailFiles, selectedRowData?.sp_id);


    // 조건을 만족하는 데이터 필터링
    const filteredData = uploadHistoryAllData?.filter(item => {
        if (item.use_yn !== 'Y') return false; // use_yn이 'Y'인 데이터만 포함

        const activeIndex = Number(item.active_index); // 활성화 시작일
        const deactiveIndex = item.deactive_index ? Number(item.deactive_index) : Infinity; // 비활성화일이 없으면 무한대 처리

        const currentYearMonth = Number(yearMonth); // 현재 선택된 연월

        return activeIndex <= currentYearMonth && currentYearMonth <= deactiveIndex;
    }) || [];
    // console.log('filteredData : ', filteredData)


    // 숫자 부분 추출 후 중복 제거하여 배열로 변환
    const uniqueFileSPID = Array.from(
        new Set(uploadMonthlyData?.map(item => item.file_name.split('_')[0])) // `_` 앞의 숫자 추출 후 Set으로 중복 제거
    );
    // console.log(uniqueFileSPID);

    // 조건을 만족하는 새로운 배열 생성 (use_yn === 'Y' && sp_id가 uniqueFileSPID에 포함)
    const filteredUploadHistoryData = uploadHistoryAllData?.filter(
        (item) => item.use_yn === 'Y' && uniqueFileSPID.includes(item.sp_id)
    ) || [];
    // `use_yn === 'N'`인 행을 제거
    const filteredUseData = uploadHistoryAllData?.filter(item => item.use_yn !== 'N') || [];
    // console.log('filteredUploadHistoryData : ', filteredUploadHistoryData)
    // console.log('filteredUseData : ', filteredUseData)

    console.log('uploadHistoryAllData : ', uploadHistoryAllData)
    console.log('uploadMonthlyData : ', uploadMonthlyData)
    console.log('uploadHistoryDetailData : ', uploadHistoryDetailData)


    const handleDelete = async () => {
        if (!selectedRowData.sp_id) {
            showError('SP ID가 필요합니다.');
            return;
        }

        // ✅ 커스텀 훅 사용 (모달)
        const result = await showConfirm('정말 삭제하시겠습니까?', '삭제하면 복구할 수 없습니다!');
        if (!result.isConfirmed) return;

        try {
            await deleteUpload(selectedRowData.sp_id);
            showSuccess('삭제 완료!', '업로드 항목이 성공적으로 삭제되었습니다!');
            setTimeout(() => window.location.reload(), 2000); // 2초 후 새로고침
        } catch (err) {
            console.error(err);
            showError('삭제 중 오류가 발생했습니다.');
        }
    };

    const enrichedUploadData = uploadHistoryAllData?.map((item) => {
        if (item.use_yn === 'N') {
            return {
                ...item,
                uploadStatus: null,
                isAllUploaded: null,
            };
        }

        const requiredFiles = item.include_files;
        const uploadedFiles = uploadMonthlyData
            ?.filter((file) => file.file_name.startsWith(`${item.sp_id}_`))
            ?.map((file) => file.file_name.split('_').slice(-1)[0]);

        const uploadStatus = requiredFiles.map((fileType) => ({
            fileType,
            isUploaded: uploadedFiles.includes(fileType),
        }));

        const isAllUploaded = uploadStatus.every((f) => f.isUploaded);

        return {
            ...item,
            uploadStatus,
            isAllUploaded,
        };
    });

    console.log(enrichedUploadData)

    return(
        <div className={`grid gap-0 ${isExpanded ? 'grid-cols-6' : 'grid-cols-2'}`}>
            <div className={`p-2 ${isExpanded ? 'col-span-2' : 'col-span-6'}`}>
                <div className="flex flex-row justify-between py-2">
                    <span className="text-xl font-bold">Service Provider 테이블</span>
                    <button onClick={() => navigate('/upload/new')}
                            className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                        <FiPlus />
                        <span>New</span>
                    </button>
                </div>
                <ReusableTable
                    data={enrichedUploadData || []}
                    columns={FileUploadHistoryTableColumns}
                    isLoading={uploadHistoryAllLoading}
                    error={uploadHistoryAllError}
                    options={{
                        ...FileUploadTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                console.log(selectedRow);
                                if (selectedRowData && selectedRowData.sp_id === selectedRow.sp_id) {
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
                    <div className="flex flex-col">
                        {/* Top */}
                        <div className="flex flex-row justify-between mb-3">
                            {/* Serial_Number */}
                            <h2 className="text-lg font-bold mb-4">{selectedRowData.sp_id} _ {selectedRowData.alias}</h2>

                            {/* Buttons - Edit & Mail & . */}
                            <div className="flex flex-row">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700"
                                    onClick={() => navigate(`/upload/${selectedRowData.sp_id}/edit`)}
                                >
                                    <MdModeEditOutline className="mr-3" />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700"
                                    onClick={handleDelete}
                                >
                                    <MdDelete className="mr-3" />
                                    Delete
                                </button>
                            </div>
                        </div>

                    </div>


                    <TabComponent tabs={[
                        {
                            id: 1,
                            label: 'Overview',
                            content: (
                                <UploadFileTabOverview detailData={uploadHistoryDetailData} uploadHistoryDetailLoading={uploadHistoryDetailLoading} uploadHistoryDetailError={uploadHistoryDetailError}/>
                            )
                        }
                    ]}
                    />
                    {/*<UploadHistoryDetailForm detailData={uploadHistoryDetailData} />*/}



                    {/*<div className="flex flex-row justify-between">*/}
                    {/*    <h1 className="text-2xl p-2">{selectedRowData.sp_id}</h1>*/}
                    {/*</div>*/}

                    {/* Detail & Edit Page */}
                    {/*<div className="grid-cols-2">*/}
                    {/*    <UploadHistoryDetailForm detailData={uploadHistoryDetailData} />*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    )
}


export default FileUpload;