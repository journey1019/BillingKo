import { formatDateTime, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import InnerAccordion from '@/components/ui/Accordions/InnerAccordion.jsx';
import DeviceTable from './DeviceTable.jsx';

const acctAccordionItem= ({ accountData, accountInfo }) => [
    {
        title: '담당자 정보',
        content: (
            <>
                <div className="text-xs px-3">
                    {[
                        ['직장명', accountInfo.company_name],
                        ['담당 부서', accountInfo.company_team],
                        ['담당자', accountData.company_director],
                        ['이메일', accountInfo.director_email],
                        ['직장 전화', accountInfo.company_tel],
                        ['이동 전화', accountInfo.director_tel],
                        ['고객 주소', `(${accountInfo.company_postcode || '-'}) ${formatValue(accountInfo.company_address)}`],
                        ['고객 주소2', formatValue(accountInfo.company_address2)],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-5 2xl:grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-3 2xl:col-span-2 text-left text-black">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
            </>
        )
    }
]

export const accordionItems = ({ accountData, accountInfo, deviceDetail }) => [
    {
        title: "고객 정보",
        content: (
            <>
                <div className="text-sm p-3 rounded-md">
                    {[
                        ['계정 번호', accountData.acct_num],
                        ['계정 등록 번호', accountInfo.acct_resident_num],
                        ['고객 구분', accountInfo.account_type],
                        ['구분 단위', accountInfo.classification],
                        ['기관명', accountInfo.acct_name],
                        ['사업자 등록 번호', accountInfo.business_num],
                        ['법인(주민) 번호', accountInfo.recognize_id],
                        ['청구 주소', `(${accountInfo.invoice_postcode || '-'}) ${formatValue(accountInfo.invoice_address)}`],
                        ['청구 주소 2', formatValue(accountInfo.invoice_address2)],
                        ['등록 일자', formatDateTime(accountInfo.regist_date)],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-2 text-left text-black">{formatValue(value)}</span>
                        </p>
                    ))}
                    <div className="text-sm">
                        <InnerAccordion items={acctAccordionItem({ accountData, accountInfo })} />
                    </div>
                </div>
            </>
        ),
    },
    {
        title: "요금 정보",
        content: (
            <>
                <div className="text-sm p-3 border-b">
                    {[
                        [`기본료 (${accountData.basic_fee_count}개)`, `${formatNumber(accountData.basic_fee_total)}`],
                        ['통신료', `${formatNumber(accountData.add_use_fee_total)}`],
                        ['수수료', `0`],
                        ['부가 서비스료', `${formatNumber(accountData.modification_fee_total)}`],
                        ['기타 사용료', `${formatNumber(accountData.subscribe_fee_total)}`],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-5 2xl:grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
                <div className="text-sm p-3 border-b">
                    {[
                        ['공급가액', `${formatNumber(accountData.total_fee)}`],
                        ['부가 가치세', `${formatNumber(accountData.tax_fee)}`],
                        ['절사 금액', accountData.cut_off_fee ? `-${formatNumber(accountData.cut_off_fee)}원` : '0'],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-5 2xl:grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
                <div className="text-sm p-3">
                    {[
                        ['당월 납부 금액', `${formatNumber(accountData.monthly_final_fee)}`],
                        ['조정 금액', `${formatNumber(accountData.modification_tax_free_total)}`],
                        ['연체 가산금', `${formatNumber(accountData.late_payment_penalty_fee)}`],
                        ['미납 금액', `${formatNumber(accountData.none_pay_fee)}`],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-5 2xl:grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                    <p className="grid grid-cols-5 2xl:grid-cols-3 gap-4 pt-3 mt-3 border-t">
                        <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">최종 납부액</span>
                        <span className="font-normal col-span-1 text-right">{formatNumber(accountData.final_fee)}</span>
                    </p>
                </div>
            </>
        ),
    },
    {
        title: '디바이스 상세 정보',
        content: (
            <>
                <div className="col-span-3">
                    <DeviceTable accountData={accountData} />
                </div>
            </>
        ),
    },
];