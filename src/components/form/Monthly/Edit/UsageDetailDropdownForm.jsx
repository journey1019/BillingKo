import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import { LuRefreshCw } from "react-icons/lu";


const UsageDetailDropdownForm = ({ detailData, fetchDetailData }) => {
    console.log(detailData);

    // ✅ Dropdown 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ 초기 formData 설정
    const initialData = detailData || {};
    const [formData, setFormData] = useState({
        free_bytes: initialData.free_bytes || "",
        use_period: initialData.use_period || "",
        use_percent_of_month: initialData.use_percent_of_month || "",
        use_byte_total: initialData.use_byte_total || "",
    });

    console.log("Initial Data:", initialData);

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // ✅ Save 버튼 클릭 시 API 호출
    const handleSave = async () => {
        try {
            const updatedData = {
                ...detailData,
                free_bytes: formData.free_bytes,
                use_period: formData.use_period,
                use_percent_of_month: formData.use_percent_of_month,
                use_byte_total: formData.use_byte_total,
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

    const handleRefresh = async () => {
        if(!fetchDetailData) return;
        try {
            await fetchDetailData();
            alert("최신 데이터로 갱신되었습니다.");
        } catch(error) {
            alert("갱신 중 오류가 발생했습니다.")
        }
    }

    return (
        <div className="relative inline-block float-right">
            <button className="hover:text-blue-500 pr-2" onClick={handleRefresh}>
                <LuRefreshCw />
            </button>
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="Usage Details Modify">
                <div className="px-4 py-2 space-y-3">
                    {[
                        { label: "Free Bytes", name: "free_bytes", type: "number" },
                        { label: "Use Period", name: "use_period", type: "text" },
                        { label: "Use Percent of Month", name: "use_percent_of_month", type: "number" },
                        { label: "Use Byte Total", name: "use_byte_total", type: "number" },
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

export default UsageDetailDropdownForm;
