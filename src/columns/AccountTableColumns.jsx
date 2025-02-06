export const AccountTableColumns = [
    {
        accessorKey: 'acct_num',
        header: '고객 번호',
        enableClickToCopy: true,  // 클릭 시 복사 가능
    },
    {
        accessorKey: 'account_type',
        header: '고객구분',
    },
    {
        accessorKey: 'acct_name',
        header: '고객명',
    },
    {
        accessorKey: 'acct_resident_num',
        header: '등록 번호',
    },
    {
        accessorKey: 'regist_date',
        header: '등록일',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'use_yn',
        header: '사용',
    },
    {
        accessorKey: 'classification',
        header: '분류(Alias)',
    },
    {
        accessorKey: 'invoice_postcode',
        header: '우편번호',
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
        header: '사업자등록번호',
    },
    {
        accessorKey: 'company_tel',
        header: '직장전화',
    },
    {
        accessorKey: 'tax_percent',
        header: '적용부가세율(%)',
    },
    {
        accessorKey: 'business_num',
        header: '법인번호',
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
        header: '담당메일',
    },
    {
        accessorKey: 'director_tel',
        header: '담당전화',
    },
    {
        accessorKey: 'company_postcode',
        header: '청구소 우편번호',
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
