export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    const cleaned = phoneNumber.toString().replace(/[^0-9]/g, ""); // 숫자만 유지

    // 이미 '-'가 포함된 경우, 그대로 유지
    if (/^\d{2,3}-\d{3,4}-\d{4}$/.test(cleaned)) {
        return cleaned;
    }

    // 10자리 (지역번호 2자리)
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    // 11자리 (지역번호 3자리)
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }

    // 원본 반환 (예외적인 경우)
    return cleaned;
};
