import {
    AdjustmentCell_Category,
    AdjustmentCell_Code, AdjustmentCell_Cycle, AdjustmentCell_Mount_Value, AdjustmentCell_Type,
    AdjustmentCell_Use, AdjustmentCell_Amount
} from '@/columns/cellStyle/AdjustmentCell.jsx';
import {
    formatDateIndex,
    formatDateTime,
    renderNumberCell,
    applyRightAlignStyles,
    FormatUseYnToggle,
} from './cellStyle/AccountCell.jsx';
import { applyCenterAlignStyles } from './cellStyle/BasicCellStyle.jsx';
import { Tooltip } from '@mui/material';
import { CiCircleQuestion } from "react-icons/ci";
import { ADJUSTMENT_HEADER_LABELS } from "@/contents/adjustmentHeader.js";

export const AdjustmentTableColumns = [
    {
        accessorKey: 'adjustment_index',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_index,
        size: 50,
    },
    {
        accessorKey: 'use_yn',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        조정 내역을 현재 실제로 적용할지 여부<br />
                        (F: 미적용, T: 적용)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.use_yn}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: FormatUseYnToggle,
        ...applyCenterAlignStyles(),
    },
    {
        accessorKey: 'tax_free_yn',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        이 항목은 세금계산서 발행 기준일과 관련된 항목입니다.<br />
                        (F: 부가세 계산 전, T: 부가세 계산 후)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.tax_free_yn}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: FormatUseYnToggle,
        ...applyCenterAlignStyles(),
    },
    {
        accessorKey: 'adjustment_code',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        조정이 어떤 대상을 기준으로 적용되는지 구분<br />
                        (Account: 고객 / Serial: 단말 / PPID: 요금제)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.adjustment_code}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: AdjustmentCell_Code,
    },
    {
        accessorKey: 'adjustment_code_value',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_code_value,
    },
    {
        accessorKey: 'adjustment_category',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        조정의 목적이나 이유<br />
                        (ex: 가입비, 미납, 과오납, A 사용료 등)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.adjustment_category}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        (할인: '-' / 가산: '+')
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.adjustment_type}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        (Pay: 고정 금액 / Percent: 비율(%))
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.mount_type}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: AdjustmentCell_Amount
    },
    {
        accessorKey: 'adjustment_cycle',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        조정이 한 번만 적용되는 일회성 /<br />
                        매월 반복 적용되는 정기성
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.adjustment_cycle}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        실제로 적용되는 금액(정액) 또는 비율(%)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.mount_value}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: renderNumberCell,
        // ...applyRightAlignStyles()
        muiTableHeadCellProps: { align: 'right' },
    },
    {
        accessorKey: 'description',
        header: ADJUSTMENT_HEADER_LABELS.description,
    },
    {
        accessorKey: 'date_index',
        header: (
            <Tooltip
                placement="top"
                title={
                    <>
                        조정이 적용되는 기준일입니다.<br />
                        (정기 조정: 시작일 / 일회성 조정: 적용일)
                    </>
                }
            >
                <div className="flex items-center gap-1">
                    <span>{ADJUSTMENT_HEADER_LABELS.date_index}</span>
                    <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                </div>
            </Tooltip>
        ),
        Cell: formatDateIndex,
    }
]

/**
 * @desc: AccountForm_Transaction Table Columns
 * */
export const AdjustmentReferencesTableColumns = [
    {
        accessorKey: 'use_yn',
        header: ADJUSTMENT_HEADER_LABELS.use_yn,
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'date_index',
        header: ADJUSTMENT_HEADER_LABELS.date_index,
        Cell: formatDateIndex,
    },
    {
        accessorKey: 'adjustment_category',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_category,
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_type,
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: ADJUSTMENT_HEADER_LABELS.mount_type,
        Cell: AdjustmentCell_Amount,
    },
    {
        accessorKey: 'adjustment_cycle',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_cycle,
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: ADJUSTMENT_HEADER_LABELS.mount_value,
        Cell: renderNumberCell,
        ...applyRightAlignStyles()
    },
    {
        accessorKey: 'description',
        header: ADJUSTMENT_HEADER_LABELS.description,
    }
]

export const AdjustmentHistoryTableColumns = [
    // {
    //     accessorKey: 'adjustment_index',
    //     header: 'Index',
    //     size: 50,
    // },
    {
        accessorKey: 'use_yn',
        header: ADJUSTMENT_HEADER_LABELS.use_yn,
        Cell: FormatUseYnToggle,
    },
    {
        accessorKey: 'tax_free_yn',
        header: ADJUSTMENT_HEADER_LABELS.tax_free_yn,
        Cell: FormatUseYnToggle,
    },
    // {
    //     accessorKey: 'adjustment_code',
    //     header: '조정 대상 구분',
    //     Cell: AdjustmentCell_Code,
    // },
    // {
    //     accessorKey: 'adjustment_code_value',
    //     header: '조정 대상',
    // },
    {
        accessorKey: 'adjustment_category',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_category,
        Cell: AdjustmentCell_Category
    },
    {
        accessorKey: 'adjustment_type',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_type,
        Cell: AdjustmentCell_Type
    },
    {
        accessorKey: 'mount_type',
        header: ADJUSTMENT_HEADER_LABELS.mount_type,
        Cell: AdjustmentCell_Amount,
    },
    {
        accessorKey: 'adjustment_cycle',
        header: ADJUSTMENT_HEADER_LABELS.adjustment_cycle,
        Cell: AdjustmentCell_Cycle
    },
    {
        accessorKey: 'mount_value',
        header: ADJUSTMENT_HEADER_LABELS.mount_value,
        Cell: renderNumberCell,
        ...applyRightAlignStyles()
    },
    {
        accessorKey: 'date_index',
        header: ADJUSTMENT_HEADER_LABELS.date_index,
        Cell: formatDateIndex,
    },
    {
        accessorKey: 'description',
        header: ADJUSTMENT_HEADER_LABELS.description,
    },
    {
        accessorKey: 'user_id',
        header: 'User ID',
    },
    {
        accessorKey: 'update_date',
        header: 'Update Date',
        Cell: formatDateTime
    }
]