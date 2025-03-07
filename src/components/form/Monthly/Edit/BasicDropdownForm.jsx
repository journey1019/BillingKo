import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '@/components/dropdown/Dropdown.jsx';
import { MdEdit } from 'react-icons/md';
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import { formatDateAddTime } from '@/utils/formatHelpers.jsx';

const BasicDropdownForm = ({ detailData }) => {
    console.log(detailData)

    // ✅ Dropdown
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ 초기 formData 설정 (detailData의 첫 번째 객체 기준)
    const initialData = detailData || {};
    const [formData, setFormData] = useState({
        profileId: initialData.profile_id || "",
        accountNumber: initialData.acct_num || "",
        alias: initialData.alias || "",
        serialNumber: initialData.serial_number || "",
        ppid: initialData.ppid || "",
        activationDate: initialData.activate_date ? initialData.activate_date.split("T").join(" ") : "",
        deactivationDate: initialData.deactivate_date ? initialData.deactivate_date.split("T").join(" ") : "",
    });
    console.log(initialData)

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "activationDate" || name === "deactivationDate") {
            // ✅ 초 정보가 없는 경우, ":00" 추가하여 저장
            const formattedValue = value.length === 16 ? `${value}:00` : value;
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // ✅ Save 버튼 클릭 시 API 호출
    const handleSave = async () => {
        try {
            // ✅ detailData(배열)에서 첫 번째 객체를 기반으로 새로운 데이터 생성
            const updatedData = {
                ...initialData, // 기존 데이터 유지
                profile_id: formData.profileId,
                acct_num: formData.accountNumber,
                alias: formData.alias,
                serial_number: formData.serialNumber,
                ppid: formData.ppid,
                activate_date: formatDateAddTime(formData.activationDate),
                deactivate_date: formatDateAddTime(formData.deactivationDate),
            };

            // ✅ 불필요한 필드 제거 (data_index, user_id, update_date, update_version)
            const { data_index, user_id, update_date, update_version, ...payload } = updatedData;
            console.log(payload)
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
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="Basic Info Modify">
                <div className="px-4 py-2 space-y-3">
                    {[
                        // { label: "Profile ID", name: "profileId", type: "number" },
                        // { label: "Account Number", name: "accountNumber", type: "text" },
                        // { label: "Alias", name: "alias", type: "text" },
                        // { label: "Serial Number", name: "serialNumber", type: "text" },
                        // { label: "PPID", name: "ppid", type: "number" },
                        { label: "Activation Date", name: "activationDate", type: "datetime-local" },
                        { label: "Deactivation Date", name: "deactivationDate", type: "datetime-local" },
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

            {/*/!* ✅ 오른쪽 정렬 드롭다운 *!/*/}
            {/*<Dropdown trigger={<MdEdit />} position="right">*/}
            {/*    /!* ✅ 헤더 *!/*/}
            {/*    <div className="flex rounded-t-md p-2 border-b">*/}
            {/*        <span className="font-semibold">Billing Modify</span>*/}
            {/*    </div>*/}

            {/*    /!* ✅ 폼 입력 영역 *!/*/}
            {/*    <div className="p-4 space-y-3">*/}
            {/*        {[*/}
            {/*            { label: "Data Index", name: "dataIndex", type: "number" },*/}
            {/*            { label: "Profile ID", name: "profileId", type: "number" },*/}
            {/*            { label: "Account Number", name: "accountNumber", type: "text" },*/}
            {/*            { label: "Alias", name: "alias", type: "text" },*/}
            {/*            { label: "Serial Number", name: "serialNumber", type: "text" },*/}
            {/*            { label: "PPID", name: "ppid", type: "number" },*/}
            {/*            { label: "Activation Date", name: "activationDate", type: "datetime-local" },*/}
            {/*            { label: "Deactivation Date", name: "deactivationDate", type: "datetime-local" },*/}
            {/*        ].map((field, index) => (*/}
            {/*            <div key={index} className="flex flex-col">*/}
            {/*                <label className="text-sm font-semibold text-gray-600">{field.label}</label>*/}
            {/*                <input*/}
            {/*                    type={field.type}*/}
            {/*                    name={field.name}*/}
            {/*                    value={formData[field.name]}*/}
            {/*                    onChange={handleChange}*/}
            {/*                    className="border rounded-md p-2 text-sm"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*    /!* ✅ 액션 버튼 *!/*/}
            {/*    <div className="flex justify-end p-2 space-x-2 bg-gray-100 rounded-b-md">*/}
            {/*        <button className="px-3 py-1 border border-gray-700 rounded-md text-sm">Save</button>*/}
            {/*        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Close</button>*/}
            {/*    </div>*/}
            {/*</Dropdown>*/}
        </div>
    );
};

export default BasicDropdownForm;
