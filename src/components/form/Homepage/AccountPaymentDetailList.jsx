import usePaymentStore from '@/stores/paymentStore.js';

const AccountPaymentDetailList = () => {
    const {
        // Detail
        fetchAccountPaymentHistoryDetail,
        accountPaymentHistoryDetailData,
        accountPaymentHistoryDetailLoading,
        accountPaymentHistoryDetailError,
    } = usePaymentStore();


    return(
        <>
        </>
    )
}
export default AccountPaymentDetailList;