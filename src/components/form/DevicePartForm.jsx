import { formatDateTime } from '@/utils/formatHelpers.jsx';

const DevicePartForm = ({ devicePartData }) => {
    const formatDisplayValue = (value) => {
        return !value || value === "null" ? "-" : value;
    };

    return (
        <form className="grid grid-cols-2 gap-3">
            {/* Serial Number */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Serial Number</label>
                <span className="mt-1 block text-sm 2xl:text-md">{devicePartData.serial_number}</span>
            </div>

            {/* Account Number */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Account Number</label>
                <span className="mt-1 block text-sm 2xl:text-md">{devicePartData.acct_num}</span>
            </div>

            {/* Profile ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Profile ID</label>
                <span className="mt-1 block text-sm 2xl:text-md">{devicePartData.profile_id}</span>
            </div>

            {/* PPID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">PPID</label>
                <span className="mt-1 block text-sm 2xl:text-md">{devicePartData.ppid}</span>
            </div>

            {/* Activated Date */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Activated Date</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDateTime(devicePartData.activated)}</span>
            </div>

            {/* Deactivated Date */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Deactivated Date</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDateTime(devicePartData.deactivated)}</span>
            </div>

            {/* Use Y/N (Toggle) */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500 mb-2">사용 여부</label>
                <div className="flex items-center space-x-4">
                    {/* Toggle Button */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={devicePartData.use_yn === 'Y'}
                            readOnly // Toggle 활성화 여부만 보여줌 (수정 불가)
                            className="sr-only peer"
                        />
                        <div
                            className={`w-11 h-6 ${devicePartData.use_yn === 'Y' ? 'bg-blue-600' : 'bg-gray-300'} rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300`}></div>
                        <div
                            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${devicePartData.use_yn === 'Y' ? 'peer-checked:translate-x-5' : ''}`}></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">
                        {devicePartData.use_yn === 'Y' ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>

            {/* Model Name */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Model Name</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.model_name)}</span>
            </div>

            {/* Internet Mail ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Internet Mail ID</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.internet_mail_id)}</span>
            </div>

            {/* Alias */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Alias</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.alias)}</span>
            </div>

            {/* Remarks */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Remarks</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.remarks)}</span>
                {/*<textarea*/}
                {/*    value={devicePartData.remarks || 'N/A'}*/}
                {/*    readOnly*/}
                {/*    rows={3}*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*/>*/}
            </div>

            {/* Register User ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Register User ID</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.regist_user_id)}</span>
            </div>

            {/* Update User ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Update User ID</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDisplayValue(devicePartData.update_user_id)}</span>
            </div>

            {/* Register Date */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Register Date</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDateTime(devicePartData.regist_date)}</span>
            </div>

            {/* Update Date */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Update Date</label>
                <span className="mt-1 block text-sm 2xl:text-md">{formatDateTime(devicePartData.update_date)}</span>
            </div>
        </form>
    );
};

export default DevicePartForm;
