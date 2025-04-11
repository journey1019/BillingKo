// ✅ 텍스트 (왼쪽 정렬)
export const renderTextCell = ({ cell }) => (
    <div className="text-left">{cell.getValue()}</div>
);

// ✅ 숫자 (오른쪽 정렬)
export const renderNumberCell = ({ cell }) => (
    <div style={{ textAlign: "right" }}>{cell.getValue().toLocaleString()}</div>
);

// ✅ 버튼 (중앙 정렬)
export const renderButtonCell = ({ cell }) => (
    <div style={{ textAlign: "center" }}>{cell.getValue().toLocaleString()}</div>
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