import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateDevice, fetchDevicePart } from '@/service/deviceService.js';
import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { Switch } from "@mui/material";
import { formatFormDate } from "@/utils/formatHelpers";
import { defaultDeviceFormData } from '@/contents/deviceFormDefault.js';
import { useAcctNumList } from '@/selectors/useAccountSelectors.js';
import { useDevProfileList, useDevModelNameList } from '@/selectors/useDeviceSelectors.js';

const DeviceEditPage = () => {
    const { serial_number } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(defaultDeviceFormData);

    const acctNumList = useAcctNumList();
    const devProfileList = useDevProfileList();
    const devModelNameList = useDevModelNameList();

    useEffect(() => {
        const loadDeviceData = async () => {
            try {
                const device = await fetchDevicePart(serial_number);
                setFormData({
                    ...device,
                    activated: formatFormDate(device.activated),
                    deactivated: formatFormDate(device.deactivated),
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
    console.log(formData)

    // 빈 문자열을 null로 변환하는 함수
    const convertEmptyToNull = (data) => {
        const updatedData = { ...data };
        console.log(updatedData)
        // ✅ 제외할 필드를 명시적으로 제거
        delete updatedData.update_date;
        delete updatedData.update_user_id;
        delete updatedData.regist_date;
        delete updatedData.regist_user_id;

        // ✅ null로 변환할 필드
        ["deactivated", "internet_mail_id", "alias", "remarks"].forEach((field) => {
            if (!updatedData[field] || updatedData[field].trim?.() === "") {
                updatedData[field] = null;
            }
        });
        console.log(updatedData)

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
                    {/* Use Y/N */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label className="col-start-1 text-sm font-medium text-gray-900">사용 여부 *</label>
                        <div className="col-span-2 col-start-2 flex items-center space-x-4">
                            <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                            <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                    {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                    {/*    <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">사용 여부 *</label>*/}
                    {/*    <div className="col-span-2 col-start-2 flex items-center space-x-4">*/}
                    {/*        <label className="relative inline-flex items-center cursor-pointer">*/}
                    {/*            <input*/}
                    {/*                type="checkbox"*/}
                    {/*                checked={formData.use_yn === 'Y'}*/}
                    {/*                onChange={handleToggleChange}*/}
                    {/*                className="sr-only peer"*/}
                    {/*            />*/}
                    {/*            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>*/}
                    {/*            <div className="absolute w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all"></div>*/}
                    {/*        </label>*/}
                    {/*        <span className="text-sm text-gray-700">*/}
                    {/*        {formData.use_yn === 'Y' ? 'Yes' : 'No'}*/}
                    {/*    </span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Serial Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="serial_number" className="col-start-1 text-sm font-medium text-gray-900">
                            단말기
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="serial_number"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            readOnly
                            required
                        />
                    </div>

                    {/* Account Number */}
                    {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                    {/*    <label htmlFor="acct_num" className="col-start-1 text-sm font-medium text-gray-900">고객*/}
                    {/*        번호</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        id="acct_num"*/}
                    {/*        name="acct_num"*/}
                    {/*        value={formData.acct_num}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"*/}
                    {/*        placeholder="KO_99999"*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Account Number (Select + Free Input) */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="acct_num" className="col-start-1 text-sm font-medium text-gray-900">
                            고객 번호
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="acct_num"
                                name="acct_num"
                                list="acct-num-options"
                                value={formData.acct_num ?? ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="KO_99999"
                                required
                            />
                            <datalist id="acct-num-options">
                                {acctNumList?.map((num, index) => (
                                    <option key={index} value={num} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Profile ID */}
                    {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                    {/*    <label htmlFor="profile_id" className="col-start-1 text-sm font-medium text-gray-900">Profile*/}
                    {/*        ID</label>*/}
                    {/*    <input*/}
                    {/*        type="number"*/}
                    {/*        id="profile_id"*/}
                    {/*        name="profile_id"*/}
                    {/*        value={formData.profile_id}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="profile_id" className="col-start-1 text-sm font-medium text-gray-900">
                            Profile ID
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="profile_id"
                                name="profile_id"
                                list="profile_id-options"
                                value={formData.profile_id ?? ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="KO_99999"
                                required
                            />
                            <datalist id="profile_id-options">
                                {devProfileList?.map((num, index) => (
                                    <option key={index} value={num} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* PPID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="ppid" className="col-start-1 text-sm font-medium text-gray-900">
                            PPID
                            <span className="text-red-500">*</span>
                        </label>
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
                    {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                    {/*    <label htmlFor="model_name"*/}
                    {/*           className="col-start-1 text-sm font-medium text-gray-900">모델명</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        id="model_name"*/}
                    {/*        name="model_name"*/}
                    {/*        value={formData.model_name}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="model_name" className="col-start-1 text-sm font-medium text-gray-900">
                            모델명
                        </label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="model_name"
                                name="model_name"
                                list="model_name-options"
                                value={formData.model_name ?? ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="KO_99999"
                                required
                            />
                            <datalist id="model_name-options">
                                {devModelNameList?.map((num, index) => (
                                    <option key={index} value={num} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Internet Mail ID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="internet_mail_id" className="col-start-1 text-sm font-medium text-gray-900">ORBCOMM
                            별칭</label>
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
                        <label htmlFor="alias" className="col-start-1 text-sm font-medium text-gray-900">별칭</label>
                        <input
                            type="text"
                            id="alias"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Activated */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="activated" className="col-start-1 text-sm font-medium text-gray-900">
                            활성화 날짜
                            <span className="text-red-500">*</span>
                        </label>
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
                        <label htmlFor="deactivated" className="col-start-1 text-sm font-medium text-gray-900">비활성화
                            날짜</label>
                        <input
                            type="date"
                            id="deactivated"
                            name="deactivated"
                            value={formData.deactivated}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Remarks */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="remarks" className="col-start-1 text-sm font-medium text-gray-900">비고</label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>


                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Submit
                    </button>
                    <button type="button" onClick={() => navigate("/devices")}
                            className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default DeviceEditPage;
