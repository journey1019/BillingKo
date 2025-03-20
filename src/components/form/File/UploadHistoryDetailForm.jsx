import React from 'react';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { deleteUpload } from '@/service/fileService.js';
import useAlert from '@/hooks/useAlert';
import UploadFileTabOverview from './UploadFileTabOverview.jsx';
import TabComponent from '../../layout/TabComponent.jsx'; // ✅ 커스텀 훅 사용

const UploadHistoryDetailForm = ({ detailData }) => {
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useAlert(); // ✅ 커스텀 훅 사용

    if (!detailData) return <p>No data available.</p>;

    // 삭제 이벤트
    const handleDelete = async () => {
        if (!detailData.sp_id) {
            showError('SP ID가 필요합니다.');
            return;
        }

        // ✅ 커스텀 훅 사용 (모달)
        const result = await showConfirm('정말 삭제하시겠습니까?', '삭제하면 복구할 수 없습니다!');
        if (!result.isConfirmed) return;

        try {
            await deleteUpload(detailData.sp_id);
            showSuccess('삭제 완료!', '업로드 항목이 성공적으로 삭제되었습니다!');
            setTimeout(() => window.location.reload(), 2000); // 2초 후 새로고침
        } catch (err) {
            console.error(err);
            showError('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-lg font-bold mb-4">{detailData.sp_id} _ {detailData.alias}</h2>
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

            <TabComponent tabs={[
                {
                    id: 1,
                    label: 'Overview',
                    content: (
                        <UploadFileTabOverview detailData={detailData}/>
                    )
                },
                {
                    id: 2,
                    label: 'History',
                    content: (
                        <UploadFileTabOverview detailData={detailData}/>
                    )
                },
            ]}
            />

        </div>
    );
};

export default UploadHistoryDetailForm;
