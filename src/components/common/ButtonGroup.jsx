import { useState, useEffect } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { deleteAccount } from '@/service/accountService';
import { GiSettingsKnobs } from "react-icons/gi";
import { IoMdDownload } from "react-icons/io";
import { Tooltip } from '@mui/material';



const ButtonGroup = ({ entityType, id, deleteFunction, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteFunction(id);
            alert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} 성공적으로 삭제하였습니다.`);

            // ✅ 삭제 후 추가 동작은 이곳에서 직접 수행
            if (onDeleteSuccess) {
                onDeleteSuccess(id); // 🔥 id를 넘기기만
            }
        } catch (err) {
            alert(`${entityType} 삭제 중 오류 발생`);
            console.error(`${entityType}를 삭제하는데 실패했습니다.:`, err.message);
        } finally {
            setShowConfirmModal(false);
        }
    };

    return (
        <>
            <div className="inline-flex rounded-md shadow-xs items-center" role="group">
                <Tooltip title="Overview 수정">
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                            onClick={() => navigate(`/${entityType}/${id}/edit`)}
                    >
                        <MdModeEditOutline className="mr-3" />
                        Edit
                    </button>
                </Tooltip>
                <Tooltip title="리뉴얼 Account 수정">
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                            onClick={() => navigate(`/${entityType}/edit/${id}`)}
                    >
                        <MdModeEditOutline className="mr-3" />
                        Edit (New)
                    </button>
                </Tooltip>
                <Tooltip title="데이터 삭제">
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                            onClick={() => setShowConfirmModal(true)}
                    >
                        <MdDelete className="mr-3" />
                        Delete
                    </button>
                </Tooltip>
                {/*<Tooltip title="조정 데이터 설정">*/}
                {/*    <button type="button"*/}
                {/*            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">*/}
                {/*        <GiSettingsKnobs className="mr-3" />*/}
                {/*        Settings*/}
                {/*    </button>*/}
                {/*</Tooltip>*/}
                {/*<Tooltip title="다운로드">*/}
                {/*    <button type="button"*/}
                {/*            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">*/}
                {/*        <IoMdDownload className="mr-3" />*/}
                {/*        Downloads*/}
                {/*    </button>*/}
                {/*</Tooltip>*/}
            </div>


            {/* Confirm Delete Modal */}
            <ConfirmModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleDelete}
                message={`해당 ${entityType} 정보를 정말 삭제하시겠습니까?`}
                status="delete"
            />
        </>
    );
};

export default ButtonGroup;
