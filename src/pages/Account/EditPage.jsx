import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import useAccountStore from '@/stores/accountStore';
import { showConfirmAlert, showSuccessAlert, showErrorAlert, showWarningAlert } from "@/utils/AlertService.js";
import ToggleSwitch from '@/components/ui/switches/ToggleSwitch';

const EditPage = () => {
    const { acct_num } = useParams(); // 수정할 acc_num
    const navigate = useNavigate();
    const {
        accountPartData,
        accountPartLoading,
        accountPartError,
        fetchAccountDetails,
        updateAccountData
    } = useAccountStore();

    useEffect(() => {
        fetchAccountDetails(acct_num);
    }, [acct_num]);

    // ✅ 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAccountData(acct_num, formData);
            alert('계정이 성공적으로 수정되었습니다.');
            navigate('/accounts');
        } catch (err) {
            alert(err.message || '수정에 실패했습니다.');
        }
    };

    const [enabled, setEnabled] = useState(false);


    if (accountPartLoading) return (<></>);
    if (accountPartError) return <p className="text-red-500">{accountPartError}</p>;

    return(
        <div className="space-x-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                {/* 사용 여부 활성화 */}
                <span className="text-sm font-semibold text-gray-600">사용 여부</span>
                <div className="p-4">
                    <ToggleSwitch
                        isEnabled={enabled}
                        onToggle={setEnabled}
                        labelOn="활성"
                        labelOff="비활성"
                    />
                </div>

                {/* 기본 정보 */}
                <h2 className="text-md font-semibold text-gray-800 border-b pb-1">기본 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">고객번호</label>
                        <input
                            className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100"
                            readOnly={true} required={true}
                        >
                            {/*{formData.acct_num ?? ''}*/}
                        </input>
                    </div>
                </div>

                {/* 회사 정보 */}
                <h2 className="text-md font-semibold text-gray-800 border-b pb-1">회사 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">회사명</label>
                        <input
                            className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100"
                        >
                            {/*{formData.acct_num ?? ''}*/}
                        </input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPage;