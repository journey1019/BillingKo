export const formatNumber = (num) => num.toLocaleString();

// 천 단위 ',' 설정
export function formatNumberWithCommas(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '-'; // 값이 없을 경우 안전한 기본값 반환
    }
    return number.toLocaleString('en-US'); // 'ko-KR' 사용 가능
}

/**
 * @method: '10000' -> '10.000'
 * */
const formatNumberWithCommasString = (number) => {
    if (isNaN(number) || number === null) return "0";
    return Number(number).toLocaleString();
};



export const formatValue = (value, defaultText = "-") => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "null" ||
        (typeof value === "string" && value.trim() === "")
    ) {
        return defaultText;
    }
    return value;
};

export const formatDate = (datetime) => {
    if (!datetime) return "";
    return new Date(datetime).toISOString().slice(0, 10);
};

// 날짜 T 제거 포맷팅 함수 YYYY-MM-DD HH:mm:ss
export const formatDateTime = (dateTimeString) => {
    if(!dateTimeString) return '-';

    const date = new Date(dateTimeString);
    return date.toISOString().replace("T", " ").slice(0, 19);
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 변환
export const getTodayDate = () => {
    return new Date().toISOString().slice(0, 10);
}

/**
 * @desc: 'YYYY-MM-DD HH:mm' -> 'YYYY-MM-DD HH:mm:00'
 * */
export const formatDateAddTime = (dateString) => {
    if (!dateString) return null;
    return dateString.length === 16 ? `${dateString}:00` : dateString; // 초가 없으면 ":00" 추가
};

/**
 * @method: '202412' -> '2024-12'
 * */
export const formatDateIndex = (dateIndex) => {
    if (!dateIndex || dateIndex.length !== 6) return "-"; // 유효성 검사
    return `${dateIndex.substring(0, 4)}-${dateIndex.substring(4, 6)}`;
};
