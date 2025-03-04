import React from 'react';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteUpload } from '@/service/fileService.js';

/**
 * @param {object} detailData - 업로드 이력 상세 데이터
 */
const UploadHistoryDetailForm = ({ detailData }) => {
    const navigate = useNavigate();
    if (!detailData) return <p>No data available.</p>;

    // 날짜 포맷 변환 함수
    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 'YYYYMM' 형식을 'YYYY년 MM월'로 변환하는 함수
    const formatYearMonth = (yearMonthString) => {
        if (!yearMonthString || yearMonthString.length !== 6) return '-';
        const year = yearMonthString.slice(0, 4);
        const month = yearMonthString.slice(4, 6);
        return `${year}년 ${month}월`;
    };

    // 삭제 이벤트 (SweetAlert2 적용)
    const handleDelete = async () => {
        if (!detailData.sp_id) {
            Swal.fire({
                icon: 'warning',
                title: 'SP ID is required',
                text: 'SP ID가 필요합니다.',
            });
            return;
        }

        // SweetAlert2로 확인 모달 표시
        const result = await Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제하면 복구할 수 없습니다!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '네, 삭제합니다',
            cancelButtonText: '취소'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUpload(detailData.sp_id);
            Swal.fire({
                icon: 'success',
                title: '삭제 완료',
                text: '업로드 항목이 성공적으로 삭제되었습니다!',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // 페이지 새로고침
                window.location.reload();
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: '삭제 실패',
                text: '삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-lg font-bold mb-4">Upload History Detail</h2>
                <div className="flex flex-row">
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700"
                        onClick={() => navigate(`/upload/${detailData.sp_id}/edit`)}
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

            <div className="space-y-2 text-sm">
                {[
                    { label: 'SP ID', value: detailData.sp_id },
                    { label: 'Alias', value: detailData.alias },
                    { label: 'Active Index', value: formatYearMonth(detailData.active_index) },
                    { label: 'Deactive Index', value: formatYearMonth(detailData.deactive_index) ?? '-' },
                    { label: 'Register Date', value: formatDateTime(detailData.regist_date) },
                    { label: 'Register User ID', value: detailData.regist_user_id },
                    { label: 'Update Date', value: formatDateTime(detailData.update_date) },
                    { label: 'Update User ID', value: detailData.update_user_id ?? '-' },
                    {
                        label: 'Use Y/N',
                        value: detailData.use_yn,
                        className: detailData.use_yn === 'Y' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
                    },
                ].map(({ label, value, className }, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-2">
                        <span className="w-40 font-semibold text-gray-700">{label}</span>
                        <span className={`p-2 rounded-md bg-gray-100 flex-1 ${className || ''}`}>{value}</span>
                    </div>
                ))}

                <div className="flex items-start gap-4 border-b pb-2">
                    <span className="w-40 font-semibold text-gray-700">Include Files</span>
                    <ul className="p-2 border rounded-md bg-gray-100 flex-1">
                        {detailData.include_files && detailData.include_files.length > 0 ? (
                            detailData.include_files.map((file, index) => (
                                <li key={index} className="list-disc ml-5">{file}</li>
                            ))
                        ) : (
                            <p>-</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UploadHistoryDetailForm;
