import { YearMonthCell_Type, UseYorNCell_Type } from '@/columns/cellStyle/FileUpdateCell.jsx';
import { formatDateTime } from '@/utils/formatHelpers.jsx';
import { FormatUseYnToggle } from './cellStyle/AccountCell.jsx';

export const FileUploadHistoryTableColumns = [
    {
        accessorKey: 'sp_id',
        header: 'SP_ID',
        enableClickToCopy : true,
    },
    {
        accessorKey: 'alias',
        header: 'Alias',
    },
    {
        accessorKey: 'active_index',
        header: 'Active',
        Cell: YearMonthCell_Type,
    },
    {
        accessorKey: 'deactive_index',
        header: 'Deactive',
        Cell: YearMonthCell_Type,
    },
    {
        accessorKey: 'use_yn',
        header: 'Use',
        Cell: FormatUseYnToggle,
        // Cell: UseYorNCell_Type,
    },
    {
        accessorKey: 'update_date',
        header: 'Update Date',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
    {
        accessorKey: 'update_user_id',
        header: 'Update User ID',
    },
    {
        accessorKey: 'regist_date',
        header: 'Register Date',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },
    {
        accessorKey: 'regist_user_id',
        header: 'Register User ID',
    },
];