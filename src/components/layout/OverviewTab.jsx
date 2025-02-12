import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

const OverviewTab = ({ loading, error, data}) => {
    return(
        <>
            <div>
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : data ? (
                    <AccountPartForm accountPartData={accountPartData} />
                ) : (
                    <p>Select an account to view details</p>
                )}
            </div>
        </>
    )
}
export default OverviewTab;