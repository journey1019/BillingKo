import React from 'react';

const AccountPartForm = ({ accountPartData }) => {
    // Yes/No Toggle
    const isEnabled = accountPartData.use_yn === 'Y'; // Y면 활성화된 토글, N이면 비활성화된 토글

    // 날짜 포맷터 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    return (
        <form className="grid grid-cols-2 gap-3">
            {/* Section: 기본 정보 */}
            <h2 className="col-span-2 text-md 2xl:text-lg font-semibold text-gray-800">기본 정보</h2>

            {/* Account Number */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">고객 번호</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.acct_num}</span>
            </div>

            {/* Account Name */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">고객명</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.acct_name}</span>
            </div>

            {/* Resident Number */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">등록 번호</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.acct_resident_num}</span>
            </div>

            {/* 사용 여부 (Toggle 스타일) */}
            <div>
            <label className="block text-xs 2xl:text-sm font-medium text-gray-500">사용 여부</label>
                <div className="mt-2 flex items-center space-x-2">
                    {/* 토글 버튼 */}
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                    >
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                    {/* 텍스트 표시 */}
                    <span className="text-xs 2xl:text-sm font-medium">{isEnabled ? 'Yes' : 'No'}</span>
                </div>
            </div>


            {/* Section: 주소 정보 */}
            <h2 className="col-span-2 text-md  2xl:text-lgfont-semibold text-gray-800">주소 정보</h2>

            {/* Invoice Address */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">청구지 주소</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.invoice_address === 'null' ? 'Null' : accountPartData.invoice_address}</span>
            </div>

            {/* Invoice Address 2 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">추가 주소</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.invoice_address2 === 'null' ? 'Null' : accountPartData.invoice_address2}</span>
            </div>

            {/* Invoice Postcode */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">우편번호</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.invoice_postcode === 'null' ? 'Null' : accountPartData.invoice_postcode}</span>
            </div>

            {/* Section: 회사 정보 */}
            <h2 className="col-span-2 text-md  2xl:text-lgfont-semibold text-gray-800">회사 정보</h2>

            {/* 회사명 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">회사명</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.company_name  === 'null' ? 'Null' : accountPartData.company_name}</span>
            </div>

            {/* 팀명 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">팀명</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.company_team === 'null' ? 'Null' : accountPartData.company_team}</span>
            </div>

            {/* 담당자 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">담당자</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.company_director === 'null' ? 'Null' : accountPartData.company_director}</span>
            </div>

            {/* 담당자 이메일 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">담당자 이메일</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.director_email === 'null' ? 'Null' : accountPartData.director_email}</span>
            </div>

            {/* 담당자 전화번호 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">담당자 전화번호</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.director_tel === 'null' ? 'Null' : accountPartData.director_tel}</span>
            </div>

            {/* 세금 비율 */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">부가세율 (%)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{accountPartData.tax_percent === 'null' ? 'Null' : accountPartData.tax_percent}</span>
            </div>
        </form>
    );
};

export default AccountPartForm;
