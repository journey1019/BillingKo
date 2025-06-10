export const defaultAccountData = {
    account_info: {
        acct_name: '-',
        invoice_address: '-',
        invoice_postcode: '00000'
    },
    account_use_byte_total: '', // 사용한 바이트 양
    acct_num: '-',              // Acct 번호
    add_use_fee_count: null,    // 추가 사용 단말 개수
    add_use_fee_total: null,    // 추가 사용량
    adjustment_info: [],        // 조정 Info
    basic_fee_count: null,      // 기본 사용 단말 개수
    basic_fee_total: null,      // 기본 사용량
    confirm_date: '-',          //
    confirm_user_id: '-',
    confirm_yn: '-',
    cut_off_fee: '-',
    date_index: '-',
    device_detail: [],
    final_fee: null,
    modification_fee_count: null,
    modification_fee_total: null,
    monthly_final_fee: null,
    none_pay_fee: null,
    non_pay_info: [],
    subscribe_fee_count: null,
    subscribe_fee_total: null,
    supply_fee: null,
    tax_fee: null,
    total_fee: null,
    update_date: '-',
    user_id: '-'
};
export function applyDefaultValues(target, defaults) {
    return Object.keys(defaults).reduce((acc, key) => {
        if (Array.isArray(defaults[key])) {
            acc[key] = Array.isArray(target?.[key]) ? target[key] : []; // 배열 강제 변환
        } else if (typeof defaults[key] === 'object' && defaults[key] !== null) {
            acc[key] = applyDefaultValues(target?.[key] ?? {}, defaults[key]);
        } else {
            acc[key] = target?.[key] ?? defaults[key];
        }
        return acc;
    }, {});
}
