import PropTypes from "prop-types"; // PropTypes 추가
import { MaterialReactTable } from "material-react-table";
import { Box, Button } from "@mui/material";
import { saveAs } from "file-saver";
import { exportVisibleToExcel } from '@/utils/excelExporter.js';

const ReusableTable = ({ columns, data = [], options = {}, isLoading = false, error = null, exportFileName = "exported_file_name", showExportButton = false, }) => {
    const exportToCSV = () => {
        if (!data || data.length === 0) {
            console.error("No data available for export");
            return;
        }

        // console.log("Exporting data:", data);

        // 모든 필드 가져오기 (첫 번째 객체 기준)
        const allFields = Object.keys(data[0] || {});
        if (allFields.length === 0) {
            console.error("No valid fields found in data");
            return;
        }

        // CSV 헤더 생성
        const csvHeaders = allFields.join(",");

        // CSV 데이터 변환
        const csvRows = data.map((row) =>
            allFields
                .map((field) => {
                    const value = row[field];

                    // ✅ 객체 또는 배열이면 JSON 문자열로 변환
                    if (typeof value === "object" && value !== null) {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    // 일반 값이면 그대로 반환
                    return `"${value}"`;
                })
                .join(",")
        );

        // 최종 CSV 내용
        const csvContent = [csvHeaders, ...csvRows].join("\n");

        // CSV 파일 저장
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${exportFileName}.csv`);
    };


    // 공통 스타일 설정
    const defaultOptions = {
        initialState: {
            density: "compact", // 모든 테이블의 기본 density 설정
        },
        defaultColumn: {
            size: 50,
            minSize: 50,
            maxSize: 200,
        },
        // renderDetailPanel: null, // 기본적으로 세부 정보 패널 비황설화
        // ✅ 선택 셀(UI) 숨기기
        // muiTableBodyCellProps: ({ cell }) => {
        //     if (cell.column.id === 'mrt-row-select') {
        //         return {
        //             sx: { display: 'none' },
        //         };
        //     }
        //     return {};
        // },
    };

    // 병합된 옵션
    const mergedOptions = {
        ...defaultOptions, // 공통 옵션
        ...options, // 외부에서 전달된 개별 옵션
        initialState: {
            ...defaultOptions.initialState,
            ...options?.initialState, // 외부 초기 상태 병합
        },
        defaultColumn: {
            ...defaultOptions.defaultColumn,
            ...options?.defaultColumn, // 외부 기본 컬럼 병합
        },
        // enableRowSelection: true, // Row 선택 가능
        // enableRowActions: true, // Row 액션 추가
        // renderTopToolbarCustomActions: ({ table }) => (
        //     <Box sx={{ display: 'flex', gap: 1 }}>
        //         {showExportButton && (
        //             <>
        //                 <Button
        //                     variant="outlined"
        //                     color="primary"
        //                     onClick={() => exportToCSV()}
        //                 >
        //                     Export to CSV
        //                 </Button>
        //                 <Button
        //                     variant="outlined"
        //                     color="success"
        //                     onClick={() => exportVisibleToExcel(table, `${exportFileName}.xlsx`)}
        //                 >
        //                     Export to Excel
        //                 </Button>
        //             </>
        //         )}
        //     </Box>
        // ),

    };

    return (
        <>
            {error ? (
                <p className="text-red-500">Failed to load data: {error}</p>
            ) : (
                <MaterialReactTable
                    columns={columns} // 필수 컬럼 정의
                    data={data} // 데이터 배열
                    state={{
                        isLoading: isLoading, // Loading 애니메이션 활성화
                        ...options?.state,  // ✅ 외부 state 통합
                    }}
                    muiCircularProgressProps={{
                        color: 'secondary',
                        thickness: 5,
                        size: 55,
                    }}
                    muiSkeletonProps={{
                        animation: 'pulse',
                        height: 28,
                    }}
                    getRowProps={({ row }) => ({  // Row 클릭 이벤트
                        onClick: (event) => {
                            event.stopPropagation(); // 이벤트 전파 차단
                            // console.log("Row Clicked:", row.original);
                            options?.meta?.onRowSelect?.(row.original);
                        },
                        style: { cursor: "pointer" },
                    })}
                    renderRowActions={({ row }) => (
                        <div>
                            <input
                                type="radio"
                                name="rowSelect"
                                onClick={(event) => {
                                    event.stopPropagation(); // 이벤트 전파 차단
                                    // console.log("Row Selected:", row.original);
                                    options?.meta?.onRowSelect?.(row.original);
                                }}
                            />
                        </div>
                    )}
                    {...mergedOptions} // 병합된 옵션 전달
                    renderDetailPanel={options.renderDetailPanel} // ✅ renderDetailPanel 직접 전달
                />
            )}
        </>
    );
};

ReusableTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            accessorKey: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            Cell: PropTypes.func, // Cell 함수형 컴포넌트
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    // data: PropTypes.arrayOf(PropTypes.object), // ✅ 전체 데이터 PropTypes 추가
    showExportButton: PropTypes.bool, // ✅ Export 버튼을 표시할지 여부
    exportFileName: PropTypes.string, // ✅ Export 파일명 Prop 추가
    options: PropTypes.shape({
        initialState: PropTypes.object,
        defaultColumn: PropTypes.object,
        enablePagination: PropTypes.bool,
        enableRowSelection: PropTypes.bool,
        renderDetailPanel: PropTypes.func, // renderDetailPanel 함수 정의
        meta: PropTypes.shape({ // Row 클릭 이벤트 PropTypes 정의
            onRowSelect: PropTypes.func,
        }),
    }),
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};


// 기본 props 설정
// ReusableTable.defaultProps = {
//     options: {}, // 기본값은 빈 객체
//     isLoading: false,
//     error: null,
// };

export default ReusableTable;
