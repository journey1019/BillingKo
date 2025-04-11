import useAdjustmentStore from '@/stores/adjustmentStore.js';

export const useAcctNumList = () => {
    const accountData = useAdjustmentStore((state) => state.accountData);
    return accountData.map((item) => item.acct_num);
};
