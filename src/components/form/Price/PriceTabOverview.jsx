import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import PricePartForm from '@/components/form/PricePartForm.jsx';
import usePriceStore from '@/stores/priceStore.js';


const PriceTabOverview = () => {
    const { pricePartData, pricePartLoading, pricePartError } = usePriceStore();
    return(
        <>
            {pricePartLoading ? (
                <LoadingSpinner />
            ) : pricePartError ? (
                <p className="text-red-500">Error loading history: {pricePartError}</p>
            ) : pricePartData ? (
                <PricePartForm pricePartData={pricePartData} />
            ) : (
                <p>Select an price to view details</p>
            )}
        </>
    )
}

export default PriceTabOverview;