import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateDevice, fetchDevicePart } from '@/service/deviceService.js';
import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

const DeviceEditPage = () => {
    const { serial_number } = useParams();
    const navigate = useNavigate();
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
        remarks: "",
        use_yn: "",
        regist_date: "",
        update_date: "",
        regist_user_id: "",
        update_user_id: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Convert datetime string to date format (YYYY-MM-DD)
    // Input Value 값에 넣어주기 위함
    const formatDate = (datetime) => {
        if (!datetime) return "";
        return new Date(datetime).toISOString().slice(0, 10);
    };

    useEffect(() => {
        const loadDeviceData = async () => {
            try {
                const device = await fetchDevicePart(serial_number);
                setFormData({
                    ...device,
                    activated: formatDate(device.activated),
                    deactivated: formatDate(device.deactivated),
                    regist_date: formatDate(device.regist_date),
                    update_date: formatDate(device.update_date),
                });
            } catch (err) {
                setError("Failed to fetch device data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadDeviceData();
    }, [serial_number]);

    // 빈 문자열을 null로 변환하는 함수
    const convertEmptyToNull = (data) => {
        const updatedData = { ...data };
        ["deactivated", "internet_mail_id", "alias", "remarks"].forEach((field) => {
            if (!updatedData[field] || updatedData[field].trim() === "") {
                updatedData[field] = null;
            }
        });
        return updatedData;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Yes / No
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = convertEmptyToNull(formData);

        try {
            console.log("PUT 요청 보낼 데이터:", updatedData);
            await updateDevice(serial_number, updatedData);
            alert("Device updated successfully!");
            navigate("/devices");
        } catch (err) {
            console.error(err);
            setError("Failed to update device");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    console.log(formData)
    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">Device Edit Data</h1>
                    <button onClick={() => navigate('/devices')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                    {/* Serial Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="serial_number" className="col-start-1 text-sm font-medium text-gray-900">Serial Number</label>
                        <input
                            type="text"
                            id="serial_number"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            readOnly
                        />
                    </div>

                    {/* Account Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="acct_num" className="col-start-1 text-sm font-medium text-gray-900">Account Number</label>
                        <input
                            type="text"
                            id="acct_num"
                            name="acct_num"
                            value={formData.acct_num}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="KO_99999"
                            required
                        />
                    </div>

                    {/* Profile ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="profile_id" className="col-start-1 text-sm font-medium text-gray-900">Profile ID</label>
                        <input
                            type="number"
                            id="profile_id"
                            name="profile_id"
                            value={formData.profile_id}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Activated */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="activated" className="col-start-1 text-sm font-medium text-gray-900">Activated</label>
                        <input
                            type="date"
                            id="activated"
                            name="activated"
                            value={formData.activated}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Deactivated */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="deactivated" className="col-start-1 text-sm font-medium text-gray-900">Deactivated</label>
                        <input
                            type="date"
                            id="deactivated"
                            name="deactivated"
                            value={formData.deactivated}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>


                    {/* PPID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="ppid" className="col-start-1 text-sm font-medium text-gray-900">PPID</label>
                        <input
                            type="number"
                            id="ppid"
                            name="ppid"
                            value={formData.ppid}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Model Name */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="model_name" className="col-start-1 text-sm font-medium text-gray-900">Model Name</label>
                        <input
                            type="text"
                            id="model_name"
                            name="model_name"
                            value={formData.model_name}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Internet Mail ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="internet_mail_id" className="col-start-1 text-sm font-medium text-gray-900">Internet Mail ID</label>
                        <input
                            type="text"
                            id="internet_mail_id"
                            name="internet_mail_id"
                            value={formData.internet_mail_id}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Alias */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="alias" className="col-start-1 text-sm font-medium text-gray-900">Alias</label>
                        <input
                            type="text"
                            id="alias"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="remarks" className="col-start-1 text-sm font-medium text-gray-900">Remarks</label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Use Y/N */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">Use</label>
                        <div className="col-span-2 col-start-2 flex items-center space-x-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.use_yn === 'Y'}
                                    onChange={handleToggleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                                <div className="absolute w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all"></div>
                            </label>
                            <span className="text-sm text-gray-700">
                            {formData.use_yn === 'Y' ? 'Yes' : 'No'}
                        </span>
                        </div>
                    </div>

                    {/* Register Date */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="regist_date" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Register Date
                        </label>
                        <input
                            type="date"
                            id="regist_date"
                            name="regist_date"
                            value={formData.regist_date}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Update Date */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="regist_dateupdate_date" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Update Date
                        </label>
                        <input
                            type="date"
                            id="update_date"
                            name="update_date"
                            value={formData.update_date}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Registration User ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="regist_user_id" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Registration User ID
                        </label>
                        <input
                            type="text"
                            id="regist_user_id"
                            value={formData.regist_user_id}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder=""
                        />
                    </div>

                    {/* Update User ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="update_user_id" className="col-start-1 col-end-1 text-sm font-medium text-gray-900">
                            Update User ID
                        </label>
                        <input
                            type="text"
                            id="update_user_id"
                            value={formData.update_user_id}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder=""
                        />
                    </div>



                    <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Submit
                    </button>
                    <button type="button" onClick={() => navigate("/devices")} className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default DeviceEditPage;
