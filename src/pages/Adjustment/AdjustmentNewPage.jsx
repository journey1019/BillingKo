import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import { createAdjustment } from '@/service/adjustmentService.js';
import { createCode } from '@/service/codeService.js';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';

import { Switch, Tooltip } from "@mui/material";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdClose } from 'react-icons/io';
import { CiCircleQuestion } from "react-icons/ci";


const AdjustmentNewPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // ✅ Query Params 가져오기
    const codeMappings = useAdjustmentMappings();

    /** CODE 형식 새로 생성 */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMappingKey, setModalMappingKey] = useState(null);
    const [modalInput, setModalInput] = useState({
        code_type: 'bill',
        code_value: '',
        code_alias: '',
    });

    // 모달 열기
    const openModal = (mappingKey) => {
        setModalMappingKey(mappingKey);
        setIsModalOpen(true);
        setModalInput({
            code_type: 'bill',
            code_value: '',
            code_alias: '',
        });
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setModalMappingKey(null);
    };

    // 입력 변경 핸들러
    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setModalInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 저장
    const handleModalSubmit = async () => {
        try {
            const payload = {
                code_name: modalMappingKey,         // ✅ 버튼에서 받은 mappingKey
                code_type: 'bill',
                code_value: modalInput.code_value,
                code_alias: modalInput.code_alias,
            };
            await createCode(payload);
            alert("코드가 성공적으로 추가되었습니다.");
            closeModal();
            window.location.reload(); // ✅ 현재 페이지 전체 리로드
        } catch (err) {
            alert("코드 생성 실패");
        }
    };


    // ✅ URL에서 전달된 인자 추출
    const adjustment_code = searchParams.get("adjustment_code") || "";
    const adjustment_code_value = searchParams.get("adjustment_code_value") || "";
    console.log('adjustment_code: ', adjustment_code, 'adjustment_code_value: ', adjustment_code_value)

    const [formData, setFormData] = useState({
        adjustment_code: adjustment_code || "account_num",
        adjustment_code_value: adjustment_code_value || "",
        adjustment_category: "subscribe",
        adjustment_type: "discount",
        mount_type: "pay",
        mount_value: "",
        description: "",
        adjustment_cycle: "once",
        date_index: "202501",
        use_yn: "Y",
        tax_free_yn: "Y"
    });

    const [error, setError] = useState(null);

    const formatNumberWithCommas = (value) => {
        if (!value || isNaN(value)) return "";
        return Number(value).toLocaleString();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "mount_value") {
            formattedValue = value.replace(/[^0-9]/g, "");
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleToggleTaxChange = () => {
        setFormData((prev) => ({ ...prev, tax_free_yn: prev.tax_free_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validatedData = {
            ...formData,
            mount_value: Number(formData.mount_value.replace(/,/g, "")), // 숫자로 변환
            description: formData.description.trim() === "" ? "" : formData.description,
        };

        try {
            console.log("POST 요청 보낼 데이터", validatedData);
            await createAdjustment(validatedData);
            alert("조정 데이터를 성공적으로 생성했습니다.");

            // ✅ searchParams 기반 경로 이동 로직
            if (adjustment_code && adjustment_code_value) {
                if (adjustment_code === "serial_number") {
                    navigate(`/devices/?value=${adjustment_code_value}`);
                } else if (adjustment_code === "account_num") {
                    navigate(`/accounts/?value=${adjustment_code_value}`);
                } else if (adjustment_code === "ppid") {
                    navigate(`/price/?value=${adjustment_code_value}`);
                } else {
                    navigate("/adjustment"); // fallback
                }
            } else {
                navigate("/adjustment");
            }

        } catch (err) {
            console.error(err.message);
            setError("조정 데이터 생성에 실패했습니다.");
        }
    };



    return (
        <div className="container mx-auto">
            {/* 🔹 Header */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">조정 데이터 생성</h1>
                <button type="button" onClick={() => navigate('/adjustment')}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* 🔹 Form */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                {/* ✅ 조정 대상 구분 */}
                <div key="adjustment_code" className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code" className="flex flex-row space-x-2 col-span-2 text-sm font-medium text-gray-900 items-center">
                        <span>조정 대상 구분</span>
                        <Tooltip arrow placement="right"
                                 title={
                                     <div>
                                         무엇을 조정할지 선택하세요.<br />
                                         Account, Serial Number, PPID 중 하나를 선택하여 어떤 항목에 조정을 적용할지 지정합니다.
                                     </div>
                                 }
                        >
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <select id="adjustment_code" name="adjustment_code" value={formData.adjustment_code}
                            onChange={handleChange}
                            className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                        {Object.keys(codeMappings["adjustment_code"]).map((optionKey, index) => (
                            <option key={optionKey} value={optionKey}>
                                {Object.values(codeMappings["adjustment_code"])[index]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ✅ 조정 대상 */}
                <div key="adjustment_code_value" className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code_value" className="col-span-2 text-sm font-medium text-gray-900">조정
                        대상</label>
                    <input type="text" id="adjustment_code_value" name="adjustment_code_value"
                           value={formData.adjustment_code_value} onChange={handleChange}
                           className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           placeholder="01680651SKYD374" required />
                </div>

                {/* ✅ 선택 필드 */}
                {[
                    { id: 'adjustment_category', label: '조정 종류', mappingKey: "adjustment_category", tooltip: true, tooltipContent: "조정하려는 항목을 선택합니다. ", tooltipContent2: "예를 들어 가입비, VMS 사용료, 미납금 등이 있습니다." },
                    { id: "adjustment_type", label: "가산/할인 여부", mappingKey: "adjustment_type", tooltip: true, tooltipContent: "조정 방식이 할인인지, 추가 요금인지 선택합니다.", tooltipContent2: "'할인'은 요금을 줄이고, '가산'은 늘립니다." },
                    { id: "mount_type", label: "지불 방법", mappingKey: "mount_type", tooltip: true, tooltipContent: "조정 금액이 '요금(정액)인지 '요율(&)'로 적용될지 선택합니다." },
                    { id: "adjustment_cycle", label: "조정 적용 기간", mappingKey: "adjustment_cycle", tooltip: true, tooltipContent: "이 조정이 한 번만 적용될지, 매달 반복 적용될지를 선택합니다."},
                ].map(({ id, label, mappingKey, tooltip, tooltipContent, tooltipContent2 }) => (
                    <div key={id} className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor={id} className="flex flex-row items-center space-x-2 col-span-2 text-sm font-medium text-gray-900">
                            <span>{label}</span>
                            {tooltip && (
                                <Tooltip arrow placement="right" title={<div>{tooltipContent} {tooltipContent2 && <><br/><div>{tooltipContent2}</div></>}</div>}>
                                    <span>
                                        <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                                    </span>
                                </Tooltip>
                            )}
                        </label>
                        <select id={id} name={id} value={formData[id]} onChange={handleChange}
                                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                            {Object.keys(codeMappings[mappingKey]).map((optionKey, index) => (
                                <option key={optionKey} value={optionKey}>
                                    {Object.values(codeMappings[mappingKey])[index]}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="col-span-1 justify-end items-center"
                            onClick={() => openModal(mappingKey)}
                        >
                            <CiCirclePlus className="w-5 h-5" />
                        </button>
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-lg font-semibold mb-4">새 코드 추가</h2>

                                    {/*<div className="mb-3">*/}
                                    {/*    <label className="block text-sm font-medium">Code Type(bill / pay)</label>*/}
                                    {/*    <input*/}
                                    {/*        type="text"*/}
                                    {/*        name="code_type"*/}
                                    {/*        value={modalInput.code_type}*/}
                                    {/*        onChange={handleModalChange}*/}
                                    {/*        className="w-full border p-2 rounded"*/}
                                    {/*    />*/}
                                    {/*</div>*/}

                                    <div className="mb-3">
                                        <label className="block text-sm font-medium">코드(Code Value)</label>
                                        <input
                                            type="text"
                                            name="code_value"
                                            value={modalInput.code_value}
                                            onChange={handleModalChange}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">별칭(Code Alias)</label>
                                        <input
                                            type="text"
                                            name="code_alias"
                                            value={modalInput.code_alias}
                                            onChange={handleModalChange}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                                            취소
                                        </button>
                                        <button type="button" onClick={handleModalSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
                                            저장
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                ))}

                {/* ✅ 금액 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="mount_value" className="col-span-2 text-sm font-medium text-gray-900">금액</label>
                    <input type="text" id="mount_value" name="mount_value"
                           value={formatNumberWithCommas(formData.mount_value)}
                           onChange={handleChange}
                           placeholder="0"
                           className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-right"
                           required />
                </div>

                {/* ✅ 날짜 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="date_index" className="col-span-2 text-sm font-medium text-gray-900">적용 날짜</label>
                    <input
                        type="month"
                        id="date_index"
                        name="date_index"
                        value={formData.date_index ? `${formData.date_index.slice(0, 4)}-${formData.date_index.slice(4, 6)}` : ""}
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace("-", ""); // YYYY-MM → YYYYMM
                            setFormData((prev) => ({ ...prev, date_index: selectedDate }));
                        }}
                        className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                </div>


                {/* ✅ 설명 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="description" className="col-span-2 text-sm font-medium text-gray-900">설명</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                              placeholder="메모"
                              className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"></textarea>
                </div>

                {/* 사용 여부 스위치 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="flex flex-row items-center space-x-2 col-span-2 text-sm font-medium text-gray-900">
                        <span>사용 여부 *</span>
                        <Tooltip arrow placement="right"
                                 title={
                                     <div>
                                         작성한 조정 내용을 실제로 적용할지 여부를 선택합니다.<br />
                                         ‘Y’는 적용, ‘N’은 미적용입니다.
                                     </div>
                                 }
                        >
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <div className="col-span-4">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* 부가세 포함 여부 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="flex flex-row items-center space-x-2 col-span-2 text-sm font-medium text-gray-900">
                        <span>부가세 포함 여부 *</span>
                        <Tooltip arrow placement="right"
                                 title={
                                     <div>
                                         이 조정 금액이 부가세 계산 전에 적용될지, 후에 적용될지를 선택합니다.<br />
                                         Y는 부가세 후, N은 부가세 전입니다.
                                     </div>
                                 }
                        >
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <div className="col-span-4">
                        <Switch checked={formData.tax_free_yn === 'Y'} onChange={handleToggleTaxChange} />
                        <span className="text-sm text-gray-700">{formData.tax_free_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* ✅ 버튼 */}
                <div className="flex space-x-4">
                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                        저장
                    </button>
                    <button type="button" onClick={() => navigate("/adjustment")}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5">
                        취소
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default AdjustmentNewPage;
