import useAccountStore from '@/stores/accountStore';

// ✅ acct_num 배열만 추출하는 selector
// ['S_10136', 'S_10137', 'V_10101']
export const useAcctNumList = () => {
    const accountData = useAccountStore((state) => state.accountData);
    return accountData.map((item) => item.acct_num);
};

// ✅ acct_num, acct_alias 배열만 추출하는 selector
export const useAcctNumNameList = () => {
    const accountData = useAccountStore((state) => state.accountData);
    return accountData.map(({ acct_num, acct_name }) => ({ acct_num, acct_name }));
};

// ✅ 중복 제거 account_type 배열 추출
// ['법인', '개인']
export const useAcctTypeList = () => {
    const accountData = useAccountStore((state) => state.accountData);

    const uniqueAcctTypes = Array.from(
        new Set(
            accountData
                .map((item) => item.account_type)
                .filter((type) => type !== null && type !== undefined && type !== "")
        )
    );

    return uniqueAcctTypes;
};


// ✅ 중복 제거 classification 배열만 추출하는 filter_selector
// ['내부개발용', '평창군청', '홍수통제소']
export const useAcctClassificationOptions = () => {
    const accountData = useAccountStore((state) => state.accountData);
    return Array.from(new Set(accountData.map((item) => item.classification))).filter(Boolean);
};

export const useAcctResidentNumOptions = () => {
    const accountData = useAccountStore((state) => state.accountData);
    return Array.from(new Set(accountData.map((item) => item.acct_resident_num))).filter(Boolean);
};

export const useAcctCompanyNameOptions = () => {
    const accountData = useAccountStore((state) => state.accountData);
    return Array.from(new Set(accountData.map((item) => item.company_name))).filter(Boolean);
};