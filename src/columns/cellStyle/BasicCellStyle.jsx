// ✅ 텍스트 (왼쪽 정렬)
export const renderTextCell = ({ cell }) => (
    <div className="text-left">{cell.getValue()}</div>
);

// ✅ 숫자 (오른쪽 정렬)
export const renderNumberCell = ({ cell }) => (
    <div style={{ textAlign: "right" }}>{cell.getValue().toLocaleString()}</div>
);


// ✅ 숫자 (헤더 오른쪽 정렬)
export const applyRightAlignStyles = () => ({
    muiTableHeadCellProps: {
        sx: {
            '& .Mui-TableHeadCell-Content': {
                justifyContent: "flex-end !important",
                textAlign: "right !important",
                whiteSpace: "wrap"
            }
        }
    },
    muiTableBodyCellProps: {
        sx: {
            textAlign: "right",
        }
    }
});
