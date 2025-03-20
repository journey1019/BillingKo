import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import PricePartForm from '@/components/form/PricePartForm.jsx';

const PriceTabOverview = ({ pricePartData, partDataLoading, partDataError, historyError }) => {
    return(
        <>
            {partDataLoading ? (
                <LoadingSpinner />
            ) : partDataError ? (
                <p className="text-red-500">Error loading history: {historyError}</p>
            ) : pricePartData ? (
                <PricePartForm pricePartData={pricePartData} />
            ) : (
                <p>Select an price to view details</p>
            )}
        </>
    )
}

export default PriceTabOverview;