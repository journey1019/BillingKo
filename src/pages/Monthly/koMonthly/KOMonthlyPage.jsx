import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";


import ReusableTable from "@/components/table/ReusableTable.jsx";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import { MonthlyTableColumns } from "@/columns/MonthlyTableColumns.jsx";
import { KOMonthlyTableOptions } from "@/options/KOMonthlyTableOptions.jsx";
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import DeviceMonthlyForm from '@/components/form/Monthly/DeviceMonthlyForm.jsx';
import { IoMdClose } from 'react-icons/io';
import useKOMonthlyStore from '@/stores/koMonthlyStore.js';

/**
 * @desc: 단말기별 청구서 수정 페이지
 * */
const KOMonthlyPage = () => {
    const [searchParams] = useSearchParams();
    const urlYearMonth = searchParams.get("yearMonth"); // ex) '202402'
    const urlSerial = searchParams.get("serial");

    const { selectedDate, handleDateChange, yearMonth } = useYearMonth(urlYearMonth);

    const {
        koMonthlyData,
        koMonthlyLoading,
        koMonthlyError,
        fetchKOMonthlyData,
        selectedMonthlyIndex,
        setSelectedMonthlyIndex,
        resetSelection,
        isExpanded,
        detailData,
        detailError,
        detailLoading,
        fetchDetailData,
        detailVersionData,
        detailVersionLoading,
        detailVersionError,
        fetchVersionData,
        version,
        latestVersion,
        setVersion
    } = useKOMonthlyStore();

    // '고객별 청구' 페이지에서 단말기 상세 정보 보려고 할때
    // 필터 초기값 구성
    const [columnFilters, setColumnFilters] = useState(() => {
        return urlSerial
            ? [{ id: "serial_number", value: urlSerial }]
            : [];
    });

    useEffect(() => {
        resetSelection(); // ✅ 진입 시 선택 초기화
    }, []);

    useEffect(() => {
        fetchKOMonthlyData(yearMonth);
    }, [yearMonth]);
    // console.log(koMonthlyData)

    console.log(urlSerial)
    useEffect(() => {
        if (!koMonthlyData || !urlSerial) return;

        const matchedItem = koMonthlyData.find(item => item.serial_number === urlSerial);
        if (matchedItem) {
            console.log(matchedItem)
            setSelectedMonthlyIndex(matchedItem);
            fetchDetailData(matchedItem.data_index);
        }
    }, [koMonthlyData, urlSerial]);
    console.log(selectedMonthlyIndex)

    // 선택이 바뀔 때 상세 기본 데이터
    useEffect(() => {
        if (!selectedMonthlyIndex) return;
        console.log(selectedMonthlyIndex)
        fetchDetailData(selectedMonthlyIndex.data_index);
    }, [selectedMonthlyIndex]);

    console.log('detailData: ', detailData)
    console.log(selectedMonthlyIndex)
    console.log(yearMonth)

    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            <div className="col-span-6 border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-xl font-base font-bold">단말기별 청구서 수정 및 저장 페이지</h1>
            </div>

            <div className={`p-2 ${isExpanded ? "col-span-2" : "col-span-6"}`}>
                <div>
                    <div className="flex flex-row items-center justify-between mb-3 relative z-10">
                        <h1 className="text-xl font-bold">단말기 청구서 테이블</h1>
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                    </div>
                    {koMonthlyLoading ? (
                        <LoadingSpinner />
                    ) : koMonthlyError ? (
                        <p className="text-red-500">{koMonthlyError}</p>
                    ) : (
                        <ReusableTable
                            data={koMonthlyData || []}
                            exportFileName="KO_Monthly_Report"
                            showExportButton={true} // ✅ 이 테이블에서는 CSV 버튼 활성화
                            columns={[{ accessorKey: "data_index", header: "Data Index", enableHiding: true }, ...MonthlyTableColumns]}
                            options={{
                                ...KOMonthlyTableOptions(selectedMonthlyIndex),
                                meta: {
                                    onRowSelect: (row) => {
                                        if (selectedMonthlyIndex?.data_index === row.data_index) {
                                            resetSelection(); // 명시적 해제
                                        } else {
                                            setSelectedMonthlyIndex(row); // 명시적 선택
                                        }
                                    },
                                },
                                // ✅ 필터 상태 연결
                                state: {
                                    columnFilters,
                                },
                                onColumnFiltersChange: setColumnFilters,
                            }}
                        />
                    )}
                </div>
            </div>

            {isExpanded && selectedMonthlyIndex && (
                <div className="px-2 py-4 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row items-center">
                                <h1 className="text-xl font-bold text-gray-700 align-center text-center justify-center">{selectedMonthlyIndex.acct_num} _ {selectedMonthlyIndex.serial_number}</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSelectedMonthlyIndex(null);
                                }}
                                className="p-2 rounded-md text-black hover:text-gray-500"
                            >
                                <IoMdClose />
                            </button>
                        </div>
                        <div>
                            {detailLoading || detailVersionLoading ? (
                                <LoadingSpinner />
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailError}</p>
                            ) : (
                                <>
                                    <DeviceMonthlyForm
                                        detailData={detailVersionData || detailData}
                                        version={version}
                                        latestVersion={latestVersion}
                                        setVersion={setVersion}
                                        fetchVersionData={fetchVersionData}
                                        fetchDetailData={fetchDetailData}
                                        originalSerialNumber={selectedMonthlyIndex.monthly_primary_key}
                                        yearMonth={yearMonth}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KOMonthlyPage;
