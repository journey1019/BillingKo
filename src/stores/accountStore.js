import { create } from 'zustand';
import { fetchAccounts, fetchAccountPart, fetchAccountHistory, updateAccount, deleteAccount } from '@/service/accountService';
import { fetchAdjustmentValue, fetchAdjustmentValueHistory } from '@/service/adjustmentService';

const useAccountStore = create((set) => ({
    // 전체 계정 목록
    accountData: [],
    accountLoading: false,
    accountError: null,

    // 상세 정보
    accountPartData: null,
    accountPartLoading: false,
    accountPartError: null,

    // 이력 정보
    historyData: null,
    historyLoading: false,
    historyError: null,

    // 조정 상세 정보
    adjustDetailData: null,
    adjustDetailLoading: false,
    adjustDetailError: null,

    // 조정 정보
    adjustHistoryData: null,
    adjustHistoryLoading: false,
    adjustHistoryError: null,

    // Account Data 전체 불러오기
    fetchAccountData: async () => {
        set({ accountLoading: true, accountError: null });
        try {
            const data = await fetchAccounts();
            set({ accountData: data });
        } catch (error) {
            set({ accountError: error.message || '계정 데이터를 불러오지 못했습니다.' });
        } finally {
            set({ accountLoading: false });
        }
    },

    // fetchAccountData - acct_num 중복 검사
    isDuplicateAcctNum: (acctNum) => {
        const { accountData } = useAccountStore.getState();
        return accountData.some((account) => account.acct_num === acctNum);
    },


    // 단일 계정 상세 데이터 불러오기
    fetchAccountDetails: async (acct_num) => {
        set({
            accountPartLoading: true,
            historyLoading: true,
            adjustHistoryLoading: true,
            accountPartError: null,
            historyError: null,
            adjustHistoryError: null,
            adjustDetailLoading: true,
            adjustDetailError: null,
        });

        try {
            const [part, history, adjustment, adjustmentHistory] = await Promise.all([
                fetchAccountPart(acct_num),
                fetchAccountHistory(acct_num),
                fetchAdjustmentValue(acct_num),
                fetchAdjustmentValueHistory(acct_num),
            ]);

            set({
                accountPartData: part,
                historyData: history,
                adjustDetailData: adjustment,
                adjustHistoryData: adjustmentHistory,
            });
        } catch (error) {
            set({
                accountPartError: error.message,
                historyError: error.message,
                adjustDetailError: error.message,
                adjustHistoryError: error.message,
            });
        } finally {
            set({
                accountPartLoading: false,
                historyLoading: false,
                adjustDetailLoading: false,
                adjustHistoryLoading: false,
            });
        }
    },

    // 삭제
    deleteAccountData: async (acct_num) => {
        try {
            await deleteAccount(acct_num);
        } catch (error) {
            throw error;
        }
    },


    // updateAccountData
    updateAccountData: async (acct_num, payload) => {
        try {
            await updateAccount(acct_num, payload);
        } catch (err) {
            throw err;
        }
    },
}));

export default useAccountStore;
