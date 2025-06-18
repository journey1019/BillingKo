import { convertUTCToKST } from '@/utils/time';
import { Switch } from '@mui/material';
import dayjs from 'dayjs';

// ✅ 셀 내부에 오른쪽 테두리 (값 렌더링 + tailwind class 사용)
export const renderDivisionCell = ({ cell }) => (
    <div>
        {/*<div className="border-r-2 border-gray-300 pr-2">*/}
        {cell.getValue() ? cell.getValue().toLocaleString?.() ?? cell.getValue() : ''}
    </div>
);

// ✅ 테이블 헤더/바디에 스타일 적용
export const applyRightDivisionStyles = () => ({
    muiTableHeadCellProps: {
        sx: {
            borderRight: '2px solid rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
        },
    },
    muiTableBodyCellProps: {
        sx: {
            borderRight: '2px solid rgba(0, 0, 0, 0.1)',
            // textAlign: 'right',
        },
    },
});

// ✅ 숫자 (오른쪽 정렬)
export const renderNumberCell = ({ cell }) => (
    <div className="text-right font-bold pr-3">{cell.getValue().toLocaleString()}</div>
);
export const renderNumberCellUnder = ({ cell }) => (
    <div className="text-right font-bold underline pr-3">{cell.getValue().toLocaleString()}</div>
);
export const renderNumberCellNotBold = ({ cell }) => (
    <div className="text-right pr-3">{cell.getValue().toLocaleString()}</div>
);
// ✅ 숫자 (헤더 오른쪽 정렬)
export const applyRightAlignStyles = () => ({
    muiTableHeadCellProps: {
        sx: {
            '& .Mui-TableHeadCell-Content': {
                justifyContent: "flex-end !important",
                textAlign: "right !important",
                whiteSpace: "wrap"
            },
            borderRight: '2px solid rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
        }
    },
    muiTableBodyCellProps: {
        sx: {
            textAlign: "right",
            borderRight: '2px solid rgba(0, 0, 0, 0.1)',
        }
    }
});

// ✅ 버튼 (가운데 정렬)
export const renderButtonCell = ({ cell }) => (
    <div className="text-center font-bold pr-3">{cell.getValue().toLocaleString()}</div>
);
// ✅ 버튼 (헤더 가운데 정렬)
export const applyCenterAlignStyles = () => ({
    muiTableHeadCellProps: {
        sx: {
            '& .Mui-TableHeadCell-Content': {
                justifyContent: "center", // ✅ 올바른 값
                textAlign: "center",
                whiteSpace: "nowrap", // ✅ 텍스트 줄바꿈 방지 (wrap → nowrap)
            },
        },
    },
    muiTableBodyCellProps: {
        sx: {
            textAlign: "center",
            justifyContent: "center", // ✅ 필요 시 적용
            alignItems: "center", // ✅ 수직 정렬도 필요하면 추가
        },
    },
});


// ✅ 화면 출력 시 UTC → KST 로 변환해서 보여주기
// export const formatDateTimeUTCtoKST = ({ cell }) => {
//     const value = cell.getValue();
//     return convertUTCToKST(value);
// };
// 💡 editedUsers를 외부에서 주입할 수 있도록 매개변수화
export const getFormatDateTimeUTCtoKST = (editedUsers) => {
    return ({ cell, row }) => {
        const acct_num = row.original.acct_num;
        const edited = editedUsers?.[acct_num]?.confirm_payment_date;
        const rawValue = edited ?? cell.getValue();
        return convertUTCToKST(rawValue);
    };
};


export const useYNSwitch = ({ cell }) => {
    const value = cell.getValue() || '';
    return(
        <div className="text-center m-0">
            <Switch
                checked={value === 'Y'}
                disabled
                color="primary"
                size="small"
            />
        </div>
    )
}


export const renderUseConfirmYN = ({ cell }) => {
    const value = cell.getValue() || '';
    const label = value === 'Y' ? '완납' : value === 'P' ? '부분납' : '미납';
    const color = value === 'Y' ? '#53d571' : value === 'P' ? '#ffd147' : '#e46774';
    return(
        <div className="text-center m-0">
            <span
                style={{
                    color: color,
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderWidth: 0.5,
                    borderColor: color,
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                }}
            >
                {label}
            </span>
        </div>
    )
}

export const renderPaymentMethod = ({ cell }) => {
    const value = cell.getValue() || '';
    const label = value === 'giro' ? '지로' : value === 'account' ? '은행' : '';
    const color = value === 'giro' ? '#5a2eea' : value === 'account' ? '#ea9f2e' : '#8e8e8e';
    return(
        <div className="text-center m-0">
            <span
                style={{
                    color: color,
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderWidth: 0.5,
                    borderColor: color,
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                }}
            >
                    {label}
                </span>
        </div>
    )
}

/**
 * 날짜 문자열을 'YYYY-MM-DDTHH:mm:ss' -> 'YYYY-MM-DD' 형식으로 변환
 * @param {string | Date | null | undefined} value
 * @returns {string} 변환된 날짜 문자열, 변환 불가시 빈 문자열
 */
export const formatDateToYMD = (value) => {
    if (!value) return '';

    const parsed = dayjs(value);
    if (!parsed.isValid()) return '';

    return parsed.format('YYYY-MM-DD');
};