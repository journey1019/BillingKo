export const getStepApiKey = (stepLabel) => {
    const mapping = {
        "납입 현황": "payment",
        "파일": "cdr",
        "단말별 청구서": "device",
        "고객별 청구서": "billing",
    };
    return mapping[stepLabel];
};

export const getStepColorClass = (stepStatus) => {
    switch (stepStatus) {
        case "Y":
            return "bg-indigo-600 text-white border border-indigo-200";
        case "U":
            return "bg-sky-300 text-white border border-sky-200";
        default:
            return "bg-gray-100 text-gray-600 border border-gray-300";
    }
};