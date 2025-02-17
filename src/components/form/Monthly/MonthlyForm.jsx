const MonthlyForm = ({ detailData }) => {
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

    const EventTable = ({ title, data }) => {
        if (!data || data.length === 0) return null;

        return (
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
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

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">Detail Information</h2>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">{detailData.acct_num} _ {detailData.serial_number}</h2>

                {/* 기본 정보 */}
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Data Index:</div>
                    <div className=" col-span-1">{detailData.data_index}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Profile ID:</div>
                    <div className=" col-span-1">{detailData.profile_id}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Account Number:</div>
                    <div className=" col-span-1">{detailData.acct_num}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Serial Number:</div>
                    <div className="flex flex-row col-span-1">{detailData.serial_number}<span className="pl-2 text-gray-500">({detailData.monthly_primary_key})</span></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">PPID:</div>
                    <div className=" col-span-1">{detailData.ppid}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Activation Date:</div>
                    <div className=" col-span-1">{formatDateTime(detailData.activate_date)}</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="text-gray-500">Deactivation Date:</div>
                    <div className=" col-span-1">{formatDateTime(detailData.deactivate_date) || '-'}</div>
                </div>

                {/* 사용량 정보 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Details</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
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

                {/* 기간별 세부 사용량 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Period Detail</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Account Numer</th>
                            <th className="border border-gray-300 px-4 py-2">Activation Date</th>
                            <th className="border border-gray-300 px-4 py-2">deactivation Date</th>
                            <th className="border border-gray-300 px-4 py-2">deactivation Profile ID</th>
                            <th className="border border-gray-300 px-4 py-2">Use Percent of month</th>
                            <th className="border border-gray-300 px-4 py-2">Use Period</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detailData.use_period_detail?.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{item.acct_num}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.act_date}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.deact_date || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.deact_profile_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.use_percent_of_month}%</td>
                                <td className="border border-gray-300 px-4 py-2">{item.use_period} 일</td>
                            </tr>
                        )) || <tr>
                            <td colSpan="3" className="text-center p-2">No data available</td>
                        </tr>}
                        </tbody>
                    </table>
                </div>

                {/* 결제 정보 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Payment Details</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
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
                <div className="text-gray-500 border-b mb-3"/>
                {/* 기타 정보 */}
                <div className="mb-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-gray-500">Additional Usage Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.add_use_fee)} 원</div>
                        <div className="text-gray-500">Cut-off Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.cut_off_fee)} 원</div>
                        <div className="text-gray-500">Modification Fee:</div>
                        <div className="col-span-1">{formatNumber(detailData.payment?.modification_fee)} 원</div>
                    </div>
                </div>

                {/* 요금 상세 (Table) */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Fee Breakdown</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Company</th>
                            <th className="border border-gray-300 px-4 py-2">Classification</th>
                            <th className="border border-gray-300 px-4 py-2">Billing Fee</th>
                            <th className="border border-gray-300 px-4 py-2">Period</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detailData.payment?.fee_detail?.map((fee, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{fee.apply_company}</td>
                                <td className="border border-gray-300 px-4 py-2">{fee.classfication}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatNumber(fee.billing_fee)} 원</td>
                                <td className="border border-gray-300 px-4 py-2">{fee.act_date_period}</td>
                            </tr>
                        )) || <tr>
                            <td colSpan="4" className="text-center p-2">No data available</td>
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
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Usage Byte Detail</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Connection Type</th>
                            <th className="border border-gray-300 px-4 py-2">Used Bytes</th>
                            <th className="border border-gray-300 px-4 py-2">Free Byte Code</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detailData.use_byte_detail?.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{item.con_type}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatNumber(item.use_byte)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatNumber(item.free_byte_code)}</td>
                            </tr>
                        )) || <tr>
                            <td colSpan="3" className="text-center p-2">No data available</td>
                        </tr>}
                        </tbody>
                    </table>
                </div>

                {/* 기타 이벤트 데이터 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-600">Event Logs</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-gray-500">MMF Events:</div>
                        <div className="col-span-1">{detailData.mmf?.length || 0}</div>
                        <div className="text-gray-500">DAT Events:</div>
                        <div className="col-span-1">{detailData.dat?.length || 0}</div>
                        <div className="text-gray-500">ACT Events:</div>
                        <div className="col-span-1">{detailData.act?.length || 0}</div>
                        <div className="text-gray-500">DCT Events:</div>
                        <div className="col-span-1">{detailData.dct?.length || 0}</div>
                    </div>
                </div>

                {/* 마지막 업데이트 정보 */}
                <div className="text-gray-500 text-sm mt-6">
                    Updated By: <span className="text-gray-700">{detailData.user_id || "-"}</span> | Last Update: <span className="text-gray-700">{formatDateTime(detailData.update_date) || '-'}</span>
                </div>

            </div>
        </div>
    );
};

export default MonthlyForm;
