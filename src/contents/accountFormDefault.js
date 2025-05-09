import { useAcctTypeList, useAcctClassificationOptions, useAcctResidentNumOptions } from '@/selectors/useAccountSelectors.js';

export const defaultAccountFormData = {
    acct_num: "",
    account_type: "",
    acct_name: "",
    acct_resident_num: "",
    regist_date: "",
    use_yn: "Y",
    classification: "",
    invoice_postcode: "",
    invoice_address: "",
    invoice_address2: "",
    recognize_id: "",
    company_tel: "",
    tax_percent: "",
    business_num: "",
    company_name: "",
    company_team: "",
    company_director: "",
    director_email: "",
    director_tel: "",
    company_postcode: "",
    company_address: "",
    company_address2: "",
};

export const useInputAccountFormData = () => {
    const acctTypeList = useAcctTypeList();
    const acctClassification = useAcctClassificationOptions();
    const acctResidentList = useAcctResidentNumOptions();

    return [
        { id: 'acct_name', label: '고객명', type: 'text', placeholder: '코리아오브컴', required: true },
        { id: 'classification', label: '분류', type: 'text', placeholder: '내부', dataList: acctClassification, required: true },
        { id: 'acct_resident_num', label: '등록 번호', type: 'number', placeholder: '0', dataList: acctResidentList, required: true },
        {
            id: 'tax_percent',
            label: '부가 세율(%)',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: '1.0',
            required: true
        },
        { id: 'company_name', label: '회사명', type: 'text', placeholder: '코리아오브컴' },
        { id: 'business_num', label: '사업자 등록 번호', type: 'text', placeholder: '000-00-00000' },
        { id: 'recognize_id', label: '법인(주민) 번호', type: 'text', placeholder: '000-0000' },
        {
            id: 'company_tel',
            label: '회사 전화 번호',
            type: 'tel',
            pattern: '[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}',
            placeholder: '00-0000-0000',
        },
        // { id: 'company_postcode', label: '회사 우편번호', type: 'number', placeholder: '00000' },
        // { id: 'company_address', label: '회사 주소', type: 'text', placeholder: '서울특별시 서초구 강남대로 525' },
        // { id: 'company_address2', label: '회사 상세 주소', type: 'text', placeholder: '15층' },
        { id: 'company_team', label: '팀명', type: 'text', placeholder: '기술부' },
        { id: 'company_director', label: '담당자', type: 'text', placeholder: '홍길동' },
        { id: 'director_email', label: '담당자 이메일', type: 'email', placeholder: 'example@gmail.com' },
        {
            id: 'director_tel',
            label: '담당 전화 번호',
            type: 'tel',
            placeholder: '000-0000-0000',
            pattern: '[0-9]{3}-[0-9]{3,4}-[0-9]{4}',
        },
        // { id: 'invoice_postcode', label: '청구서 우편 번호', type: 'text' },
        // { id: 'invoice_address', label: '청구지 주소', type: 'text' },
        // { id: 'invoice_address2', label: '청구지 상세 주소', type: 'text' },

        // { id: 'acct_num', label: '고객 번호', type: 'text', readOnly: true, placeholder: 'KO_99999', required: true },
        // { id: 'account_type', label: '고객 구분', type: 'text', placeholder: '법인', required: true },
        // { id: 'regist_date', label: '등록일', type: 'date', readOnly: true },
    ]
}

// 미포함 객체: 'acct_num', 'account_type', 'regist_date'
export const inputAccountFormData = [
    { id: 'acct_name', label: '고객명', type: 'text', placeholder: '코리아오브컴', required: true },
    { id: 'classification', label: '분류', type: 'text', placeholder: '내부', required: true },
    { id: 'acct_resident_num', label: '등록 번호', type: 'number', placeholder: '0', required: true },
    {
        id: 'tax_percent',
        label: '부가 세율(%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: '1.0',
        required: true
    },
    { id: 'company_name', label: '회사명', type: 'text', placeholder: '코리아오브컴' },
    { id: 'business_num', label: '사업자 등록 번호', type: 'text', placeholder: '000-00-00000' },
    { id: 'recognize_id', label: '법인(주민) 번호', type: 'text', placeholder: '000-0000' },
    {
        id: 'company_tel',
        label: '회사 전화 번호',
        type: 'tel',
        pattern: '[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}',
        placeholder: '00-0000-0000',
    },
    // { id: 'company_postcode', label: '회사 우편번호', type: 'number', placeholder: '00000' },
    // { id: 'company_address', label: '회사 주소', type: 'text', placeholder: '서울특별시 서초구 강남대로 525' },
    // { id: 'company_address2', label: '회사 상세 주소', type: 'text', placeholder: '15층' },
    { id: 'company_team', label: '팀명', type: 'text', placeholder: '기술부' },
    { id: 'company_director', label: '담당자', type: 'text', placeholder: '홍길동' },
    { id: 'director_email', label: '담당자 이메일', type: 'email', placeholder: 'example@gmail.com' },
    {
        id: 'director_tel',
        label: '담당 전화 번호',
        type: 'tel',
        placeholder: '000-0000-0000',
        pattern: '[0-9]{3}-[0-9]{3,4}-[0-9]{4}',
    },
    // { id: 'invoice_postcode', label: '청구서 우편 번호', type: 'text' },
    // { id: 'invoice_address', label: '청구지 주소', type: 'text' },
    // { id: 'invoice_address2', label: '청구지 상세 주소', type: 'text' },

    // { id: 'acct_num', label: '고객 번호', type: 'text', readOnly: true, placeholder: 'KO_99999', required: true },
    // { id: 'account_type', label: '고객 구분', type: 'text', placeholder: '법인', required: true },
    // { id: 'regist_date', label: '등록일', type: 'date', readOnly: true },
]