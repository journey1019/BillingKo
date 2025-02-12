import React from 'react';

const AdjustmentPartForm = ({ adjustPartData }) => {

    // Yes/No Toggle
    const isEnabled = adjustPartData.use_yn === 'Y'; // Y면 활성화된 토글, N이면 비활성화된 토글

    // 날짜 포맷터 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    return (
        <form className="grid grid-cols-2 gap-3">
            {/* Section: 기본 정보 */}
            <h2 className="col-span-2 text-md 2xl:text-lg font-semibold text-gray-800">조정된 이력 정보</h2>

            {/* Adjustment Index */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 인덱스</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.adjustment_index}</span>
            </div>

            {/* Adjustment Code */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 코드</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.adjustment_code}</span>
            </div>

            {/* Adjustment Code Value */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 코드 값</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.adjustment_code_value}</span>
            </div>

            {/* Adjustment Category */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 카테고리</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.adjustment_category}</span>
            </div>

            {/* Adjustment Type */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 타입</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.adjustment_type}</span>
            </div>

            {/* Mount Type */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">마운트 타입</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.mount_type}</span>
            </div>

            {/* Mount Value */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">마운트 값</label>
                <span className="mt-1 block text-sm 2xl:text-md">
                    {adjustPartData.mount_value ? adjustPartData.mount_value.toLocaleString() + ' 원' : ''}
                </span>
            </div>


            {/* Description */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">설명</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.description}</span>
            </div>

            {/* Adjustment Cycle */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">조정 주기</label>
                <span className="mt-1 block text-sm 2xl:text-md capitalize">{adjustPartData.adjustment_cycle}</span>
            </div>

            {/* Date Index */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">날짜 인덱스</label>
                <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.date_index}</span>
            </div>

            {/*{adjustPartData.user_id && adjustPartData.update && (*/}
            {/*    <>*/}
            {/*        /!* User ID *!/*/}
            {/*        <div>*/}
            {/*            <label className="block text-xs 2xl:text-sm font-medium text-gray-500">User ID</label>*/}
            {/*            <span className="mt-1 block text-sm 2xl:text-md">{adjustPartData.user_id}</span>*/}
            {/*        </div>*/}

            {/*        /!* 업데이트 날짜 *!/*/}
            {/*        <div>*/}
            {/*            <label className="block text-xs 2xl:text-sm font-medium text-gray-500">업데이트 날짜</label>*/}
            {/*            <span className="mt-1 block text-sm 2xl:text-md">{formatDate(adjustPartData.update)}</span>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}


            {/* 사용 여부 (Toggle 스타일) */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">사용 여부</label>
                <div className="mt-2 flex items-center space-x-2">
                    {/* 토글 버튼 */}
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                    >
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                    {/* 텍스트 표시 */}
                    <span className="text-xs 2xl:text-sm font-medium">{isEnabled ? 'Yes' : 'No'}</span>
                </div>
            </div>
        </form>
    );
};

export default AdjustmentPartForm;