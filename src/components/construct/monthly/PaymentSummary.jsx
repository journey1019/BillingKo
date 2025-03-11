import { useState, useEffect, useMemo } from "react";
import { formatNumber } from "@/utils/formatHelpers.jsx";
import { MdAttachMoney, MdMoneyOffCsred } from "react-icons/md";
import { GiSatelliteCommunication, GiMoneyStack } from "react-icons/gi";
import { FaRegCreditCard, FaPercentage, FaBalanceScale, FaFileInvoiceDollar, FaMinus } from "react-icons/fa";
import { TbAdjustments, TbScriptPlus } from "react-icons/tb";

// ✅ 스켈레톤 로딩 컴포넌트
const SkeletonLoader = () => (
    <div className="animate-pulse bg-gray-200 rounded-md h-5 w-20"></div>
);

const PaymentSummary = ({ monthlyAcctSaveData }) => {
    // ✅ loading 상태를 판별하는 변수
    const [isLoading, setIsLoading] = useState(true);
    const [forceZero, setForceZero] = useState(false);

    // ✅ 데이터가 있으면 즉시 loading 해제
    useEffect(() => {
        if (monthlyAcctSaveData && monthlyAcctSaveData.length > 0) {
            setIsLoading(false);
            setForceZero(false);
        } else {
            setIsLoading(true);
            setTimeout(() => {
                setForceZero(true); // 3초 이후에도 데이터가 없으면 0으로 표시
            }, 3000);
        }
    }, [monthlyAcctSaveData]);

    // ✅ 금액 계산 (useMemo를 사용하여 최적화)
    const totalValues = useMemo(() => ({
        기본료: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.basic_fee_total ?? 0), 0),
        통신료: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.add_use_fee_total ?? 0), 0),
        부가서비스료: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.modification_fee_total ?? 0), 0),
        기타사용료: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.subscribe_fee_total ?? 0), 0),
        공급가액: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.total_fee ?? 0), 0),
        부가가치세: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.tax_fee ?? 0), 0),
        절사금액: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.cut_off_fee ?? 0), 0),
        당월납부액: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.monthly_final_fee ?? 0), 0),
        추가조정금: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.modification_tax_free_total ?? 0), 0),
        연체가산금: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.late_payment_penalty_fee ?? 0), 0),
        미납금: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0),
        최종납부금액: (monthlyAcctSaveData ?? []).reduce((sum, item) => sum + (item.final_fee ?? 0), 0),
    }), [monthlyAcctSaveData]);

    // ✅ 그룹별 정리 (3열 구성)
    const summaryGroups = [
        {
            title: "기본 비용 항목",
            items: [
                { label: "기본료", key: "기본료", icon: MdAttachMoney },
                { label: "통신료", key: "통신료", icon: GiSatelliteCommunication },
                { label: "부가서비스료", key: "부가서비스료", icon: FaRegCreditCard },
                { label: "기타사용료", key: "기타사용료", icon: TbScriptPlus },
            ],
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
        },
        {
            title: "중간 합산 항목",
            items: [
                { label: "공급가액", key: "공급가액", icon: GiMoneyStack },
                { label: "부가가치세", key: "부가가치세", icon: FaPercentage },
                { label: "절사금액", key: "절사금액", icon: FaMinus },
                { label: "당월납부액", key: "당월납부액", icon: FaFileInvoiceDollar },
            ],
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
        },
        {
            title: "최종 결제 항목",
            items: [
                { label: "추가조정금", key: "추가조정금", icon: TbAdjustments },
                { label: "연체가산금", key: "연체가산금", icon: FaBalanceScale },
                { label: "미납금", key: "미납금", icon: MdMoneyOffCsred },
                { label: "최종납부금액", key: "최종납부금액", icon: FaFileInvoiceDollar },
            ],
            bgColor: "bg-red-100",
            textColor: "text-red-600",
        },
    ];

    return (
        <div className="bg-white p-6 rounded-md shadow-md w-full">
            <div className="grid grid-cols-3 gap-6">
                {summaryGroups.map(({ title, items, bgColor, textColor }) => (
                    <div key={title} className={`p-4 rounded-lg ${bgColor} ${textColor} shadow-md`}>
                        <h3 className="text-md font-semibold mb-2 text-center">{title}</h3>
                        <div className="flex flex-col gap-3">
                            {items.map(({ label, key, icon: Icon }) => (
                                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                    <div className="flex items-center">
                                        <Icon className="w-6 h-6 mr-3" />
                                        <span className="text-sm">{label}</span>
                                    </div>
                                    {/* ✅ 로딩 중이면 스켈레톤, 3초 지나도 데이터 없으면 0 표시 */}
                                    {isLoading ? (
                                        forceZero ? <p className="font-semibold">0 원</p> : <SkeletonLoader />
                                    ) : (
                                        <p className="font-semibold">{formatNumber(totalValues[key])} 원</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentSummary;
