// utils/accountHelpers.js
export const extractAcctNumList = (accountData) => {
    if (!Array.isArray(accountData)) return [];
    return accountData
        .map((item) => item.acct_num)
        .filter(Boolean); // null 또는 undefined 제거
};
