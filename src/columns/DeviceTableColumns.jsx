import { formatDateTime, FormatUseYnToggle } from './cellStyle/AccountCell.jsx';

export const DeviceTableColumns = [
    {
        accessorKey: 'use_yn',
        header: '사용',
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID',
    },
    {
        accessorKey: 'acct_num',
        header: '고객 번호',
    },
    {
        accessorKey: 'serial_number',
        header: '단말기',
        // enableClickToCopy : true,
    },
    {
        accessorKey: 'internet_mail_id',
        header: 'ORBCOMM 별칭',
    },
    {
        accessorKey: 'alias',
        header: '별칭',
    },
    {
        accessorKey: 'ppid',
        header: 'PPID',
    },
    {
        accessorKey: 'activated',
        header: '활성화 날짜',
        Cell: ({ cell }) =>
            cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-',
        // Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'deactivated',
        header: '비활성화 날짜',
        Cell: ({ cell }) =>
            cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-',
        // Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    },
    {
        accessorKey: 'model_name',
        header: '모델명',
    },
    {
        accessorKey: 'regist_date',
        header: '등록 날짜',
        Cell: formatDateTime,
    },
    {
        accessorKey: 'regist_user_id',
        header: '등록한 계정',
    },
    {
        accessorKey: "update_date",
        header: "업데이트 날짜",
        Cell: formatDateTime,
    },
    {
        accessorKey: 'update_user_id',
        header: '마지막 수정 계정',
    },
    {
        accessorKey: 'remarks',
        header: '비고',
    },
];