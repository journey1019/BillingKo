import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { createDevice } from '@/service/deviceService'; // ✅ 추가
import useDeviceFormStore from '@/stores/deviceFormStore';
import useAccountStore from '@/stores/accountStore';
import usePriceStore from '@/stores/priceStore.js';
import { useAcctNumList } from '@/selectors/useAccountSelectors.js';
import { usePPIDList } from '@/selectors/usePriceSelectors.js';
import { useDevModelNameList } from '@/selectors/useDeviceSelectors.js';
import useDeviceStore from '@/stores/deviceStore.js';
import { useSerialNumberList } from '@/selectors/useDeviceSelectors.js'
import { renderStandardInputField } from '@/utils/renderHelpers.jsx';

import { Switch } from "@mui/material";
import { IoMdClose } from 'react-icons/io';
import DeviceNewFile from '@/components/form/Device/DeviceNewFile';


const DeviceNewPage = () => {
    const navigate = useNavigate();
    const {
        formData,
        setDeviceField
    } = useDeviceFormStore();

    const { fetchAccountData } = useAccountStore();
    const { fetchPriceData } = usePriceStore();
    const { fetchDeviceData } = useDeviceStore();

    const serialNumberList = useSerialNumberList();

    const acctNumList = useAcctNumList();
    const pricePpidList = usePPIDList();
    const deviceModelList = useDevModelNameList();

    // 초기 Fetch
    useEffect(() => {
        fetchAccountData();
        fetchPriceData();
        fetchDeviceData();
    }, []);

    const [serialNumberError, setSerialNumberError] = useState("");
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const val = id === 'ppid' ? Number(value) : value;

        // ✅ serial_number 중복 체크
        if (id === 'serial_number') {
            const isDuplicate = serialNumberList.includes(value.trim());
            setSerialNumberError(isDuplicate ? "이미 존재하는 S/N 입니다." : "");
        }

        setDeviceField(id, val);
    };

    const handleToggleChange = (e) => {
        const newValue = e.target.checked ? "Y" : "N";
        setDeviceField("use_yn", newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (serialNumberList.includes(formData.serial_number.trim())) {
            setSerialNumberError("이미 존재하는 S/N 입니다. 수정 후 다시 시도해주세요.");
            return;
        }

        const confirmMessage = `\n등록할 단말기 정보를 확인해주세요:\n- Serial Number: ${formData.serial_number}\n- Account Number: ${formData.acct_num}\n- Profile ID: ${formData.profile_id}\n- Activated: ${formData.activated}\n- Deactivated: ${formData.deactivated}\n- PPID: ${formData.ppid}\n- Model Name: ${formData.model_name}\n- Internet Mail ID: ${formData.internet_mail_id}\n- Alias: ${formData.alias}\n- Remarks: ${formData.remarks}\n- Use: ${formData.use_yn}`;
        if (!window.confirm(confirmMessage)) return;

        try {
            // ✅ 복사 후 가공
            const { regist_date, update_date, ...cleanedFormData } = formData;

            // ✅ 날짜 필드 포맷 변경
            const payload = {
                ...cleanedFormData,
                activated: cleanedFormData.activated ? `${cleanedFormData.activated}T00:00:00` : null,
                deactivated: cleanedFormData.deactivated ? `${cleanedFormData.deactivated}T00:00:00` : null,
            };
            // console.log(payload)
            await createDevice(payload);
            alert("Device successfully created.");
            navigate("/devices");
        } catch (err) {
            setError(err.message || 'Failed to create device.');
        }
    };
    // console.log(formData)

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">Device New Data</h1>
                <button onClick={() => navigate('/devices')}
                        className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                {/* 파일로 Devices Info 추가 */}
                <div className="col-start-6 col-span-1"><DeviceNewFile /></div>

                {/* 필드 반복 */}
                {[
                    { id: "serial_number", label: "단말기", type: "text", required: true, placeholder: "01680651SKYD374", error: serialNumberError },
                    {
                        id: "acct_num",
                        label: "고객 번호",
                        type: "text",
                        dataList: acctNumList,
                        required: true,
                        placeholder: "KO_99999"
                    },
                    { id: "profile_id", label: "Profile ID", type: "number", required: true, placeholder: "60001406" },
                    {
                        id: "ppid",
                        label: "PPID",
                        type: "number",
                        dataList: pricePpidList,
                        required: true,
                        placeholder: '999'
                    },
                    {
                        id: "model_name",
                        label: "모델명",
                        type: "text",
                        dataList: deviceModelList,
                        required: false,
                        placeholder: "ST6100"
                    },
                    { id: "internet_mail_id", label: "ORBCOMM 별칭", type: "text" },
                    { id: "alias", label: "별칭", type: "text" },
                    { id: "activated", label: "활성화 날짜", type: "date", required: true },
                    { id: "deactivated", label: "비활성화 날짜", type: "date" },
                    { id: "remarks", label: "비고", type: "text", placeholder: "Remarks" }
                ].map(({ id, label, type, dataList, placeholder, required, errorMessage }) =>
                    renderStandardInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        handleChange,
                        dataList,
                        required,
                        errorMessage,
                        id === "serial_number" ? serialNumberError : "", // ✅ 조건부 에러 메시지 전달
                        placeholder
                    )
                )}

                {/* 필드 - use_yn */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="col-start-1 w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-start-2 items-center">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                <button type="submit"
                        className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5">
                    저장
                </button>
                <button type="button" onClick={() => navigate('/devices')}
                        className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm px-5 py-2.5">
                    취소
                </button>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default DeviceNewPage;
