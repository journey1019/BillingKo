import { FormatBusinessNumber, FormatPhoneNumber, FormatUseYnToggle } from './cellStyle/AccountCell.jsx';

export const AccountTableColumns = [
    {
        accessorKey: 'acct_num',
        header: '고객 번호',
        enableClickToCopy: true,  // 클릭 시 복사 가능
    },
    {
        accessorKey: 'classification',
        header: '고객 별칭',
        filterVariant: 'select',
        size: 100,
    },
    {
        accessorKey: 'account_type',
        header: '고객 구분',
    },
    {
        accessorKey: 'acct_name',
        header: '고객명',
    },
    {
        accessorKey: 'acct_resident_num',
        header: '등록 번호',
        Cell: FormatPhoneNumber,
    },
    {
        accessorKey: 'regist_date',
        header: '등록일',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'invoice_postcode',
        header: '우편 번호',
    },
    {
        accessorKey: 'invoice_address',
        header: '주소',
    },
    {
        accessorKey: 'invoice_address2',
        header: '주소 2',
        Cell: ({ cell }) => (cell.getValue() === 'null' ? '' : cell.getValue()),
    },
    {
        accessorKey: 'recognize_id',
        header: '사업자 등록 번호',
    },
    {
        accessorKey: 'company_tel',
        header: '직장 전화',
        Cell: FormatPhoneNumber
    },
    {
        accessorKey: 'tax_percent',
        header: '적용 부가 세율(%)',
    },
    {
        accessorKey: 'business_num',
        header: '법인 번호',
        Cell: FormatBusinessNumber,
    },
    {
        accessorKey: 'company_name',
        header: '직장명',
    },
    {
        accessorKey: 'company_team',
        header: '부서/팀',
    },
    {
        accessorKey: 'company_director',
        header: '담당자',
    },
    {
        accessorKey: 'director_email',
        header: '담당 메일',
    },
    {
        accessorKey: 'director_tel',
        header: '담당 전화',
    },
    {
        accessorKey: 'company_postcode',
        header: '청구소 우편 번호',
    },
    {
        accessorKey: 'company_address',
        header: '청구소 주소',
    },
    {
        accessorKey: 'company_address2',
        header: '청구소 주소',
    },
];
