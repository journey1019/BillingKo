import { useState } from 'react';
import { formatDateTime, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import clsx from 'clsx';
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Dropdown from '@/components/dropdown/Dropdown.jsx';
import DropdownMenu from "@/components/dropdown/DropdownMenu.jsx";
import Accordion from '@/components/ui/Accordions/Accordion.jsx';
import { accordionItems } from '@/components/form/AccountMonthly/AccountAccordionItem.jsx';

const AccountMonthlyOverview = ({ accountDetailData, accountDetailLoading, accountDetailError }) => {
    // ✅ 기본값 설정 (빈 배열)
    const safeAccountDetailData = Array.isArray(accountDetailData) ? accountDetailData : [];

    // ⏳ 로딩 중일 때
    if (accountDetailLoading) {
        return <div className="p-4 text-center text-gray-500">⏳ 데이터 로딩 중...</div>;
    }
    // 😵 에러 발생 시
    if (accountDetailError) {
        return <div className="p-4 text-center text-red-500">⚠️ 에러 발생: {accountDetailError}</div>;
    }

    // 🫥 데이터가 없을 때
    if (safeAccountDetailData.length === 0) {
        return <div className="p-4 text-center text-gray-400">📌 조회된 데이터가 없습니다.</div>;
    }

    // 👍🏻 안전하게 데이터 접근
    const accountData = safeAccountDetailData[0] || {};
    const accountInfo = accountData.account_info || {};
    const deviceDetail = accountData.device_detail || [];
    const adjustmentInfo = accountData.adjustment_info || [];
    const nonePayInfo = accountData.none_pay_fee || [];

    console.log(accountData)

    // const [isOpenDropdown, setIsOpenDropdown] = useState(false); // 설정 Icon
    // const handleEdit = () => setIsOpenDropdown(!isOpenDropdown);
    // const closeDropdown = () => setIsOpenDropdown(false);




    return (
        <div className="grid grid-cols-2 rounded-lg">
            <div className="pr-2 col-span-2">
                <Accordion items={accordionItems({ accountData, accountInfo, deviceDetail, adjustmentInfo, nonePayInfo })} />
            </div>
            {/*<div className="col-span-1">*/}
            {/*    <Accordion items={[accordionItems({ accountData, accountInfo, deviceDetail })[0]]} />*/}
            {/*</div>*/}
            {/*<div className="col-span-1">*/}
            {/*    <Accordion items={[accordionItems({ accountData, accountInfo, deviceDetail })[1]]} />*/}
            {/*</div>*/}

            {/*/!* 디바이스 상세 정보 (전체 너비 차지) *!/*/}
            {/*<div className="col-span-2">*/}
            {/*    <Accordion items={[accordionItems({ accountData, accountInfo, deviceDetail })[2]]} />*/}
            {/*</div>*/}


            {/*<div className="pr-2 col-span-3">*/}
            {/*<div className="flex flex-row justify-between">*/}
            {/*    <h2 className="text-base font-semibold mb-2">고객 정보</h2>*/}
            {/*    <div className="relative inline-block">*/}
            {/* ✅ 드롭다운 사용 예제 */}
            {/*<Dropdown trigger={<MdEdit />}>*/}
            {/*    /!* ✅ 드롭다운 내부 컨텐츠 (동적으로 변경 가능) *!/*/}
            {/*    <div className="text-end space-x-2">*/}
            {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit Item</li>*/}
            {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">Delete Item</li>*/}
            {/*    </div>*/}
            {/*</Dropdown>*/}

            {/*/!* ✅ 버튼 *!/*/}
            {/*<button onClick={handleEdit}><MdEdit /></button>*/}

            {/*/!* ✅ 드롭다운 메뉴 (애니메이션 효과 추가) *!/*/}
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
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="text-sm bg-white p-3 rounded-md border border-gray-300">*/}
            {/*        {[*/}
            {/*            ['계정 번호', accountData.acct_num],*/}
            {/*            ['계정 등록 번호', accountInfo.acct_resident_num],*/}
            {/*            ['구분', accountInfo.classification],*/}
            {/*            ['기관명', accountInfo.acct_name],*/}
            {/*            ['청구 주소', `(${accountInfo.invoice_postcode || '-'}) ${formatValue(accountInfo.invoice_address)}`],*/}
            {/*            ['청구 주소 2', formatValue(accountInfo.invoice_address2)],*/}
            {/*        ].map(([label, value], index) => (*/}
            {/*            <p key={index} className="grid grid-cols-5 gap-4 py-1">*/}
            {/*                <span className="text-xs text-gray-500 col-span-2 text-left">{label}</span>*/}
            {/*                <span className="font-normal col-span-3 text-left">{formatValue(value)}</span>*/}
            {/*            </p>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*<div className="col-span-3">*/}
            {/*    <div className="flex flex-row justify-between">*/}
            {/*        <h2 className="text-base font-semibold mb-2">요금 정보</h2>*/}
            {/*    </div>*/}
            {/*    <div className="text-sm bg-white p-3 rounded-md border border-gray-300">*/}
            {/*        {[*/}
            {/*            ['기본료', `${formatNumber(accountData.basic_fee_total)} 원 (${accountData.basic_fee_count}개)`],*/}
            {/*            ['부가세', `${formatNumber(accountData.tax_fee)}원 (${accountInfo.tax_percent}%)`],*/}
            {/*            ['추가 사용료', `${formatNumber(accountData.add_use_fee_total)} 원 (${accountData.add_use_fee_count}개)`],*/}
            {/*            ['절사 금액', formatNumber(accountData.cut_off_fee) + ' 원'],*/}
            {/*            ['조정 금액', `${formatNumber(accountData.modification_fee_total)} 원 (${accountData.modification_fee_count}개)`],*/}
            {/*            ['미납 금액', formatNumber(accountData.none_pay_fee) + ' 원'],*/}
            {/*            ['최종 납부액', formatNumber(accountData.final_fee) + ' 원'],*/}
            {/*        ].map(([label, value], index) => (*/}
            {/*            <p key={index} className="grid grid-cols-5 gap-4 py-1">*/}
            {/*                <span className="text-xs text-gray-500 col-span-2 text-left">{label}</span>*/}
            {/*                <span className="font-normal col-span-3 text-left">{formatValue(value)}</span>*/}
            {/*            </p>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="col-span-3 flex flex-row justify-between items-center">
                <h2 className="text-base font-semibold col-span-3 mt-4">디바이스 상세 정보</h2>
                {/*<FaPlus/>*/}
            </div>
            <div className="col-span-3">
                {deviceDetail.length > 0 ? (
                    <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-gray-200 sticky -top-0.5 z-10">
                            <tr>
                                {["번호", "별칭", "단말기", "사용 기간", "기본료", "통신료", "기타 사용료", "부가 서비스료", "사용 바이트 수 (b)", "총 요금"].map((header, index) => (
                                    <th key={index}
                                        className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {deviceDetail
                                .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
                                .map((device, index) => (
                                    <tr key={index} className="text-center text-xs whitespace-nowrap">
                                        <td className="px-2 py-1 border">{index + 1}</td>
                                        <td className="px-2 py-1 border text-blue-500 cursor-pointer hover:underline">{device.alias}</td>
                                        <td className="px-2 py-1 border">{device.serial_number}</td>
                                        <td className="px-2 py-1 border">{device.period_data}</td>
                                        <td className="px-2 py-1 border">{formatNumber(device.basic_fee)}</td>
                                        <td className="px-2 py-1 border">{formatNumber(device.add_use_fee)}</td>
                                        <td className="px-2 py-1 border">{formatNumber(device.subscribe_fee)}</td>
                                        <td className="px-2 py-1 border">{formatNumber(device.modification_fee)}</td>
                                        <td className="px-2 py-1 border">{formatNumber(device.use_byte_total)}</td>
                                        <td className="px-2 py-1 border font-bold">{formatNumber(device.total_fee)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-2 text-gray-500 text-sm">디바이스 정보 없음</p>
                )}
            </div>

            <div className="pr-2">
                <h2 className="text-base font-semibold col-span-3 mt-4">조정 내역</h2>
                <div className="col-span-3">
                    {adjustmentInfo.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-200">
                                <tr>
                                    {["조정 유형", "조정 대상", "조정 분류", "할인/가산 구분", "요금 기준", "조정 금액", "설명"].map((header, index) => (
                                        <th key={index}
                                            className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {adjustmentInfo.map((adj, index) => (
                                    <tr key={index} className="text-center text-xs whitespace-nowrap">
                                        <td className="p-2 border">{formatValue(adj.adjustment_code)}</td>
                                        <td className="p-2 border">{formatValue(adj.adjustment_value)}</td>
                                        <td className="p-2 border">{formatValue(adj.adjustment_category)}</td>
                                        <td className="p-2 border">{formatValue(adj.adjustment_type)}</td>
                                        <td className="p-2 border">{formatValue(adj.mount_type)}</td>
                                        <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
                                        <td className="p-2 border">{formatValue(adj.description)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 text-sm">조정 내역 없음</p>
                    )}
                </div>
            </div>

            {/* 미납 내역 */}
            <div>
                <h2 className="text-base font-semibold col-span-3 mt-4">미납 내역</h2>
                <div className="col-span-3">
                    {nonePayInfo.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-200">
                                <tr>
                                    {["미납 금액", "추가 이자", "미납 기간"].map((header, index) => (
                                        <th key={index}
                                            className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {nonePayInfo.map((np, index) => (
                                    <tr key={index} className="text-center text-xs whitespace-nowrap">
                                        <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
                                        <td className="p-2 border">{np.add_percent}%</td>
                                        <td className="p-2 border">{np.none_paid_period} 개월</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 text-sm">미납 내역 없음</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountMonthlyOverview;
