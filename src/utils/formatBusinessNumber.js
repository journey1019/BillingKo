// utils/formatBusinessNumber.js
export const formatBusinessNumber = (input) => {
    if (!input) return "";
    const cleaned = input.replace(/\D/g, ""); // 숫자만 추출

    if (cleaned.length !== 10) return input; // 유효하지 않으면 그대로 반환

    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
};
