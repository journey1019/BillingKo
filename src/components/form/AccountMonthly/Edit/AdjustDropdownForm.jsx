import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import DropdownMenu from '@/components/dropdown/DropdownMenu.jsx';
import FormInput from '@/components/dropdown/FormInput.jsx';
import { createAdjustment, fetchAdjustmentCodeName } from '@/service/adjustmentService.js';

const AdjustDropdownForm = ({ acctNum, yearMonth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ API에서 가져온 옵션 데이터 상태
    const [adjustmentCategories, setAdjustmentCategories] = useState([]);
    const [adjustmentTypes, setAdjustmentTypes] = useState([]);
    const [mountTypes, setMountTypes] = useState([]);
    const [adjustmentCycles, setAdjustmentCycles] = useState([]);

    // ✅ API 호출하여 조정 카테고리 목록 가져오기
    useEffect(() => {
        const loadAdjustmentOptions = async () => {
            try {
                // ✅ 병렬 API 호출
                const [categories, types, mounts, cycles] = await Promise.all([
                    fetchAdjustmentCodeName("adjustment_category"),
                    fetchAdjustmentCodeName("adjustment_type"),
                    fetchAdjustmentCodeName("mount_type"),
                    fetchAdjustmentCodeName("adjustment_cycle"),
                ]);

                // ✅ 상태 업데이트 및 기본값 설정
                setAdjustmentCategories(categories || []);
                setAdjustmentTypes(types || []);
                setMountTypes(mounts || []);
                setAdjustmentCycles(cycles || []);

                // ✅ 기본값 설정 (첫 번째 옵션 자동 선택)
                setFormData((prev) => ({
                    ...prev,
                    adjustment_category: categories.length > 0 ? categories[0].code_value : "",
                    adjustment_type: types.length > 0 ? types[0].code_value : "",
                    mount_type: mounts.length > 0 ? mounts[0].code_value : "",
                    adjustment_cycle: cycles.length > 0 ? cycles[0].code_value : "",
                }));
            } catch (error) {
                console.error("조정 옵션 데이터를 가져오는데 실패했습니다:", error);
                setAdjustmentCategories([]);
                setAdjustmentTypes([]);
                setMountTypes([]);
                setAdjustmentCycles([]);
            }
        };

        loadAdjustmentOptions();
    }, []);

    // ✅ 조정 정보 초기 데이터
    const initialFormData = {
        adjustment_code: "account_num", // 고정 값
        adjustment_code_value: acctNum, // 고정 값 (선택한 계정 번호)
        adjustment_category: "", // API로 가져온 옵션
        adjustment_type: "", // 선택 목록 제공
        mount_type: "", // 선택 목록 제공
        mount_value: 0, // 사용자가 입력
        description: "-", // 선택 사항
        adjustment_cycle: "", // 선택 목록 제공
        date_index: yearMonth, // 사용자가 입력
        use_yn: "Y", // boolean toggle
        tax_free_yn: "Y", // boolean toggle
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ 입력 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ 토글 변경 핸들러 (boolean 값 → 'Y'/'N'으로 저장)
    const handleToggleChange = (name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name] === 'Y' ? 'N' : 'Y',
        }));
    };

    // ✅ 조정 정보 저장
    const handleSave = async () => {

        const requiredFields = ["adjustment_category", "adjustment_type", "mount_type", "mount_value", "date_index"];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setErrorMessage(`필수 입력 항목을 확인하세요: ${missingFields.join(", ")}`);
            return;
        }

        try {
            await createAdjustment(formData);
            alert("조정 정보가 추가되었습니다.");
            setFormData(initialFormData);
            setErrorMessage("");
            closeDropdown();
        } catch (error) {
            console.error("Error creating adjustment:", error);
            alert("조정 정보 추가 실패");
        }
    };
    console.log(formData)

    return (
        <div className="relative inline-block float-right">
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="조정 정보 추가" tooltipContent="조정 세부 설정 페이지 이동" tooltipLink="/adjustment" position="left">
                <div className="px-4 py-2 space-y-3">
                    {/* ✅ 고정된 데이터 (조정 대상 구분 & 조정 대상) */}
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-sm font-semibold text-gray-600">조정 대상 구분</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="adjustment_code"*/}
                    {/*        value={formData.adjustment_code}*/}
                    {/*        className="border rounded-md p-2 text-sm bg-gray-200 cursor-not-allowed"*/}
                    {/*        readOnly*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="flex flex-col">*/}
                    {/*    <label className="text-sm font-semibold text-gray-600">조정 대상</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        name="adjustment_code_value"*/}
                    {/*        value={formData.adjustment_code_value}*/}
                    {/*        className="border rounded-md p-2 text-sm bg-gray-200 cursor-not-allowed"*/}
                    {/*        readOnly*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* ✅ Select 드롭다운 목록 */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">조정 구분</label>
                        <select
                            name="adjustment_category"
                            value={formData.adjustment_category}
                            onChange={handleChange}
                            className="border rounded-md p-2 text-sm"
                        >
                            <option value="">선택하세요</option>
                            {adjustmentCategories.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">조정 타입</label>
                        <select name="adjustment_type" value={formData.adjustment_type} onChange={handleChange}
                                className="border rounded-md p-2 text-sm">
                            {adjustmentTypes.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600">금액/요율</label>
                        <select name="mount_type" value={formData.mount_type} onChange={handleChange}
                                className="border rounded-md p-2 text-sm">
                            {mountTypes.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput label="적용 요금" name="mount_value" type="number" value={formData.mount_value}
                               onChange={handleChange} placeholder="5,000" />

                    <FormInput label="설명" name="description" type="text" value={formData.description}
                               onChange={handleChange} placeholder="-" />

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600">적용 횟수</label>
                        <select name="adjustment_cycle" value={formData.adjustment_cycle} onChange={handleChange}
                                className="border rounded-md p-2 text-sm">
                            {adjustmentCycles.map((option) => (
                                <option key={option.code_value} value={option.code_value}>
                                    {option.code_alias}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput label="적용 날짜" name="date_index" type="text" value={formData.date_index}
                               onChange={handleChange} placeholder="202501" />

                    {/* ✅ Toggle 스위치 */}
                    {/*<div className="flex items-center justify-between">*/}
                    {/*    <label className="text-sm font-semibold text-gray-600">사용 여부</label>*/}
                    {/*    <button*/}
                    {/*        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${formData.use_yn ? 'bg-blue-500' : ''}`}*/}
                    {/*        onClick={() => handleToggleChange("use_yn")}*/}
                    {/*    >*/}
                    {/*        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform ${formData.use_yn ? 'translate-x-5' : ''}`}></div>*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-600">부가세 할인 여부</label>
                        <div className="flex flex-row space-x-2 items-center">
                            <span className="text-blue-500">
                                {formData.tax_free_yn === 'Y' ? '부가세 계산 전 조정' : '부가세 계산 후 조정'}
                            </span>
                            <button
                                className={`w-10 h-5 flex items-center transition duration-300 rounded-full p-1 ${formData.tax_free_yn === 'Y' ? 'bg-blue-500' : 'bg-gray-300'}`}
                                onClick={() => handleToggleChange('tax_free_yn')}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.tax_free_yn === 'Y' ? 'translate-x-5' : 'translate-x-0'}`}
                                ></div>
                            </button>
                        </div>
                    </div>

                </div>

                {/* ✅ 오류 메시지 출력 */}
                {errorMessage && <p className="text-red-500 text-sm px-4">{errorMessage}</p>}

                {/* ✅ 액션 버튼 */}
                <div className="flex justify-end p-2 bg-gray-100 rounded-b-md space-x-2">
                    <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Save
                    </button>
                    <button onClick={closeDropdown}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">Close</button>
                </div>
            </DropdownMenu>
        </div>
    );
};

export default AdjustDropdownForm;
