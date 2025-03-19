import { formatDateTime, formatDisplayValue } from '@/utils/formatHelpers.jsx';

const DevicePartForm = ({ devicePartData }) => {
    // // 빈 값 처리 함수
    // const formatDisplayValue = (value) => (!value || value === "null" ? "-" : value);

    return (
        <div className="space-y-4">
            {/* ✅ 사용 여부 (맨 위) */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">사용 여부</span>
                <div className="flex items-center space-x-2">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        devicePartData.use_yn === 'Y' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                devicePartData.use_yn === 'Y' ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </div>
                    <span className="text-sm font-medium">{devicePartData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                </div>
            </div>

            {/* ✅ 기본 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: '단말기', value: devicePartData.serial_number },
                    { label: '고객 번호', value: devicePartData.acct_num },
                    { label: 'Profile ID', value: devicePartData.profile_id },
                    { label: 'PPID', value: devicePartData.ppid },
                    { label: '모델명', value: devicePartData.model_name },
                    { label: 'ORBCOMM 별칭', value: devicePartData.internet_mail_id },
                    { label: '별칭', value: devicePartData.alias },
                ].map(({ label, value }, index) => (
                    <DataRow key={index} label={label} value={formatDisplayValue(value)} />
                ))}
            </div>

            {/* ✅ 등록 및 수정 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">등록 및 수정 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: '등록한 날짜', value: formatDateTime(devicePartData.regist_date) },
                    { label: '업데이트한 날짜', value: formatDateTime(devicePartData.update_date) },
                    { label: '등록한 계정', value: formatDisplayValue(devicePartData.regist_user_id) },
                    { label: '업데이트한 계정', value: formatDisplayValue(devicePartData.update_user_id) },
                ].map(({ label, value }, index) => (
                    <DataRow key={index} label={label} value={value} />
                ))}
            </div>

            {/* ✅ 활성화 및 비활성화 날짜 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">활성화 및 비활성화 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: '활성화 날짜', value: formatDateTime(devicePartData.activated) },
                    { label: '비활성화 날짜', value: formatDateTime(devicePartData.deactivated) },
                ].map(({ label, value }, index) => (
                    <DataRow key={index} label={label} value={value} />
                ))}
            </div>

            {/* ✅ 추가 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">추가 정보</h2>
            {/*<div className="grid grid-cols-1 gap-3">*/}
            {/*    <DataRow label="비고" value={formatDisplayValue(devicePartData.remarks)} fullWidth />*/}
            {/*</div>*/}
            <div className="flex flex-row items-center py-2 px-1">
                <span className="text-xs text-gray-500 w-1/6">비고</span>
                <span className="text-sm w-2/3 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(devicePartData.remarks)}</span>
            </div>
        </div>
    );
};

// ✅ 재사용 가능한 데이터 행 컴포넌트
const DataRow = ({ label, value, fullWidth = false }) => (
    <div className={`flex justify-between items-center ${fullWidth ? 'col-span-2' : ''}`}>
        <label className="text-xs font-medium text-gray-500 w-1/3 p-1">{label}</label>
        <span className="text-sm w-2/3 px-2 py-1 rounded-md bg-gray-100">{value}</span>
    </div>
);

export default DevicePartForm;
