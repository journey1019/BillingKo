import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createDevice } from '@/service/deviceService.js';

import { IoMdClose } from 'react-icons/io';

const DeviceNewPage = () => {
    const navigate = useNavigate();

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        serial_number: "",
        acct_num: "",
        profile_id: "",
        activated: "",
        deactivated: "",
        ppid: "",
        model_name: "",
        internet_mail_id: "",
        alias: "",
        remarks: ""
    });

    const [error, setError] = useState(null);

    // 폼 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // 빈 값을 null로 변환하는 함수
    const convertEmptyToNull = (data) => {
        const updatedData = { ...data };
        ["deactivated", "internet_mail_id", "alias", "remarks"].forEach((field) => {
            if (!updatedData[field] || updatedData[field].trim() === "") {
                updatedData[field] = null;
            }
        });
        return updatedData;
    };

    const validateFormData = () => {
        const requiredFields = ["serial_number", "acct_num", "profile_id", "activated", "ppid", "model_name"];

        for (const field of requiredFields) {
            if (!formData[field]) {
                return `The field "${field}" is required.`;
            }
        }
        return null;
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        const confirmedData = convertEmptyToNull(formData);

        const confirmMessage = `
            Please confirm the following details:
            Serial Number: ${confirmedData.serial_number}
            Account Number: ${confirmedData.acct_num}
            Profile ID: ${confirmedData.profile_id}
            Activated: ${confirmedData.activated}
            Deactivated: ${confirmedData.deactivated}
            PPID: ${confirmedData.ppid}
            Model Name: ${confirmedData.model_name}
            Internet Mail ID: ${confirmedData.internet_mail_id}
            Alias: ${confirmedData.alias}
            Remarks: ${confirmedData.remarks}
        `;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await createDevice(confirmedData);
            alert("Device successfully created.");
            navigate("/devices");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create device.");
        }
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Device New Data</h1>

                    {/* 페이지 이동 */}
                    <button onClick={() => navigate('/devices')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                    {/* Serial Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="serial_number" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            id="serial_number"
                            value={formData.serial_number}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="01680651SKYD374"
                            required
                        />
                    </div>

                    {/* Account Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="acct_num" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Account Number
                        </label>
                        <input
                            type="text"
                            id="acct_num"
                            value={formData.acct_num}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="KO_99999"
                            required
                        />
                    </div>

                    {/* Profile ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="profile_id" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Profile ID
                        </label>
                        <input
                            type="number"
                            id="profile_id"
                            value={formData.profile_id}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="60001406"
                            required
                        />
                    </div>

                    {/* Activated */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="activated" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Activated
                        </label>
                        <input
                            type="date"
                            id="activated"
                            value={formData.activated}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Deactivated */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="deactivated" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Deactivated
                        </label>
                        <input
                            type="date"
                            id="deactivated"
                            value={formData.deactivated}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* PPID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="ppid" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            PPID
                        </label>
                        <input
                            type="number"
                            id="ppid"
                            value={formData.ppid}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Model Name */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="model_name" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Model Name
                        </label>
                        <input
                            type="text"
                            id="model_name"
                            value={formData.model_name}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="ST6100"
                            required
                        />
                    </div>

                    {/* Internet Mail ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="internet_mail_id" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Internet Mail ID
                        </label>
                        <input
                            type="text"
                            id="internet_mail_id"
                            value={formData.internet_mail_id}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="example@mail.com"
                        />
                    </div>

                    {/* Alias */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="alias" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Alias
                        </label>
                        <input
                            type="text"
                            id="alias"
                            value={formData.alias}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="Device Alias"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="remarks" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Remarks
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="Remarks"
                        />
                    </div>

                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Submit
                    </button>
                    <button type="button"
                            onClick={() => navigate("/devices")}
                            className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default DeviceNewPage;
