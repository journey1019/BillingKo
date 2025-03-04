import { MdEdit } from "react-icons/md";
import { useState } from 'react';
import clsx from 'clsx';
import Dropdown from '@/components/dropdown/Dropdown.jsx';
import BasicDropdownForm from '@/components/form/Monthly/Edit/BasicDropdownForm.jsx';
import UsageDetailDropdownForm from '@/components/form/Monthly/Edit/UsageDetailDropdownForm.jsx';
import PaymentDropdownForm from '@/components/form/Monthly/Edit/PaymentDropdownForm.jsx';


const KOMonthlyForm = ({ detailData, version, latestVersion, setVersion, fetchVersionData }) => {
    if (!detailData) return <p>No data available</p>;


    // 날짜 T 제거 포맷팅 함수
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toISOString().replace("T", " ").slice(0, 19);
    };


    // 천 단위 숫자 포맷팅 함수
    const formatNumber = (num) => {
        if (typeof num !== "number") return num; // 숫자가 아닌 경우 그대로 반환
        return num.toLocaleString("en-US"); // 천 단위 ',' 추가
    };

    const EventTable = ({ title, data, detailData }) => {
        if (!data || data.length === 0) return null;

        return (
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-600">{title} ({data?.length || 0})</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-1">Check Code</th>
                        <th className="border border-gray-300 px-4 py-1">Con Type</th>
                        <th className="border border-gray-300 px-4 py-1">Discount Code</th>
                        <th className="border border-gray-300 px-4 py-1">Event Date</th>
                        <th className="border border-gray-300 px-4 py-1">Volumn Unit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((code, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-4 py-1">{code.check_code}</td>
                            <td className="border border-gray-300 px-4 py-1">{code.con_type}</td>
                            <td className="border border-gray-300 px-4 py-1">{code.discount_code}</td>
                            <td className="border border-gray-300 px-4 py-1">{formatDateTime(code.event_date)}</td>
                            <td className="border border-gray-300 px-4 py-1">{formatNumber(code.volumn_unit)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };
    // const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    // const handleEdit = () => setIsOpenDropdown(!isOpenDropdown);
    // const closeDropdown = () => setIsOpenDropdown(false);


    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold mb-2 text-gray-700">{detailData.acct_num} _ {detailData.serial_number}</h2>

                {/* 버전 변경 버튼 */}
                <div className="text-end space-x-4 justify-end">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                        onClick={() => {
                            const newVersion = Math.max(version - 1, 0);
                            setVersion(newVersion);
                            fetchVersionData(detailData.monthly_primary_key, newVersion);
                        }}
                        disabled={version <= 0}
                    >
                        ◀
                    </button>
                    <span className="font-bold">Version {version}</span>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                        onClick={() => {
                            const newVersion = version + 1;
                            setVersion(newVersion);
                            fetchVersionData(detailData.monthly_primary_key, newVersion);
                        }}
                        disabled={version >= latestVersion} // 최신 버전 이상이면 비활성화
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* 마지막 업데이트 정보 */}
            <div className="text-gray-500 text-sm mb-6">
                Updated By: <span className="text-gray-700 font-semibold">{detailData.user_id || "-"}</span> | Last
                Update: <span
                className="text-gray-700 font-semibold">{formatDateTime(detailData.update_date) || '-'}</span>
            </div>

            <div className="border rounded-lg px-4 py-2 mb-2">
                {/*/!* ✅ 드롭다운 사용 예제 *!/*/}
                {/*<div className="relative inline-block float-right">*/}
                {/*    /!* ✅ 오른쪽 정렬 드롭다운 *!/*/}
                {/*    <Dropdown trigger={<MdEdit />} position="right">*/}
                {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit Item</li>*/}
                {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">Delete Item</li>*/}
                {/*    </Dropdown>*/}
                {/*</div>*/}
                <BasicDropdownForm detailData={detailData}/>

                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Data Index:</div>
                    <div className=" col-span-1 ml-1">{detailData.data_index}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Profile ID:</div>
                    <div className=" col-span-1">{detailData.profile_id}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Account Number:</div>
                    <div className=" col-span-1">{detailData.acct_num}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Alias :</div>
                    <div className=" col-span-1">{detailData.alias}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Serial Number:</div>
                    <div className="flex flex-row col-span-1">{detailData.serial_number}<span
                        className="pl-2 text-gray-500">({detailData.monthly_primary_key})</span></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">PPID:</div>
                    <div className=" col-span-1">{detailData.ppid}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm">
                    <div className="text-gray-500">Activation Date:</div>
                    <div className=" col-span-1">{formatDateTime(detailData.activate_date)}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-gray-500">Deactivation Date:</div>
                    <div className=" col-span-1">{formatDateTime(detailData.deactivate_date) || '-'}</div>
                </div>
            </div>

            {/*<button onClick={handleEdit}*/}
            {/*    className="grid grid-cols-1 gap-4 mt-1 text-sm justify-end text-end float-right hover:text-gray-500">*/}
            {/*    <MdEdit className="w-4 h-4"/>*/}
            {/*</button>*/}
            {/*/!* ✅ 드롭다운 메 뉴 (애니메이션 효과 추가) *!/*/}
            {/*<div*/}
            {/*    className={clsx(*/}
            {/*        'absolute left-0 top-full mt-1 w-36 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 border border-gray-300',*/}
            {/*        'transition-all duration-200 ease-in-out transform',*/}
            {/*        isOpenDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',*/}
            {/*    )}*/}
            {/*    onMouseLeave={closeDropdown}*/}
            {/*>*/}
            {/*    <ul className="py-2 text-sm text-gray-700">*/}
            {/*        /!* 재사용 컨텐츠 *!/*/}
            {/*        <div className="text-end space-x-2">*/}
            {/*            <button className="p-1 rounded-md border border-gray-700">Save</button>*/}
            {/*            <button onClick={closeDropdown} className="p-1 rounded-md bg-blue-500 text-white">Close</button>*/}
            {/*        </div>*/}
            {/*    </ul>*/}
            {/*</div>*/}
            {/* 기본 정보 */}

            <div className="border rounded-lg px-4 py-2">
                <UsageDetailDropdownForm detailData={detailData} />
                <div className="mb-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Details</h3>
                    <div className="grid grid-cols-4 gap-1 text-sm">
                        <div className="text-gray-500">Free Bytes:</div>
                        <div className=" col-span-1">{formatNumber(detailData.free_bytes)}</div>
                        <div className="text-gray-500">Total Used Bytes:</div>
                        <div className=" col-span-1">{formatNumber(detailData.use_byte_total)}</div>
                        <div className="text-gray-500">Use Period:</div>
                        <div className=" col-span-1">{detailData.use_period} days</div>
                        <div className="text-gray-500">Use Percent of Month:</div>
                        <div className=" col-span-1">{detailData.use_percent_of_month}%</div>
                    </div>
                </div>
            </div>

            <div className="mb-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Period Detail</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-2 py-1">Account Numer</th>
                        <th className="border border-gray-300 px-2 py-1">Activation Date</th>
                        <th className="border border-gray-300 px-2 py-1">Deactivation Date</th>
                        <th className="border border-gray-300 px-2 py-1">Deactivation Profile ID</th>
                        <th className="border border-gray-300 px-2 py-1">Use Percent of month</th>
                        <th className="border border-gray-300 px-2 py-1">Use Period</th>
                    </tr>
                    </thead>
                    <tbody>
                    {detailData.use_period_detail && detailData.use_period_detail.length > 0 ? (
                        detailData.use_period_detail.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-2 py-1">{item.acct_num}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.act_date}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.deact_date || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.deact_profile_id}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.use_percent_of_month}%</td>
                                <td className="border border-gray-300 px-2 py-1">{item.use_period} 일</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center p-1">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 결제 정보 */}
            {/* 사용량 정보 */}
            <div className="border rounded-lg px-4 py-2">
                <PaymentDropdownForm detailData={detailData} />
                <div className="mb-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Payment Details</h3>
                    <div className="grid grid-cols-4 gap-1 text-sm">
                        <div className="text-gray-500">Basic Fee:</div>
                        <div className=" col-span-1">{formatNumber(detailData.payment?.basic_fee)} 원</div>
                        <div className="text-gray-500">Final Fee:</div>
                        <div className=" col-span-1">{formatNumber(detailData.payment?.final_fee)} 원</div>
                        <div className="text-gray-500">Total Fee:</div>
                        <div className=" col-span-1">{formatNumber(detailData.payment?.total_fee)} 원</div>
                        <div className="text-gray-500">Subscribe Fee:</div>
                        <div className=" col-span-1">{formatNumber(detailData.payment?.subscribe_fee)} 원</div>
                    </div>
                </div>
                <div className="text-gray-500 border-b mb-2" />
                {/* 기타 정보 */}
                <div className="mb-2">
                    <div className="grid grid-cols-4 gap-1 text-sm">
                        <div className="text-gray-500">Additional Usage Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.add_use_fee)} 원</div>
                        <div className="text-gray-500">Cut-off Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.cut_off_fee)} 원</div>
                        <div className="text-gray-500">Modification Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.modification_fee)} 원</div>
                    </div>
                </div>
            </div>

            {/* 요금 상세 (Table) */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-600">Fee Detail</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-2 py-1">Company</th>
                        <th className="border border-gray-300 px-2 py-1">Classification</th>
                        <th className="border border-gray-300 px-2 py-1">Billing Fee</th>
                        <th className="border border-gray-300 px-2 py-1">Period</th>
                        <th className="border border-gray-300 px-2 py-1">Use / Def Byte</th>
                        <th className="border border-gray-300 px-2 py-1">Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {detailData.payment?.fee_detail?.map((fee, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-2 py-1">{fee.apply_company}</td>
                            <td className="border border-gray-300 px-2 py-1">{fee.classfication}</td>
                            <td className="border border-gray-300 px-2 py-1">{formatNumber(fee.billing_fee)} 원</td>
                            <td className="border border-gray-300 px-2 py-1">{fee.act_date_period}</td>
                            <td className="border border-gray-300 px-2 py-1">{fee.use_byte}/{fee.default_byte}</td>
                            <td className="border border-gray-300 px-2 py-1">{fee.note}</td>
                        </tr>
                    )) || <tr>
                        <td colSpan="5" className="text-center p-2">No data available</td>
                    </tr>}
                    </tbody>
                </table>
            </div>

            {/* ACT, DAT, MMF, DCT 항목별 상세 테이블을 `EventTable`로 대체 */}
            <EventTable title="ACT" data={detailData.act} />
            <EventTable title="DAT" data={detailData.dat} />
            <EventTable title="MMF" data={detailData.mmf} />
            <EventTable title="DCT" data={detailData.dct} />

            {/* 상세 사용량 (Table) */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Byte Detail</h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-2 py-1">Connection Type</th>
                        <th className="border border-gray-300 px-2 py-1">Used Bytes</th>
                        <th className="border border-gray-300 px-2 py-1">Free Byte Code</th>
                    </tr>
                    </thead>
                    <tbody>
                    {detailData.use_byte_detail?.map((item, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-2 py-1">{item.con_type}</td>
                            <td className="border border-gray-300 px-2 py-1">{formatNumber(item.use_byte)}</td>
                            <td className="border border-gray-300 px-2 py-1">{formatNumber(item.free_byte_code)}</td>
                        </tr>
                    )) || <tr>
                        <td colSpan="3" className="text-center p-1">No data available</td>
                    </tr>}
                    </tbody>
                </table>
            </div>

            {/* 기타 이벤트 데이터 */}
            {/*<div className="mb-2">*/}
            {/*    <h3 className="text-lg font-semibold mb-2 text-gray-600">Event Logs</h3>*/}
            {/*    <div className="grid grid-cols-4 gap-1 text-sm">*/}
            {/*        <div className="text-gray-500">MMF Events:</div>*/}
            {/*        <div className="col-span-1">{detailData.mmf?.length || 0}</div>*/}
            {/*        <div className="text-gray-500">DAT Events:</div>*/}
            {/*        <div className="col-span-1">{detailData.dat?.length || 0}</div>*/}
            {/*        <div className="text-gray-500">ACT Events:</div>*/}
            {/*        <div className="col-span-1">{detailData.act?.length || 0}</div>*/}
            {/*        <div className="text-gray-500">DCT Events:</div>*/}
            {/*        <div className="col-span-1">{detailData.dct?.length || 0}</div>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
};

export default KOMonthlyForm;
