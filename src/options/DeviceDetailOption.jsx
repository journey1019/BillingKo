// D_PRODUCT Type 별 색상 설정
export const getTypeClass = (type) => {
    const typeClasses = {
        act: "text-green-500",
        dct: "text-red-500",
        mmf: "text-yellow-500",
        dat: "text-blue-500",
    };

    return typeClasses[type?.toLowerCase()] || "text-gray-500"; // 기본값: 회색
};


// act_date_period: "31(D)00(H)00(M)" -> "31일 00시 00분"
export const formatPeriod = (period) => {
    if (!period) return ""; // 값이 없을 경우 빈 문자열 반환

    return period
        .replace(/(\d+)\(D\)/, "$1일 ")  // "31(D)" -> "31일 "
        .replace(/(\d+)\(H\)/, "$1시 ")  // "00(H)" -> "00시 "
        .replace(/(\d+)\(M\)/, "$1분")   // "00(M)" -> "00분"
        .replace(/\b0일\b/g, "")         // "0일" 단어 제거
        .replace(/\b0시\b/g, "")         // "0시" 단어 제거
        .replace(/\b0분\b/g, "")         // "0분" 단어 제거
        .replace(/\s{2,}/g, " ")         // 여러 개의 공백을 하나로 줄이기
        .trim();                         // 앞뒤 공백 제거
};
