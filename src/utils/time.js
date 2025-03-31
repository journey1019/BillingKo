import dayjs from 'dayjs';

/**
 * KST → UTC 변환 (API 전송용)
 * @param kst 'YYYY-MM-DD HH:mm:ss'
 * @returns UTC ISO string
 */
export const convertKSTToUTC = (kst) => {
    return dayjs(kst).subtract(9, 'hour').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * UTC → KST 변환 (화면 표시용)
 * @param utcString UTC 날짜 문자열
 * @returns KST 포맷 문자열
 */
export const convertUTCToKST = (utcString) => {
    return utcString
        ? dayjs(utcString).add(9, 'hour').format('YYYY-MM-DD HH:mm:ss')
        : '-';
};
