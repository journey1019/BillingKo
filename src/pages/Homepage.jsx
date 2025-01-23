import { useState } from 'react';
import useFetch from "@/hooks/useFetch.js";
import { MonthlyTableColumns } from '@/columns/MonthlyTableColumns';
import { MonthlyTableOptions } from '@/options/MonthlyTableOptions.jsx';
import ReusableTable from "@/components/table/ReusableTable";
import SingleDatePicker from '@/components/time/SingleDatePicker.jsx';

const Homepage = () => {
    // 데이터 가져오기
    const { data, loading, error } = useFetch("/data/monthly.json");
    const [selectedRow, setSelectedRow] = useState(null); // 선택된 Row의 데이터 저장
    const [date, setDate] = useState(null);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Row 클릭 핸들러
    const handleRowClick = (row) => {
        setSelectedRow(row.original); // 클릭된 Row 데이터 저장
        const drawer = document.getElementById('drawer-body-scrolling');
        if (drawer) {
            drawer.classList.remove('hidden', '-translate-x-full');
        }
    };

    // Drawer 닫기
    const closeDrawer = () => {
        setSelectedRow(null);
        const drawer = document.getElementById('drawer-body-scrolling');
        if (drawer) {
            drawer.classList.add('hidden', '-translate-x-full');
        }
    };

    // 날짜 선택
    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between">
                    <h1 className="py-1 text-base font-bold">2024년 12월</h1>
                    {/* SingleDatePicker */}
                    <div className="z-10">
                        <SingleDatePicker
                            value={date}
                            onDateChange={handleDateChange}
                            placeholder="Pick a date"
                        />
                        {date && (
                            <p className="text-gray-700">
                                Selected Date: {date.toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <ReusableTable
                    columns={MonthlyTableColumns}
                    data={data}
                    options={{
                        ...MonthlyTableOptions,
                        onRowClick: handleRowClick, // Row 클릭 이벤트 전달
                    }}
                />
            </div>

            {/* Drawer */}
            <div
                id="drawer-body-scrolling"
                className="fixed top-0 right-0 z-40 h-screen w-1/3 p-4 bg-white shadow-lg hidden transition-transform transform translate-x-full"
                role="dialog"
                tabIndex="-1"
            >
                <div className="drawer-header p-4 border-b">
                    <h3 className="drawer-title text-lg font-semibold">Row Details</h3>
                    <button
                        type="button"
                        className="btn btn-text btn-circle btn-sm absolute right-3 top-3"
                        aria-label="Close"
                        onClick={closeDrawer}
                    >
                        <span>✕</span>
                    </button>
                </div>
                <div className="drawer-body p-4">
                    {selectedRow ? (
                        <>
                            <h2 className="text-lg font-bold">Details</h2>
                            <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
                        </>
                    ) : (
                        <p>No row selected.</p>
                    )}
                </div>
                <div className="drawer-footer p-4 border-t">
                    <button type="button" className="btn btn-soft btn-secondary" onClick={closeDrawer}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary">
                        Save changes
                    </button>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            {/*<div className="rounded bg-white p-6 shadow-md w-full">*/}
            {/*    <h1 className="text-2xl font-bold">Welcome to the Billing App!</h1>*/}
            {/*    <p className="mt-2 text-gray-600">This is the main content area.</p>*/}
            {/*</div>*/}


            {/* 테이블 및 Drawer 레이아웃 */}
            {/*<div className="grid grid-cols-3 gap-2">*/}
            {/*    /!* Table *!/*/}
            {/*    <div className={`col-span-${selectedRow ? "2" : "3"} transition-all`}>*/}
            {/*        <h1 className="py-1 text-base font-bold">Monthly Data</h1>*/}
            {/*        <ReusableTable*/}
            {/*            columns={MonthlyTableColumns}*/}
            {/*            data={data}*/}
            {/*            options={{*/}
            {/*                ...MonthlyTableOptions,*/}
            {/*                onRowClick: handleRowClick, // Row 클릭 이벤트 전달*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </div>*/}

            {/*    /!* Drawer *!/*/}
            {/*    {selectedRow && (*/}
            {/*        <div className="col-span-1 bg-white shadow-md p-6 w-full">*/}
            {/*            <h1 className="text-base font-bold">세부 정보</h1>*/}
            {/*            <pre>{JSON.stringify(selectedRow, null, 2)}</pre>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*    {selectedRow && (*/}
            {/*        <div className="col-span-1 bg-white shadow-md p-6">*/}
            {/*            <h1 className="text-base font-bold">세부 정보</h1>*/}
            {/*            <div>*/}
            {/*                <h2 className="font-bold mt-4">Use Byte Details</h2>*/}
            {/*                <ul>*/}
            {/*                    {(selectedRow.use_byte_detail || []).map((detail, index) => (*/}
            {/*                        <li key={index}>*/}
            {/*                            ConType: {detail.con_type}, FreeByteCode: {detail.free_byte_code}, Use Byte: {detail.use_byte}*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                    {!(selectedRow.use_byte_detail?.length) && <p>No use byte details available.</p>}*/}
            {/*                </ul>*/}

            {/*                <h2 className="font-bold mt-4">Payment Details</h2>*/}
            {/*                <ul>*/}
            {/*                    {selectedRow.payment?.fee_detail?.map((fee, index) => (*/}
            {/*                        <li key={index}>*/}
            {/*                            Classification: {fee.classfication}, Billing Fee: {fee.billing_fee} USD*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                    {!(selectedRow.payment?.fee_detail?.length) && <p>No payment details available.</p>}*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/* 테이블 섹션 */}
            {/*<div>*/}
            {/*    <h1 className="py-1 text-base font-bold">Monthly Data</h1>*/}
            {/*    <ReusableTable columns={MonthlyTableColumns} data={data} options={MonthlyTableOptions} />*/}
            {/*</div>*/}

            {/*<div className="flex flex-row">*/}
            {/*    <div style={{ width: "calc(100vw - 500px)" }}>*/}
            {/*        <ReusableTable columns={MonthlyTableColumns} data={data} options={MonthlyTableOptions} />*/}
            {/*    </div>*/}
            {/*    <div className="ml-2 w-full h-full bg-white rounded sha">*/}
            {/*        컴포넌트*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
};

export default Homepage;
