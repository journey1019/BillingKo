const DevicePartForm = ({ devicePartData }) => {
    return (
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-md">
            {/* Serial Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                <input
                    type="text"
                    value={devicePartData.serial_number || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Account Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                    type="text"
                    value={devicePartData.acct_num || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Profile ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Profile ID</label>
                <input
                    type="number"
                    value={devicePartData.profile_id || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Activated Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Activated Date</label>
                <input
                    type="date"
                    value={new Date(devicePartData.activated).toISOString().split('T')[0]}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Deactivated Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Deactivated Date</label>
                <input
                    type="date"
                    value={devicePartData.deactivated ? new Date(devicePartData.deactivated).toISOString().split('T')[0] : ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Use Y/N (Toggle) */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">사용 여부</label>
                <div className="flex items-center space-x-4">
                    {/* Toggle Button */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={devicePartData.use_yn === 'Y'}
                            readOnly // Toggle 활성화 여부만 보여줌 (수정 불가)
                            className="sr-only peer"
                        />
                        <div className={`w-11 h-6 ${devicePartData.use_yn === 'Y' ? 'bg-blue-600' : 'bg-gray-300'} rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300`}></div>
                        <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${devicePartData.use_yn === 'Y' ? 'peer-checked:translate-x-5' : ''}`}></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">
                        {devicePartData.use_yn === 'Y' ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>

            {/* Model Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Model Name</label>
                <input
                    type="text"
                    value={devicePartData.model_name || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Internet Mail ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Internet Mail ID</label>
                <input
                    type="text"
                    value={devicePartData.internet_mail_id || 'N/A'}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Alias */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Alias</label>
                <input
                    type="text"
                    value={devicePartData.alias || 'N/A'}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Remarks */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                    value={devicePartData.remarks || 'N/A'}
                    readOnly
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Registration Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                <input
                    type="date"
                    value={new Date(devicePartData.regist_date).toISOString().split('T')[0]}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Update Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Update Date</label>
                <input
                    type="date"
                    value={new Date(devicePartData.update_date).toISOString().split('T')[0]}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>
        </form>
    );
};

export default DevicePartForm;
