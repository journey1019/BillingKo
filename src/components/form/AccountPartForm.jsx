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
        <form className="grid grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-md">
            {/* Section: 기본 정보 */}
            <h2 className="col-span-2 text-lg font-semibold text-gray-800">기본 정보</h2>

            {/* Account Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">고객 번호</label>
                <input
                    type="text"
                    value={accountPartData.acct_num}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Account Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">고객명</label>
                <input
                    type="text"
                    value={accountPartData.acct_name}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Resident Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700">등록 번호</label>
                <input
                    type="number"
                    value={accountPartData.acct_resident_num || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 사용 여부 (Toggle 스타일) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">사용 여부</label>
                <div className="mt-2 flex items-center space-x-2">
                    {/* 토글 버튼 */}
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                    {/* 텍스트 표시 */}
                    <span className="text-sm font-medium">{isEnabled ? 'Yes' : 'No'}</span>
                </div>
            </div>

            {/* Section: 주소 정보 */}
            <h2 className="col-span-2 text-lg font-semibold text-gray-800">주소 정보</h2>

            {/* Invoice Address */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">청구지 주소</label>
                <input
                    type="text"
                    value={accountPartData.invoice_address || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Invoice Address 2 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">추가 주소</label>
                <input
                    type="text"
                    value={accountPartData.invoice_address2 === 'null' ? '' : accountPartData.invoice_address2 || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Invoice Postcode */}
            <div>
                <label className="block text-sm font-medium text-gray-700">우편번호</label>
                <input
                    type="number"
                    value={accountPartData.invoice_postcode || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Section: 회사 정보 */}
            <h2 className="col-span-2 text-lg font-semibold text-gray-800">회사 정보</h2>

            {/* 회사명 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">회사명</label>
                <input
                    type="text"
                    value={accountPartData.company_name || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 팀명 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">팀명</label>
                <input
                    type="text"
                    value={accountPartData.company_team || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 담당자 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">담당자</label>
                <input
                    type="text"
                    value={accountPartData.company_director || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 담당자 이메일 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">담당자 이메일</label>
                <input
                    type="email"
                    value={accountPartData.director_email || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 담당자 전화번호 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">담당자 전화번호</label>
                <input
                    type="tel"
                    value={accountPartData.director_tel || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* 세금 비율 */}
            <div>
                <label className="block text-sm font-medium text-gray-700">부가세율 (%)</label>
                <input
                    type="number"
                    value={accountPartData.tax_percent || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>
        </form>
    );
};

export default AccountPartForm;
