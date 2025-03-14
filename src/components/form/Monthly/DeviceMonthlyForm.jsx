import Accordion from '@/components/ui/Accordions/Accordion.jsx';
import { accordionItems } from '@/components/form/Monthly/DeviceAccordionItem.jsx';
import UseByteDetailItem from '@/components/form/Monthly/UseByteDetailItem.jsx';
import { formatDateTime } from '@/utils/formatHelpers.jsx';


const DeviceMonthlyForm = ({ detailData, version, latestVersion, setVersion, fetchVersionData }) => {
    if (!detailData) return <p>No data available</p>;


    const paymentInfo = detailData.payment || {};
    const paymentFeeDetail = paymentInfo.fee_detail || [];
    const paymentAdjustmentInfo = paymentInfo.adjustment_info || [];

    // D_Product 데이터 합쳐 가공.
    const transformDetailData = (detailData) => {
        const dProductDetail = ['act', 'dat', 'dct', 'mmf'].flatMap((type) =>
            (detailData[type] || []).map((item) => ({
                type,
                ...item
            }))
        );

        return dProductDetail;
    };
    // 변환된 데이터
    const dProductDetail = transformDetailData(detailData);
    console.log(dProductDetail)


    return (
        <>
            <div className="grid grid-cols-2 bg-white shadow-lg">
                {/* Left Section - 단말 및 금액 세부 정보 */}
                <div className="col-span-1">
                    <div className="bg-white p-4 border-r">

                        {/* 마지막 업데이트 정보 */}
                        {/*<div className="text-gray-500 text-sm my-3">*/}
                        {/*    Updated By: <span*/}
                        {/*    className="text-gray-700 font-semibold">{detailData.user_id || '-'}</span> | Last*/}
                        {/*    Update: <span*/}
                        {/*    className="text-gray-700 font-semibold">{formatDateTime(detailData.update_date) || '-'}</span>*/}
                        {/*</div>*/}
                        {detailData?.update_date && (
                            <div className="text-gray-500 text-sm mb-3">
                                <div className="flex flex-row space-x-3">
                                    <span>Updated By</span>
                                    <span className="text-gray-700 font-semibold">{detailData?.user_id || '-'}</span>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <span>Last Update</span>
                                    <span
                                        className="text-gray-700 font-semibold">{formatDateTime(detailData?.update_date) || '-'}</span>
                                </div>
                            </div>
                        )}

                        <Accordion items={accordionItems({ detailData, paymentInfo, version })} />
                    </div>
                </div>

                {/* Right Section - 버전 변경 버튼 & 요금 및 byte 상세 정보 */}
                <div className="col-span-1">
                    <div className="p-4">
                        <div className="flex flex-row items-right justify-end ">

                            {/* 버전 변경 버튼 */}
                            {fetchVersionData && setVersion !== null && version !== null && latestVersion !== null && (
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
                            )}

                            {/*<div className="text-end space-x-4 justify-end">*/}
                            {/*    <button*/}
                            {/*        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"*/}
                            {/*        onClick={() => {*/}
                            {/*            const newVersion = Math.max(version - 1, 0);*/}
                            {/*            setVersion(newVersion);*/}
                            {/*            fetchVersionData(detailData.monthly_primary_key, newVersion);*/}
                            {/*        }}*/}
                            {/*        disabled={version <= 0}*/}
                            {/*    >*/}
                            {/*        ◀*/}
                            {/*    </button>*/}
                            {/*    <span className="font-bold">Version {version}</span>*/}
                            {/*    <button*/}
                            {/*        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"*/}
                            {/*        onClick={() => {*/}
                            {/*            const newVersion = version + 1;*/}
                            {/*            setVersion(newVersion);*/}
                            {/*            fetchVersionData(detailData.monthly_primary_key, newVersion);*/}
                            {/*        }}*/}
                            {/*        disabled={version >= latestVersion} // 최신 버전 이상이면 비활성화*/}
                            {/*    >*/}
                            {/*        ▶*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    <UseByteDetailItem detailData={detailData} paymentInfo={paymentInfo}
                                       paymentFeeDetail={paymentFeeDetail} dProductDetail={dProductDetail} paymentAdjustmentInfo={paymentAdjustmentInfo}/>
                </div>
            </div>
        </>
    );
};

export default DeviceMonthlyForm;
