import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAdjustmentStore from '@/stores/adjustmentStore';
import useAdjustmentOptionLoader from '@/hooks/useAdjustmentOptionLoader.js';
import ToggleSwitch from '@/components/ui/switches/ToggleSwitch';

import { IoMdClose } from "react-icons/io";
import FormInput from '@/components/dropdown/FormInput.jsx';

const AdjustmentTransactionDetailEditForm = () => {
    const { adjustment_index } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    
    const {
        fetchAdjustmentDetailData,
        adjustmentDetailData,
        adjustmentDetailLoading,
        adjustmentDetailError,
        updateAdjustmentData
    } = useAdjustmentStore();
    const {
        adjustmentCategories,
        adjustmentTypes,
        mountTypes,
        adjustmentCycles
    } = useAdjustmentOptionLoader(setFormData, true);

    useEffect(() => {
        if (adjustment_index) {
            fetchAdjustmentDetailData(adjustment_index);
        }
    }, [adjustment_index]);

    useEffect(() => {
        if (adjustmentDetailData) {
            setFormData({
                ...adjustmentDetailData,
                use_yn: adjustmentDetailData.use_yn === 'Y',
                tax_free_yn: adjustmentDetailData.tax_free_yn === 'Y',
            });
        }
    }, [adjustmentDetailData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // mount_value만 쉼표 제거 후 숫자로 변환
        const parsedValue = name === 'mount_value'
            ? Number(value.replace(/,/g, '')) || 0
            : value;

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };
    const numberWithCommas = (num) => {
        if (num === null || num === undefined) return '';
        const cleanNum = typeof num === 'number' ? num : Number(num);
        return cleanNum.toLocaleString('ko-KR');
    };


    const handleToggle = (field) => (value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ✅ 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            use_yn: formData.use_yn ? 'Y' : 'N',
            tax_free_yn: formData.tax_free_yn ? 'Y' : 'N',
        };

        const route = (payload.adjustment_code === 'account_num') ? 'accounts' : (payload.adjustment_code === 'serial_number') ? 'devices' : (payload.adjustment_code === 'ppid') ? 'ppid' : 'adjustment';
        try {
            await updateAdjustmentData(adjustment_index, payload); // ✅ 전달받은 update 함수 호출
            alert('성공적으로 수정되었습니다!');
            navigate(`/${route}/?value=${payload.adjustment_code_value}`, { replace: true });
        } catch (err) {
            console.error(err);
            alert('수정 실패');
        }
    };

    if (adjustmentDetailLoading || !formData) return <p>Loading...</p>;
    if (adjustmentDetailError) return <p className="text-red-500">{adjustmentDetailError}</p>;

    return(
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">{adjustmentDetailData.adjustment_code_value} 조정 데이터 수정</h1>
                <button onClick={() => navigate("/")}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* ✅ 입력 폼 */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex flex-row items-center space-x-4">
                        <span className="text-base font-semibold text-gray-600">사용 여부</span>
                        <div className="flex items-center space-x-2">
                            <ToggleSwitch
                                isEnabled={formData.use_yn}
                                onToggle={handleToggle('use_yn')}
                                labelOn="활성"
                                labelOff="비활성"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                        <span className="text-base font-semibold text-gray-600">부가세</span>
                        <div className="flex items-center space-x-2">
                            <ToggleSwitch
                                isEnabled={formData.tax_free_yn}
                                onToggle={handleToggle('tax_free_yn')}
                                labelOn="부가세 계산 전"
                                labelOff="부가세 계산 후"
                            />
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="date_index" className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 적용 날짜
                        </label>
                        <input
                            id="date_index"
                            name="date_index"
                            type="text"
                            value={formData.date_index || ''}
                            onChange={handleChange}
                            className="text-base w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-white border"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="adjustment_cycle"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 적용 주기
                        </label>
                        <select
                            name="adjustment_cycle"
                            value={formData.adjustment_cycle}
                            onChange={handleChange}
                            className="w-1/2 2xl:w-2/3 col-span-2 border rounded-md p-2 text-sm"
                        >
                            <option value="">선택하세요</option>
                            {adjustmentCycles.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="adjustment_code"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 대상 구분
                        </label>
                        <input
                            id="adjustment_code"
                            name="adjustment_code"
                            type="text"
                            value={formData.adjustment_code || '-'}
                            onChange={handleChange}
                            className="text-base w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-gray-100"
                            disabled={true}
                            readOnly={true}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="adjustment_code_value"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 대상
                        </label>
                        <input
                            id="adjustment_code_value"
                            name="adjustment_code_value"
                            type="text"
                            value={formData.adjustment_code_value || '-'}
                            onChange={handleChange}
                            className="text-base w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-gray-100"
                            disabled={true}
                            readOnly={true}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="adjustment_category"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 종류
                        </label>
                        <select
                            name="adjustment_category"
                            value={formData.adjustment_category}
                            onChange={handleChange}
                            className="w-1/2 2xl:w-2/3 col-span-2 border rounded-md p-2 text-sm"
                        >
                            <option value="">선택하세요</option>
                            {adjustmentCategories.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="adjustment_type"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 타입
                        </label>
                        <select
                            name="adjustment_type"
                            value={formData.adjustment_type}
                            onChange={handleChange}
                            className="w-1/2 2xl:w-2/3 col-span-2 border rounded-md p-2 text-sm"
                        >
                            <option value="">선택하세요</option>
                            {adjustmentTypes.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="mount_type"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 적용 기준
                        </label>
                        <select
                            name="mount_type"
                            value={formData.mount_type}
                            onChange={handleChange}
                            className="w-1/2 2xl:w-2/3 col-span-2 border rounded-md p-2 text-sm"
                        >
                            <option value="">선택하세요</option>
                            {mountTypes.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="mount_value" className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            조정 금액
                        </label>
                        <input
                            id="mount_value"
                            name="mount_value"
                            type="text"
                            inputMode="numeric" // 모바일 키보드 숫자모드 지원
                            value={numberWithCommas(formData.mount_value)}
                            onChange={handleChange}
                            className="text-base w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-white border text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="description"
                               className="text-sm font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1">
                            설명
                        </label>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            value={formData.description || '-'}
                            onChange={handleChange}
                            className="text-base w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-white border"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdjustmentTransactionDetailEditForm;