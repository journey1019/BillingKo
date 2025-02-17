export const formatNumber = (num) => num.toLocaleString();

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