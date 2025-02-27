import DateStampCell from '@/columns/cellStyle/DateStampCell.jsx';
import { CDRCell_Code } from '@/columns/cellStyle/CDRnNNCell.jsx';

export const CDRTableColumns = [
    {
        accessorKey: 'record_type',
        header: 'Record Type',
    },
    {
        accessorKey: 'record_id',
        header: 'Record ID',
    },
    {
        accessorKey: 'date_stamp',
        header: 'DateStamp',
        Cell: DateStampCell,
    },
    {
        accessorKey: 'transaction_type',
        header: 'Transaction Type',
    },
    {
        accessorKey: 'discount_code',
        header: 'Discount Code',
    },
    {
        accessorKey: 'd_product',
        header: 'D Product',
        Cell: CDRCell_Code,
    },
    {
        accessorKey: 'msg_id',
        header: 'MSG ID',
    },
    {
        accessorKey: 'volume_unit_type',
        header: 'Volume Unit Type',
    },
    {
        accessorKey: 'volume_units',
        header: 'Volume Units',
    },
    {
        accessorKey: 'access_id',
        header: 'Access ID',
    },
    {
        accessorKey: 'profile_id',
        header: 'Profile ID',
    },
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        enableClickToCopy: true,  // 클릭 시 복사 가능
    },
    {
        accessorKey: 'region',
        header: 'Region',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'sp_id',
        header: 'SP ID',
    }
]