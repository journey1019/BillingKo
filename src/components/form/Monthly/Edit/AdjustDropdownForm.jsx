import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import FormSelect from "@/components/dropdown/FormSelect.jsx";
import { formatDateAddTime, formatNumberWithCommas } from '@/utils/formatHelpers.jsx';
import { LuRefreshCw } from "react-icons/lu";
import AlertBox from '@/components/common/AlertBox';
import { useNavigate } from 'react-router-dom';
import useAdjustmentStore from '@/stores/adjustmentStore';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';

const AdjustDropdownForm = ({ detailData, fetchDetailData, yearMonth }) => {
    const codeMappings = useAdjustmentMappings();
    const {
        adjustmentCategories,
        adjustmentTypes,
        mountTypes,
        adjustmentCycles,
        fetchOptions,
    } = useAdjustmentStore();

    // 변환: 리스트 배열을 "value-label" 형태로 가공
    // const toOptionList = (items) =>
    //     items?.map((item) => ({ value: item.code_value, label: item.code_alias })) || [];
    //
    // return {
    //     adjustmentCategoryOptions: toOptionList(adjustmentCategories),
    //     adjustmentTypeOptions: toOptionList(adjustmentTypes),
    //     mountTypeOptions: toOptionList(mountTypes),
    //     adjustmentCycleOptions: toOptionList(adjustmentCycles),
    // };

    console.log(codeMappings)
    console.log(adjustmentTypes)
    console.log(mountTypes)
    useEffect(() => {
        fetchOptions(); // ✅ 마운트 시 옵션 불러오기
    }, []);

    const navigate = useNavigate();

    console.log(detailData)
    console.log(yearMonth)
    const [alertBox, setAlertBox] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ detailData가 바뀔 때 formData 초기화
    useEffect(() => {
        if (!detailData) return;
        setFormData({
            adjustment_code: "serial_number",
            adjustment_value: detailData.serial_number,
            adjustment_category: Object.keys(codeMappings.adjustment_category)[0] || "",
            adjustment_type: Object.keys(codeMappings.adjustment_type)[0] || "",
            mount_type: Object.keys(codeMappings.mount_type)[0] || "",
            adjustment_fee: 0,
            description: "",
            adjustment_tax_free_yn: "N",
        });
    }, [detailData, codeMappings]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!name) return; // name 없으면 무시

        let cleanedValue = value;

        // 숫자일 경우 쉼표 제거
        if (!isNaN(value.toString().replace(/,/g, ""))) {
            cleanedValue = value.toString().replace(/,/g, "");
        }

        // 날짜일 경우 시:분까지만 입력되었으면 ":00" 추가
        if ((name === "activationDate" || name === "deactivationDate") && value.length === 16) {
            cleanedValue = `${value}:00`;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: cleanedValue,
        }));
    };


    // ✅ 저장
    const handleSave = async () => {
        try {
            // 1. adjustment_info를 새로 만들거나 기존 것에 추가
            const newAdjustmentInfo = {
                adjustment_code: formData.adjustment_code,
                adjustment_value: formData.adjustment_value,
                adjustment_category: formData.adjustment_category,
                adjustment_type: formData.adjustment_type,
                mount_type: formData.mount_type,
                adjustment_fee: Number(formData.adjustment_fee),
                description: formData.description,
                adjustment_tax_free_yn: formData.adjustment_tax_free_yn,
            };

            const updatedPayment = {
                ...(detailData.payment || {}),
                adjustment_info: [
                    ...(detailData.payment?.adjustment_info || []),
                    newAdjustmentInfo,
                ]
            };

            // 2. 전체 detailData에서 필요한 값만 골라서 재구성
            const { data_index, user_id, update_date, update_version, ...rest } = detailData;

            const updatedPayload = {
                ...rest,
                payment: updatedPayment,
            };

            // 3. PUT 요청
            await saveKOMonthlyDetailData(data_index, updatedPayload);

            setAlertBox({
                type: "success",
                title: "저장 성공",
                message: "데이터가 성공적으로 저장되었습니다.",
            });

            closeDropdown();
        } catch (error) {
            console.error("Error updating data:", error);
            setAlertBox({
                type: "danger",
                title: "저장 실패",
                message: "서버에 데이터를 저장하지 못했습니다.",
            });
        }

        setTimeout(() => setAlertBox(null), 3000);
    };


    // ✅ 토글 변경 핸들러 (boolean 값 → 'Y'/'N'으로 저장)
    const handleToggleChange = (name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name] === 'Y' ? 'N' : 'Y',
        }));
    };

    return (
        <div className="relative inline-block float-right">
            {/* ✅ AlertBox */}
            {alertBox && (
                <AlertBox type={alertBox.type} title={alertBox.title} message={alertBox.message} />
            )}

            <button
                className="hover:text-blue-500 pr-2"
                onClick={() => { window.location.href = `/ko_monthly?yearMonth=${yearMonth}&serial=${detailData.serial_number}` }}
            >
                <LuRefreshCw />
            </button>

            {/* ✅ 수정 버튼 */}
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>

            {/* ✅ 드롭다운 */}
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="단말 조정 정보 추가" position="left">
                <div className="px-4 py-2 space-y-3">
                    {/*<FormSelect*/}
                    {/*    label="조정 구분"*/}
                    {/*    name="adjustment_category"*/}
                    {/*    value={formData.adjustment_category}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    options={codeMappings.adjustmentCategoryOptions}*/}
                    {/*/>*/}

                    {[
                        { label: "조정 유형", name: "adjustment_code", type: "select",
                            dataList: Object.entries(codeMappings.adjustment_code).map(([value, label]) => ({ code_value: value, code_alias: label })),
                            disabled: true
                        },
                        { label: "조정 대상", name: "adjustment_value", type: "text", disabled: true },
                        { label: "조정 분류", name: "adjustment_category", type: "select",
                            dataList: Object.entries(codeMappings.adjustment_category).map(([value, label]) => ({
                                code_value: value,
                                code_alias: label,
                            })),
                            placeholder: "미납/과오납"
                        },
                        { label: "조정 타입", name: "adjustment_type", type: "select",
                            dataList: Object.entries(codeMappings.adjustment_type).map(([value, label]) => ({
                                code_value: value,
                                code_alias: label,
                            })),
                            placeholder: "할인/가산"
                        },
                        { label: "요금 기준", name: "mount_type", type: "select",
                            dataList: Object.entries(codeMappings.mount_type).map(([value, label]) => ({
                                code_value: value,
                                code_alias: label,
                            })),
                            placeholder: "요금/요율"
                        },
                        { label: "조정 금액", name: "adjustment_fee", type: "text", placeholder: "0" },
                        { label: "설명", name: "description", type: "text", placeholder: "-" },,
                    ].map((field, index) => (
                        <FormInput
                            key={index}
                            {...field}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            direct={field.type}
                        />
                    ))}
                </div>

                <div className="flex flex-row items-center px-4 py-2 space-x-2">
                    <label className="text-xs 2xl:text-sm font-semibold text-gray-600">부가세 할인 여부</label>
                    <div className="flex flex-row space-x-2 items-center text-center align-center">
                            <span className="text-blue-500">
                                {formData.tax_free_yn === 'Y' ? '부가세 계산 후 조정' : '부가세 계산 전 조정'}
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

                {/* ✅ 액션 버튼 */}
                <div className="flex justify-end p-2 bg-gray-100 rounded-b-md space-x-2">
                    <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
                        Save
                    </button>
                    <button onClick={closeDropdown} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">
                        Close
                    </button>
                </div>
            </DropdownMenu>
        </div>
    );
};

export default AdjustDropdownForm;
