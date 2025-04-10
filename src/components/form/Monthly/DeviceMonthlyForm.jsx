import Accordion from '@/components/ui/Accordions/Accordion.jsx';
import { accordionItems } from '@/components/form/Monthly/DeviceAccordionItem.jsx';
import UseByteDetailItem from '@/components/form/Monthly/UseByteDetailItem.jsx';
import { formatDateTime } from '@/utils/formatHelpers.jsx';
import { FaTrash } from "react-icons/fa";
import { deleteRecentMonthly } from "@/service/monthlyService.js";
import Swal from 'sweetalert2';
import { Tooltip } from "@mui/material";


const DeviceMonthlyForm = ({ detailData, version, latestVersion, setVersion, fetchVersionData, fetchDetailData, originalSerialNumber, yearMonth }) => {
    if (!detailData) return <p>No data available</p>;


    console.log(detailData)
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
    console.log(fetchVersionData)
    console.log(version)
    console.log(latestVersion)
    console.log(yearMonth)


    // 삭제 핸들러 함수
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '이 동작은 되돌릴 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        });

        if (result.isConfirmed) {
            try {
                await deleteRecentMonthly(originalSerialNumber);
                Swal.fire('삭제 완료', '데이터가 삭제되었습니다.', 'success');
                // ✅ 데이터 새로고침
                fetchVersionData(detailData.monthly_primary_key, latestVersion - 1);
                setVersion(latestVersion - 1);
                window.location.reload();
            } catch (err) {
                Swal.fire('오류', '삭제 중 오류가 발생했습니다.', 'error');
            }
        }
    };



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

                        <Accordion items={accordionItems({ detailData, paymentInfo, version, fetchDetailData, yearMonth })} />
                    </div>
                </div>

                {/* Right Section - 버전 변경 버튼 & 요금 및 byte 상세 정보 */}
                <div className="col-span-1">
                    <div className="p-4">
                        <div className="flex flex-row items-right justify-end ">

                            {/* 버전 변경 버튼 */}
                            {fetchVersionData && setVersion !== null && version !== null && latestVersion !== null && (
                                <div className="flex flex-row space-x-2 items-center">
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

                                    <Tooltip title="가장 마지막 버전이 삭제됩니다.">
                                        <button
                                            className="text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-full p-2 disabled:opacity-30 disabled:hover:bg-white disabled:text-gray-700"
                                            onClick={handleDelete}
                                            disabled={latestVersion <= 0}
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </Tooltip>
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
                                       paymentFeeDetail={paymentFeeDetail} dProductDetail={dProductDetail}
                                       paymentAdjustmentInfo={paymentAdjustmentInfo} yearMonth={yearMonth}/>
                </div>
            </div>
        </>
    );
};

export default DeviceMonthlyForm;
