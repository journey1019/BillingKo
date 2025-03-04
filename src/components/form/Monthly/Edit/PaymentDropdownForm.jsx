import React, { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import { formatDateAddTime } from "@/utils/formatHelpers.jsx";

const BasicDropdownForm = ({ detailData }) => {
    console.log("Received Detail Data:", detailData);

    // ✅ Dropdown 상태 관리
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ 초기 formData 설정 (빈 값, 0은 유지)
    const [formData, setFormData] = useState({
        basic_fee: "",
        final_fee: "",
        total_fee: "",
        subscribe_fee: "",
        add_use_fee: "",
        cut_off_fee: "",
        modification_fee: "",
    });

    // ✅ `detailData.payment`가 변경될 때 `formData`를 업데이트
    useEffect(() => {
        if (detailData?.payment) {
            setFormData((prevState) => ({
                ...prevState,
                basic_fee: detailData.payment.basic_fee ?? "",
                final_fee: detailData.payment.final_fee ?? "",
                total_fee: detailData.payment.total_fee ?? "",
                subscribe_fee: detailData.payment.subscribe_fee ?? "",
                add_use_fee: detailData.payment.add_use_fee ?? "",
                cut_off_fee: detailData.payment.cut_off_fee ?? "",
                modification_fee: detailData.payment.modification_fee ?? "",
            }));
        }
    }, [detailData]); // ✅ detailData가 변경될 때만 실행

    console.log("Updated Form Data:", formData);

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Save 버튼 클릭 시 API 호출
    const handleSave = async () => {
        try {
            const updatedData = {
                ...detailData,
                // ✅ payment 내부의 값 업데이트
                payment: {
                    ...detailData.payment,
                    basic_fee: formData.basic_fee,
                    final_fee: formData.final_fee,
                    total_fee: formData.total_fee,
                    subscribe_fee: formData.subscribe_fee,
                    add_use_fee: formData.add_use_fee,
                    cut_off_fee: formData.cut_off_fee,
                    modification_fee: formData.modification_fee,
                },
            };

            // ✅ 불필요한 필드 제거
            const { data_index, user_id, update_date, update_version, ...payload } = updatedData;

            console.log("Sending payload:", payload);

            // ✅ API 요청 실행
            await saveKOMonthlyDetailData(detailData.data_index, payload);

            alert("Data successfully updated!");
            closeDropdown();

            // ✅ 저장 성공 후 '/ko_monthly' 페이지 새로고침
            window.location.href = "/ko_monthly";
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Failed to update data.");
        }
    };

    return (
        <div className="relative inline-block float-right">
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="Billing Information Modify">
                <div className="px-4 py-2 space-y-3">
                    {[
                        { label: "Basic Fee", name: "basic_fee", type: "number" },
                        { label: "Final Fee", name: "final_fee", type: "number" },
                        { label: "Total Fee", name: "total_fee", type: "number" },
                        { label: "Subscribe Fee", name: "subscribe_fee", type: "number" },
                        { label: "Additional Use Fee", name: "add_use_fee", type: "number" },
                        { label: "Cut-Off Fee", name: "cut_off_fee", type: "number" },
                        { label: "Modification Fee", name: "modification_fee", type: "number" },
                    ].map((field, index) => (
                        <FormInput key={index} {...field} value={formData[field.name]} onChange={handleChange} />
                    ))}
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

export default BasicDropdownForm;
