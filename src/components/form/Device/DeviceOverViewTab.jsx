import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import DevicePartForm from '@/components/form/DevicePartForm.jsx';
import useDeviceStore from '@/stores/deviceStore.js';

const DeviceOverviewTab = () => {
    const { devicePartData, devicePartLoading, devicePartError } = useDeviceStore();
    return(
        <>
            {devicePartLoading ? (
                <LoadingSpinner />
            ) : devicePartError ? (
                <p className="text-red-500">Error loading history: {devicePartError}</p>
            ) : devicePartData ? (
                <DevicePartForm devicePartData={devicePartData} />
            ) : (
                <p>Select an device to view details</p>
            )}
        </>
    )
}

export default DeviceOverviewTab;