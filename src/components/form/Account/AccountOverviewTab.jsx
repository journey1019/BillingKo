import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import AccountPartForm from '@/components/form/AccountPartForm.jsx';

const AccountOverviewTab = ({ partDataLoading, partDataError, accountPartData}) => {
    return(
        <>
            {/* Account Part Information */}
            <div>
                {partDataLoading ? (
                    <LoadingSpinner />
                ) : partDataError ? (
                    <p className="text-red-500">{partDataError}</p>
                ) : accountPartData ? (
                    <AccountPartForm accountPartData={accountPartData} />
                ) : (
                    <p>Select an account to view details</p>
                )}
            </div>
        </>
    )
}

export default AccountOverviewTab;