import PropTypes from "prop-types"; // PropTypes 추가
import { MaterialReactTable } from "material-react-table";

const ReusableTable = ({ columns, data = [], options = {} }) => {
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
        renderDetailPanel: null, // 기본적으로 세부 정보 패널 비황설화
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
    };

    return (
        <MaterialReactTable
            columns={columns} // 필수 컬럼 정의
            data={data} // 데이터 배열
            getRowProps={(row) => ({
                onClick: () => options?.onRowClick && options.onRowClick(row), // Row 클릭 이벤트
                style: { cursor: "pointer" }, // 포인터 커서 추가
            })}
            renderRowActions={({ row }) => (
                <div>
                    <input
                        type="radio"
                        name="rowSelect"
                        onClick={() => options?.onRowClick && options.onRowClick(row)}
                    />
                </div>
            )}
            {...mergedOptions} // 병합된 옵션 전달
        />
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
    options: PropTypes.shape({
        initialState: PropTypes.object,
        defaultColumn: PropTypes.object,
        enablePagination: PropTypes.bool,
        enableRowSelection: PropTypes.bool,
        renderDetailPanel: PropTypes.func, // renderDetailPanel 함수 정의
        onRowClick: PropTypes.func, // Row 클릭 이벤트 PropTypes 정의
    }),
};


// 기본 props 설정
ReusableTable.defaultProps = {
    options: {}, // 기본값은 빈 객체
};

export default ReusableTable;
