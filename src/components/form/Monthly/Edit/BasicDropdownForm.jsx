import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import FormInput from "@/components/dropdown/FormInput.jsx";
import { formatDateAddTime } from '@/utils/formatHelpers.jsx';
import { LuRefreshCw } from "react-icons/lu";
import AlertBox from '@/components/common/AlertBox';

const BasicDropdownForm = ({ detailData, fetchDetailData }) => {
    const [alertBox, setAlertBox] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // ✅ detailData가 바뀔 때 formData 초기화
    useEffect(() => {
        if (!detailData) return;
        setFormData({
            profileId: detailData.profile_id || "",
            accountNumber: detailData.acct_num || "",
            alias: detailData.alias || "",
            serialNumber: detailData.serial_number || "",
            ppid: detailData.ppid || "",
            activationDate: detailData.activate_date ? detailData.activate_date.split("T").join(" ") : "",
            deactivationDate: detailData.deactivate_date ? detailData.deactivate_date.split("T").join(" ") : "",
        });
    }, [detailData]);

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedValue =
            (name === "activationDate" || name === "deactivationDate") && value.length === 16
                ? `${value}:00`
                : value;

        setFormData(prev => ({ ...prev, [name]: updatedValue }));
    };

    // ✅ 저장
    const handleSave = async () => {
        try {
            const updatedData = {
                ...detailData, // 최신 detailData 기준
                profile_id: formData.profileId,
                acct_num: formData.accountNumber,
                alias: formData.alias,
                serial_number: formData.serialNumber,
                ppid: formData.ppid,
                activate_date: formatDateAddTime(formData.activationDate),
                deactivate_date: formatDateAddTime(formData.deactivationDate),
            };

            const { data_index, user_id, update_date, update_version, ...payload } = updatedData;

            await saveKOMonthlyDetailData(detailData.data_index, payload);

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

    // ✅ 새로고침
    const handleRefresh = async () => {
        if (!fetchDetailData) return;
        try {
            await fetchDetailData();
            setAlertBox({
                type: "info",
                title: "데이터 불러오기 성공!",
                message: "수정한 데이터를 성공적으로 불러왔습니다.",
            });
        } catch (error) {
            setAlertBox({
                type: "danger",
                title: "데이터 불러오기 실패!",
                message: "데이터를 다시 불러오는 데 실패했습니다.",
            });
        }

        setTimeout(() => setAlertBox(null), 3000);
    };

    return (
        <div className="relative inline-block float-right">
            {/* ✅ AlertBox */}
            {alertBox && (
                <AlertBox type={alertBox.type} title={alertBox.title} message={alertBox.message} />
            )}

            {/* ✅ Refresh 버튼 */}
            <button className="hover:text-blue-500 pr-2" onClick={handleRefresh}>
                <LuRefreshCw />
            </button>

            {/* ✅ 수정 버튼 */}
            <button className="hover:text-gray-500" onClick={toggleDropdown}>
                <MdEdit />
            </button>

            {/* ✅ 드롭다운 */}
            <DropdownMenu isOpen={isOpen} closeDropdown={closeDropdown} title="Basic Info Modify">
                <div className="px-4 py-2 space-y-3">
                    {[
                        { label: "Activation Date", name: "activationDate", type: "datetime-local" },
                        { label: "Deactivation Date", name: "deactivationDate", type: "datetime-local" },
                    ].map((field, index) => (
                        <FormInput
                            key={index}
                            {...field}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
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
