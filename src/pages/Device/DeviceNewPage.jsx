import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import DeviceNewFile from '@/components/form/Device/DeviceNewFile';
import useDeviceFormStore from '@/stores/deviceFormStore';
import useAccountStore from '@/stores/accountStore';
import usePriceStore from '@/stores/priceStore.js';
import { useAcctNumList } from '@/selectors/useAccountSelectors.js';
import { usePPIDList } from '@/selectors/usePriceSelectors.js';
import { useDevModelNameList } from '@/selectors/useDeviceSelectors.js';
import useDeviceStore from '@/stores/deviceStore.js';
import { renderStandardInputField } from '@/utils/renderHelpers.jsx';

const DeviceNewPage = () => {
    const navigate = useNavigate();
    const {
        formData,
        setDeviceField,
        toggleUseYN,
        submitDeviceForm
    } = useDeviceFormStore();

    const { fetchAccountData } = useAccountStore();
    const { fetchPriceData } = usePriceStore();
    const { fetchDeviceData } = useDeviceStore();

    const acctNumList = useAcctNumList();
    const pricePpidList = usePPIDList();
    const deviceModelList = useDevModelNameList();

    // 초기 Fetch
    useEffect(() => {
        fetchAccountData();
        fetchPriceData();
        fetchDeviceData();
    }, []);

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const val = id === 'ppid' ? Number(value) : value;
        setDeviceField(id, val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmMessage = `\n등록할 단말기 정보를 확인해주세요:\n- Serial Number: ${formData.serial_number}\n- Account Number: ${formData.acct_num}\n- Profile ID: ${formData.profile_id}\n- Activated: ${formData.activated}\n- Deactivated: ${formData.deactivated}\n- PPID: ${formData.ppid}\n- Model Name: ${formData.model_name}\n- Internet Mail ID: ${formData.internet_mail_id}\n- Alias: ${formData.alias}\n- Remarks: ${formData.remarks}\n- Use: ${formData.use_yn}`;

        if (!window.confirm(confirmMessage)) return;

        try {
            await submitDeviceForm();
            alert("Device successfully created.");
            navigate("/devices");
        } catch (err) {
            setError(err.message || 'Failed to create device.');
        }
    };

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

                {/* 필드 - use_yn */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-span-2 flex items-center space-x-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="use_yn" checked={formData.use_yn === 'Y'}
                                   onChange={() => toggleUseYN()}
                                   className="sr-only peer" />
                            <div
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                            <div
                                className="absolute w-5 h-5 bg-white rounded-full shadow-lg transform peer-checked:translate-x-5 transition-all"></div>
                        </label>
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>


                {/* 필드 반복 */}
                {[
                    { id: "serial_number", label: "단말기", type: "text", required: true, placeholder: "01680651SKYD374" },
                    { id: "acct_num", label: "고객 번호", type: "text", dataList: acctNumList, required: true, placeholder: "KO_99999" },
                    { id: "profile_id", label: "Profile ID", type: "number", required: true, placeholder: "60001406" },
                    { id: "ppid", label: "PPID", type: "number", dataList: pricePpidList, required: true, placeholder: '999' },
                    { id: "model_name", label: "모델명", type: "text", dataList: deviceModelList, required: false, placeholder: "ST6100" },
                    { id: "internet_mail_id", label: "ORBCOMM 별칭", type: "text" },
                    { id: "alias", label: "별칭", type: "text" },
                    { id: "activated", label: "활성화 날짜", type: "date", required: true },
                    { id: "deactivated", label: "비활성화 날짜", type: "date" },
                    { id: "remarks", label: "비고", type: "text", placeholder: "Remarks" }
                ].map(({ id, label, type, dataList, placeholder, required }) =>
                    renderStandardInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        handleChange,
                        dataList,
                        required,
                        "", // 에러 메시지 있으면 여기에
                        placeholder
                    )
                )}


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
