// import { formatDateTime } from '@/utils/formatHelpers.jsx';
//
// const DevicePartForm = ({ devicePartData }) => {
//     console.log(devicePartData)
//     const formatDisplayValue = (value) => {
//         return !value || value === "null" ? "-" : value;
//     };
//
//     return (
//         <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex flex-row justify-between items-center">
//                 <h2 className="text-xl font-bold mb-2 text-gray-700">{devicePartData.profile_id} _ {devicePartData.serial_number}</h2>
//             </div>
//
//             <div className="text-gray-500 text-sm mb-6">
//                 Updated By: <span className="text-gray-700 font-semibold">{devicePartData.regist_user_id || "-"}</span> | Last
//                 Update: <span className="text-gray-700 font-semibold">{formatDateTime(devicePartData.regist_date) || '-'}</span>
//             </div>
//
//             <div className="border rounded-lg px-4 py-2 mb-2">
//
//                 <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
//                     <div className="text-gray-500">Data Index:</div>
//                     <div className="px-2 col-span-1 ml-1">{devicePartData.data_index}</div>
//                 </div>
//             </div>
//
//             <form className="grid grid-cols-4 gap-4 mb-2 text-sm">
//                 {[
//                     { label: 'Serial Number', value: devicePartData.serial_number },
//                     { label: 'Account Number', value: devicePartData.acct_num },
//                     { label: "Profile ID", value: devicePartData.profile_id },
//                     { label: "PPID", value: devicePartData.ppid },
//                     { label: "Activated Date", value: formatDateTime(devicePartData.activated) },
//                     { label: "Deactivated Date", value: formatDateTime(devicePartData.deactivated) },
//                     { label: "Model Name", value: formatDisplayValue(devicePartData.model_name) },
//                     { label: "Internet Mail ID", value: formatDisplayValue(devicePartData.internet_mail_id) },
//                     { label: "Alias", value: formatDisplayValue(devicePartData.alias) },
//                     { label: "Register User ID", value: formatDisplayValue(devicePartData.regist_user_id) },
//                     { label: "Update User ID", value: formatDisplayValue(devicePartData.update_user_id) },
//                     { label: "Register Date", value: formatDateTime(devicePartData.regist_date) },
//                     { label: "Update Date", value: formatDateTime(devicePartData.update_date) }
//                 ].map((item, index) => (
//                     <div key={index}>
//                         <div className="text-gray-500">{item.label}</div>
//                         <div className="px-2 col-span-1 ml-1">{item.value}</div>
//                     </div>
//                 ))}
//
//                 {/* ✅ 사용 여부 (Toggle) */}
//                 <div className="col-span-2 flex items-center justify-between">
//                     <label className="text-xs 2xl:text-sm font-medium text-gray-500">사용 여부</label>
//                     <div className="flex items-center space-x-4">
//                         {/* Toggle Button */}
//                         <label className="relative inline-flex items-center cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 checked={devicePartData.use_yn === 'Y'}
//                                 readOnly // Toggle 활성화 여부만 보여줌 (수정 불가)
//                                 className="sr-only peer"
//                             />
//                             <div
//                                 className={`w-11 h-6 ${devicePartData.use_yn === 'Y' ? 'bg-blue-600' : 'bg-gray-300'} rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300`}></div>
//                             <div
//                                 className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${devicePartData.use_yn === 'Y' ? 'peer-checked:translate-x-5' : ''}`}></div>
//                         </label>
//                         <span className="text-sm font-medium text-gray-700">
//                         {devicePartData.use_yn === 'Y' ? 'Yes' : 'No'}
//                     </span>
//                     </div>
//                 </div>
//
//                 {/* ✅ Remarks (col-span-2) */}
//                 <div className="col-span-2 flex flex-col">
//                     <label className="text-xs 2xl:text-sm font-medium text-gray-500">Remarks</label>
//                     <span className="mt-1 text-sm 2xl:text-md">{formatDisplayValue(devicePartData.remarks)}</span>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default DevicePartForm;

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
