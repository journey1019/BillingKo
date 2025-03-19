import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import DevicePartForm from '@/components/form/DevicePartForm.jsx';

const DeviceOverviewTab = ({ devicePartData, partDataLoading, partDataError, historyError}) => {
    return(
        <>
            {partDataLoading ? (
                <LoadingSpinner />
            ) : partDataError ? (
                <p className="text-red-500">Error loading history: {partDataError}</p>
            ) : devicePartData ? (
                <DevicePartForm devicePartData={devicePartData} />
            ) : (
                <p>Select an device to view details</p>
            )}
        </>
    )
}

export default DeviceOverviewTab;