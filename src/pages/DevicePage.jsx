import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchDevices, createDevice } from '@/service/deviceService.js';
import { DeviceTableColumns } from '@/columns/DeviceTableColumns';
import { DeviceTableOptions } from '@/options/DeviceTableOptions.jsx';
import ReusableTable from '@/components/table/ReusableTable';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSettings3Fill } from 'react-icons/ri';

const DevicePage = () => {
    const { data, loading, error } = useApiFetch(fetchDevices);

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                {/* Title */}
                <h1 className="py-1 text-lg font-bold">Account Data</h1>

                {/* Setting Buttons */}
                <div className="flex space-x-2 items-center">
                    {/* New Account */}
                    <button onClick={() => console.log('click')}
                            className="flex flex-row items-center space-x-2 p-2 rounded-md bg-blue-500 text-sm text-white hover:bg-blue-600 transition">
                        <FiPlus />
                        <span>New</span>
                    </button>

                    {/* Add */}
                    <button
                        onClick={() => console.log("Add Clicked")}
                        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
                    >
                        <BsThreeDotsVertical />
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => console.log("Settings Clicked")}
                        className="flex flex-row items-center p-2 rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 transition"
                    >
                        <RiSettings3Fill />
                    </button>
                </div>
            </div>
            {loading ? <LoadingSpinner /> : (
                <ReusableTable
                    columns={DeviceTableColumns}
                    data={data}
                    options={DeviceTableOptions}
                />
            )}
        </div>
    );
};

export default DevicePage;