// constants/permissions.js
export const ROLE = {
    ADMIN: 'admin',
    ACCOUNTING: 'accounting',
    INVOICE: 'invoice',
    VIEWER: 'viewer',
};

export const PERMISSIONS = {
    saveMonthly: [ROLE.ADMIN, ROLE.INVOICE], // Monthly Page '단말기별 정산 내역 관리 페이지' - Button 'Save Monthly'
    deleteMonthly: [ROLE.ADMIN, ROLE.INVOICE], // Monthly Page '단말기별 정산 내역 관리 페이지' - Button 'Delete Monthly'
    progressHome: [ROLE.ADMIN, ROLE.ACCOUNTING], // Homepage 단독 Progress - Button '납입 현황'
    paymentSave: [ROLE.ADMIN, ROLE.ACCOUNTING], // Homepage Payment - Button '전체 저장'
    deviceInvoice: [ROLE.ADMIN, ROLE.INVOICE], // KO Monthly Page '단말별 청구서 페이지' Progress - Button '단말별 청구서 작업 현황'
    deviceEditIcon: [ROLE.ADMIN, ROLE.INVOICE], // KO Monthlye Page '단말별 청구서 페이지' - IconButton '기본요금_Edit' & '조정상세정보_Edit'
    accountInvoice: [ROLE.ADMIN, ROLE.INVOICE], // KO Monthly Account Page '고객별 청구서 페이지' - Button 'Save Invoice' & 'Delete Invoice'
    accountEditIcon: [ROLE.ADMIN, ROLE.INVOICE], // KO Monthly Account Page '고객별 청구서 페이지' - IconButton '조정내역_Edit'


    // ✅ Step(ProgressBar) 접근 제어를 위한 키 추가
    stepAccess: {
        "납입 현황": [ROLE.ADMIN, ROLE.ACCOUNTING],
        "파일": [ROLE.ADMIN, ROLE.INVOICE],
        "단말별 청구서": [ROLE.ADMIN, ROLE.INVOICE],
        "고객별 청구서": [ROLE.ADMIN, ROLE.INVOICE],
    },
};
