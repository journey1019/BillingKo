const AccountInputForm = () => {
    return(
        <>
            {/* 고객 번호 */}
            <div className="grid grid-cols-6 items-center space-x-4">
                <label htmlFor="acct_num" className="col-start-1 text-sm font-medium text-gray-900">
                    고객 번호
                    <span className="text-red-500">*</span>
                </label>
                <input
                    id="acct_num"
                    name="acct_num"
                    type="text"
                    value={formData.acct_num ?? ''} // null 방지
                    onChange={handleChange}
                    className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    readOnly={true}
                    required={true}
                />
            </div>

            {/* 고객 구분 */}
            <div className="grid grid-cols-6 items-center space-x-4">
                <label htmlFor="account_type" className="col-start-1 text-sm font-medium text-gray-900">
                    고객 구분
                    <span className="text-red-500">*</span>
                </label>
                <input
                    list="account-type-options"
                    id="account_type"
                    name="account_type"
                    value={formData.account_type ?? ''}
                    onChange={handleChange}
                    placeholder="예: 법인, 개인, 내부 등"
                    className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                />
                <datalist id="account-type-options">
                    {acctTypeList.map((type, index) => (
                        <option key={index} value={type} />
                    ))}
                </datalist>
            </div>



            {/* ✅ 회사 주소 검색 */}
            <div className="grid grid-cols-6 items-center space-x-4">
                <label className="col-start-1 text-sm font-medium text-gray-900">회사 주소</label>
                <div className="col-span-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="company_postcode"
                            value={formData.company_postcode ?? ''}
                            onChange={handleChange}
                            placeholder="우편번호"
                            className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <button type="button" onClick={() => handleAddressSearch('company')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                            주소 검색
                        </button>
                    </div>
                    <input
                        type="text"
                        name="company_address"
                        value={formData.company_address ?? ''}
                        onChange={handleChange}
                        placeholder="주소"
                        className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    />
                    <input
                        type="text"
                        name="company_address2"
                        value={formData.company_address2 ?? ''}
                        onChange={handleChange}
                        placeholder="상세 주소"
                        className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    />
                </div>
            </div>

            {/* ✅ 청구지 주소 검색 */}
            <div className="grid grid-cols-6 items-center space-x-4">
                <label className="col-start-1 text-sm font-medium text-gray-900">청구지 주소</label>
                <div className="col-span-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="invoice_postcode"
                            value={formData.invoice_postcode ?? ''}
                            onChange={handleChange}
                            placeholder="우편번호"
                            className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <button type="button" onClick={() => handleAddressSearch('invoice')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                            주소 검색
                        </button>
                        <button type="button" onClick={copyCompanyToInvoice} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm">
                            회사 주소 복사
                        </button>
                    </div>
                    <input
                        type="text"
                        name="invoice_address"
                        value={formData.invoice_address ?? ''}
                        onChange={handleChange}
                        placeholder="주소"
                        className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    />
                    <input
                        type="text"
                        name="invoice_address2"
                        value={formData.invoice_address2 ?? ''}
                        onChange={handleChange}
                        placeholder="상세 주소"
                        className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    />
                </div>
            </div>

        </>
    )
}

export default AccountInputForm;