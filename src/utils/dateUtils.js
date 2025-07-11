/**
 * 오늘 날짜 기준으로 'YYYYMM' 형식의 문자열을 반환한다.
 * @returns {string} 예: '202507'
 */
export const getCurrentYearMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed
    return `${year}${month}`;
};
// const monthly = getCurrentYearMonth(); // '202507' 사용 예시

/**
 * 오늘 기준 다음 달의 'YYYYMM' 값을 반환한다.
 * @returns {string} 예: '202508'
 */
export const getNextYearMonth = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1); // 자동 월 계산
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
};
