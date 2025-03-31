import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import AccountPartForm from '@/components/form/AccountPartForm.jsx';
import useAccountStore from '@/stores/accountStore';

const AccountOverviewTab = () => {
    const { accountPartData, accountPartLoading, accountPartError, adjustDetailData, adjustDetailLoading, adjustDetailError } = useAccountStore();
    return(
        <>
            {/* Account Part Information */}
            <div>
                {accountPartLoading ? (
                    <LoadingSpinner />
                ) : accountPartError ? (
                    <p className="text-red-500">{accountPartError}</p>
                ) : accountPartData ? (
                    <AccountPartForm accountPartData={accountPartData} adjustDetailData={adjustDetailData}/>
                ) : (
                    <p>Select an account to view details</p>
                )}
            </div>
        </>
    )
}

export default AccountOverviewTab;