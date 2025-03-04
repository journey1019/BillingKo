import React, { useState } from 'react';
import Dropdown from '@/components/layout/button/Dropdown.jsx';
import { MdEdit } from 'react-icons/md';

const BasicDropdownForm = () => {
    // ✅ 입력값 상태 관리
    const [formData, setFormData] = useState({
        dataIndex: 9897,
        profileId: 60001406,
        accountNumber: "KO_99999",
        alias: "T-AIS (제주 광해악)",
        serialNumber: "01377867SKYB9B4",
        ppid: 999,
        activationDate: "2018-08-12T15:00:00",
        deactivationDate: "1970-01-01T00:00:00",
    });

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            {/* ✅ 드롭다운 사용 예제 */}
            <div className="relative inline-block float-right">
                {/* ✅ 오른쪽 정렬 드롭다운 */}
                <Dropdown trigger={<MdEdit />} position="right">
                    {/* ✅ 헤더 */}
                    <div className="flex rounded-t-md p-2 border-b">
                        <span className="font-semibold">Billing Modify</span>
                    </div>

                    {/* ✅ 폼 입력 영역 */}
                    <div className="p-4 space-y-3">
                        {[
                            { label: "Data Index", name: "dataIndex", type: "number" },
                            { label: "Profile ID", name: "profileId", type: "number" },
                            { label: "Account Number", name: "accountNumber", type: "text" },
                            { label: "Alias", name: "alias", type: "text" },
                            { label: "Serial Number", name: "serialNumber", type: "text" },
                            { label: "PPID", name: "ppid", type: "number" },
                            { label: "Activation Date", name: "activationDate", type: "datetime-local" },
                            { label: "Deactivation Date", name: "deactivationDate", type: "datetime-local" },
                        ].map((field, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-600">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* ✅ 액션 버튼 */}
                    <div className="flex justify-end p-2 space-x-2 bg-gray-100 rounded-b-md">
                        <button className="px-3 py-1 border border-gray-700 rounded-md text-sm">Save</button>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Close</button>
                    </div>
                </Dropdown>
            </div>
        </>
    );
};

export default BasicDropdownForm;
