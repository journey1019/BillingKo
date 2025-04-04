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
import { renderStandardInputField } from '@/utils/renderHelpers'
import { usePPIDList } from '@/selectors/usePriceSelectors.js';
import usePriceStore from '@/stores/priceStore';

const DeviceEditPage = () => {
    const { serial_number } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(defaultDeviceFormData);

    const { fetchPriceData } = usePriceStore();
    const acctNumList = useAcctNumList();
    const devProfileList = useDevProfileList();
    const devModelNameList = useDevModelNameList();
    const pricePPIDList = usePPIDList();

    useEffect(() => {
        fetchPriceData();
    }, [])

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

                    {[
                        { id: 'serial_number', label: '단말기', type: 'text', required: true },
                        { id: 'acct_num', label: '고객번호', type: 'text', placeholder: 'KO_99999',  dataList: acctNumList, required: true },
                        { id: 'profile_id', label: 'Profile ID', type: 'text =', placeholder: '0',  dataList: devProfileList, required: true },
                        { id: 'PPID', label: 'PPID', type: 'text', placeholder: '999', required: true, dataList: pricePPIDList },
                        { id: 'model_name', label: '모델명', type: 'text', placeholder: 'ST6100', dataList: devModelNameList, required: true },
                        { id: 'internet_mail_id', label: 'ORBCOMM 별칭', type: 'text' },
                        { id: 'alias', label: '별칭', type: 'text' },
                        { id: 'activated', label: '활성화 날짜', type: 'date', required: true },
                        { id: 'deactivated', label: '비활성화 날짜', type: 'date' },
                        { id: 'remarks', label: '비고', type: 'text' }
                    ].map(({ id, label, type, dataList, placeholder, required, readOnly }) =>
                        renderStandardInputField(
                            id,
                            label,
                            type,
                            formData[id],
                            handleChange,
                            dataList,
                            required,
                            readOnly || false,
                            "", // 에러 메시지 있으면 여기에
                            placeholder
                        )
                    )}

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