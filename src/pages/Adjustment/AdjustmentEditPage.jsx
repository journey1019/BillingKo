import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { updateAdjustment, fetchAdjustmentPart } from '@/service/adjustmentService.js';
import { createCode } from '@/service/codeService.js';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { renderStandardInputField } from '@/utils/renderHelpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

import { Switch, Tooltip } from "@mui/material";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdClose } from 'react-icons/io'
import { CiCircleQuestion } from "react-icons/ci";

const AdjustmentEditPage = () => {
    const { adjustment_index } = useParams();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const adjustment_code = searchParams.get("adjustment_code") || "";
    const adjustment_code_value = searchParams.get("adjustment_code_value") || "";

    const codeMappings = useAdjustmentMappings();

    const [formData, setFormData] = useState({
        adjustment_code: adjustment_code || "",
        adjustment_code_value: adjustment_code_value || "",
        adjustment_category: "subscribe",
        adjustment_type: "discount",
        mount_type: "pay",
        mount_value: "",
        description: "",
        adjustment_cycle: "once",
        period_count: "",
        date_index: "",
        use_yn: "Y",
        tax_free_yn: "Y"
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAdjustmentData = async () => {
            try {
                const adjustment = await fetchAdjustmentPart(adjustment_index);

                setFormData(prev => ({
                    ...prev,
                    ...adjustment,  // 기존 값을 유지하면서 새로운 데이터 덮어쓰기

                    mount_value: adjustment.mount_value ? adjustment.mount_value.toString() : "", // 숫자 → 문자열 변환 (천 단위 표시)
                    period_count: adjustment.period_count ? adjustment.period_count.toString() : "", // 숫자 → 문자열 변환 (천 단위 표시)
                }));
            } catch (err) {
                setError("조정 데이터를 불러오는 데 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAdjustmentData();
    }, [adjustment_index]);

    const formatNumberWithCommas = (value) => {
        if (!value || isNaN(value)) return ""; // 값이 없거나 숫자가 아니면 빈 문자열 반환
        return Number(value).toLocaleString(); // 숫자로 변환 후 천 단위 구분
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "mount_value" || name === "period_count") {
            formattedValue = value.replace(/[^0-9]/g, ""); // 숫자만 유지
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            mount_value: typeof formData.mount_value === "string"
                ? Number(formData.mount_value.replace(/,/g, "")) // 문자열이라면 ',' 제거 후 숫자로 변환
                : Number(formData.mount_value), // 숫자라면 그대로 변환
            period_count: typeof formData.period_count === "string"
                ? Number(formData.period_count.replace(/,/g, "")) // 문자열이라면 ',' 제거 후 숫자로 변환
                : Number(formData.period_count)
            // mount_value: Number(formData.mount_value.replace(/,/g, "")), // 저장할 때 숫자로 변환
        };

        console.log(formattedData)
        try {
            // console.log("PUT 요청 보낼 데이터", formattedData);
            await updateAdjustment(adjustment_index, formattedData);
            alert("조정 데이터를 성공적으로 업데이트 했습니다.");
            navigate("/adjustment");
        } catch (err) {
            console.error(err.message);
            setError("조정 데이터 업데이트에 실패했습니다.");
        }
    };

    // ✅ Yes / No 토글
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };
    const handleToggleTaxChange = () => {
        setFormData((prev) => ({ ...prev, tax_free_yn: prev.tax_free_yn === 'Y' ? 'N' : 'Y' }));
    };


    /** CODE 형식 새로 생성 */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMappingKey, setModalMappingKey] = useState(null);
    const [modalInput, setModalInput] = useState({
        code_type: 'bill',
        code_value: '',
        code_alias: '',
    });
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


    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-sm mt-3">{error}</p>;

    console.log(formData)

    return (
        <div className="container mx-auto">
            {/* 🔹 Header */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">조정 데이터 수정</h1>
                <button type="button" onClick={() => navigate('/adjustment')}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* 🔹 Form */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                {/*{[*/}
                {/*    { id: 'adjustment_code', label: '조정 대상 구분', type: 'text', required: true, readOnly: true },*/}
                {/*    { id: 'adjustment_code_value', label: '조정 대상', type: 'text', required: true, readOnly: true },*/}
                {/*    { id: 'adjustment_category', label: '조정 항목', type: 'text', dataList: Object.keys(codeMappings[id], required: true },*/}
                {/*    { id: 'adjustment_type', label: '할인/가산 구분', type: 'text', dataList: Object.keys(codeMappings[id], required: true },*/}
                {/*    { id: 'mount_type', label: '지불 방법', type: 'text', dataList: Object.keys(codeMappings[id], required: true },*/}
                {/*    { id: 'adjustment_cycle', label: '조정 적용 기간', type: 'text', dataList: Object.keys(codeMappings[id], required: true },*/}
                {/*    { id: 'mount_value', label: '금액', type: 'text', required: true },*/}
                {/*    { id: 'date_index', label: '적용 날짜', type: 'text' },*/}
                {/*    { id: 'description', label: '설명', type: 'text' },*/}
                {/*].map(({ id, label, type, dataList, placeholder, required, readOnly, codeMapping }) =>*/}
                {/*    renderStandardInputField(*/}
                {/*        id,*/}
                {/*        label,*/}
                {/*        type,*/}
                {/*        formData[id],*/}
                {/*        handleChange,*/}
                {/*        dataList,*/}
                {/*        required,*/}
                {/*        readOnly || false,*/}
                {/*        "", // 에러 메시지 있으면 여기에*/}
                {/*        placeholder*/}
                {/*    )*/}
                {/*)}*/}
                {/*{[*/}
                {/*    {*/}
                {/*        id: 'adjustment_code',*/}
                {/*        label: '조정 대상 구분',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        readOnly: true,*/}
                {/*        value: codeMappings.adjustment_code?.[formData.adjustment_code] ?? ''*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'adjustment_code_value',*/}
                {/*        label: '조정 대상',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        readOnly: true,*/}
                {/*        value: formData.adjustment_code_value*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'adjustment_category',*/}
                {/*        label: '조정 항목',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        dataList: Object.keys(codeMappings.adjustment_category ?? {}),*/}
                {/*        value: codeMappings.adjustment_category?.[formData.adjustment_category] ?? ''*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'adjustment_type',*/}
                {/*        label: '할인/가산 구분',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        dataList: Object.keys(codeMappings.adjustment_type ?? {}),*/}
                {/*        value: codeMappings.adjustment_type?.[formData.adjustment_type] ?? ''*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'mount_type',*/}
                {/*        label: '지불 방법',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        dataList: Object.keys(codeMappings.mount_type ?? {}),*/}
                {/*        value: codeMappings.mount_type?.[formData.mount_type] ?? ''*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'adjustment_cycle',*/}
                {/*        label: '조정 적용 기간',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        dataList: Object.keys(codeMappings.adjustment_cycle ?? {}),*/}
                {/*        value: codeMappings.adjustment_cycle?.[formData.adjustment_cycle] ?? ''*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'mount_value',*/}
                {/*        label: '금액',*/}
                {/*        type: 'text',*/}
                {/*        required: true,*/}
                {/*        value: formatNumberWithCommas(formData.mount_value)*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'date_index',*/}
                {/*        label: '적용 날짜',*/}
                {/*        type: 'text',*/}
                {/*        value: formData.date_index*/}
                {/*    },*/}
                {/*    {*/}
                {/*        id: 'description',*/}
                {/*        label: '설명',*/}
                {/*        type: 'text',*/}
                {/*        value: formData.description*/}
                {/*    }*/}
                {/*].map(({ id, label, type, dataList, placeholder, required, readOnly, value }) =>*/}
                {/*    renderStandardInputField(*/}
                {/*        id,*/}
                {/*        label,*/}
                {/*        type,*/}
                {/*        value,*/}
                {/*        handleChange,*/}
                {/*        dataList,*/}
                {/*        required,*/}
                {/*        readOnly || false,*/}
                {/*        "", // 에러 메시지*/}
                {/*        placeholder*/}
                {/*    )*/}
                {/*)}*/}

                {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                {/*    <label className="col-start-1  w-32 text-sm font-medium text-gray-900">사용 여부 *</label>*/}
                {/*    <div className="col-start-2">*/}
                {/*        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />*/}
                {/*        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                {/*    <label className="col-start-1  w-32 text-sm font-medium text-gray-900">사용 여부 *</label>*/}
                {/*    <div className="col-start-2">*/}
                {/*        <Switch checked={formData.tax_free_yn === 'Y'} onChange={handleToggleChange} />*/}
                {/*        <span className="text-sm text-gray-700">{formData.tax_free_yn === 'Y' ? 'Yes' : 'No'}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* ------------------------------------------------------------------------------------------------------------------------------------ */}

                {/* ✅ 수정 불가능한 필드 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code" className="col-span-2 text-sm font-medium text-gray-900">조정 대상 유형</label>
                    <input type="text" id="adjustment_code" name="adjustment_code"
                           value={codeMappings.adjustment_code[formData.adjustment_code]}
                           className="col-span-3 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           readOnly />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code_value" className="col-span-2 text-sm font-medium text-gray-900">조정 대상 ID</label>
                    <input type="text" id="adjustment_code_value" name="adjustment_code_value"
                           value={formData.adjustment_code_value}
                           className="col-span-3 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           readOnly />
                </div>

                {/* ✅ 선택 필드 */}
                {[
                    {
                        id: "adjustment_category",
                        label: "조정 항목",
                        mappingKey: "adjustment_category",
                        tooltip: true,
                        tooltipContent: "조정의 이유나 항목을 나타냅니다.",
                        tooltipContent2: "예로, 가입비, 미납금, 과오납, VMS 사용료 등이 있습니다."
                    },
                    {
                        id: "adjustment_type",
                        label: "조정 유형",
                        mappingKey: "adjustment_type",
                        tooltip: true,
                        tooltipContent: "조정 방식이 할인인지, 추가 요금인지 선택합니다.",
                        tooltipContent2: "'할인(-)'은 요금을 줄이고, '가산(+)'은 늘립니다."
                    },
                    {
                        id: "mount_type",
                        label: "적용 방식",
                        mappingKey: "mount_type",
                        tooltip: true,
                        tooltipContent: "조정 금액이 '요금(정액)인지 '요율(%)'로 적용될지 선택합니다."
                    },
                    {
                        id: "adjustment_cycle",
                        label: "적용 주기",
                        mappingKey: "adjustment_cycle",
                        tooltip: true,
                        tooltipContent: "조정이 한 번만 적용되는 일회성인지, 매월 반복 적용되는 정기성인지 구분합니다."
                    }
                ].map(({ id, label, mappingKey, tooltip, tooltipContent, tooltipContent2 }) => (
                    <div key={id} className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor={id}
                               className="flex flex-row items-center space-x-2 col-span-2 text-sm font-medium text-gray-900">
                            <span>{label}</span>
                            {tooltip && (
                                <Tooltip arrow placement="right"
                                         title={<div>{tooltipContent} {tooltipContent2 && <><br />
                                             <div>{tooltipContent2}</div>
                                         </>}</div>}>
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
                                    {Object.values(codeMappings[mappingKey])[index]} {/* 실제 표시되는 값 */}
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
                                        <button type="button" onClick={handleModalSubmit}
                                                className="px-4 py-2 bg-blue-500 text-white rounded">
                                            저장
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* ✅ '회차 지정' 입력 필드 */}
                {formData.adjustment_cycle === "period" && (
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="period_count" className="col-span-2 text-sm font-medium text-gray-900">회차 지정</label>
                        <div className="col-span-3">
                            <input
                                type="text" // ✅ input type을 text로 변경하여 문자열로 천 단위 표시
                                id="period_count"
                                name="period_count"
                                value={formatNumberWithCommas(formData.period_count)} // ✅ 표시될 때는 천 단위 구분 추가
                                onChange={handleChange}
                                placeholder="예: 3"
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-right"
                                required
                            />
                            {formData.period_count && (
                                <p className="text-xs text-gray-500 mt-1">
                                    *이번 달부터 입력한 {formData.period_count}개월 수만큼 조정 금액이 적용됩니다.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ 입력 필드 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="mount_value" className="col-span-2 text-sm font-medium text-gray-900">적용 값</label>
                    <input
                        type="text" // ✅ input type을 text로 변경하여 문자열로 천 단위 표시
                        id="mount_value"
                        name="mount_value"
                        value={formatNumberWithCommas(formData.mount_value)} // ✅ 표시될 때는 천 단위 구분 추가
                        onChange={handleChange}
                        className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-right"
                        required
                    />
                </div>

                {/* ✅ Date Index */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="date_index" className="flex flex-row space-x-2 col-span-2 text-sm font-medium text-gray-900 items-center">
                        <span>조정 기준일</span>
                        <Tooltip arrow placement="right"
                                 title={<>
                                     조정이 적용되는 기준일입니다.<br/>
                                     (정기 조정: 시작일, 일회성 조정: 적용일)
                                 </>}
                        >
                        <span>
                            <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                        </span>
                        </Tooltip>
                    </label>
                    <input
                        type="month"
                        id="date_index"
                        name="date_index"
                        value={
                            formData.date_index && formData.date_index.length === 6
                                ? `${formData.date_index.slice(0, 4)}-${formData.date_index.slice(4, 6)}`
                                : ''
                        }
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace("-", ""); // YYYY-MM → YYYYMM 변환
                            setFormData((prev) => ({ ...prev, date_index: selectedDate }));
                        }}
                        className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                </div>


                {/* ✅ 설명 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="description" className="col-span-2 text-sm font-medium text-gray-900">비고</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                              className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"></textarea>
                </div>

                {/* 사용여부 스위치 */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="flex flex-row space-x-2 col-span-2 w-32 text-sm font-medium text-gray-900 items-center">
                        <span>적용 여부 *</span>
                        <Tooltip arrow placement="right"
                                 title={<>
                                     조정 내역을 현재 실제로 적용할지 여부입니다.<br/>
                                     (False: 비활성화 / True: 활성화)
                                 </>}
                        >
                        <span>
                            <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                        </span>
                        </Tooltip>
                    </label>
                    <div className="col-span-3">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* 임시 조정 스위치 */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="flex flex-row space-x-2 col-span-2 w-32 text-sm font-medium text-gray-900 items-center">
                        <span>VAT 적용 시점 *</span>
                        <Tooltip arrow placement="right"
                                 title={<>
                                     이 조정이 부가세(VAT) 계산 전에 적용되는지, 이후에 적용되는지 나타냅니다.<br/>
                                     (False: VAT 계산 전 조정 / True: VAT 계산 후 조정)<br/>
                                     * 보통 세금계산서 발행 기준과 연관됨
                                 </>}
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
                    <button type="button" onClick={handleSubmit}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        저장
                    </button>
                    <button type="button" onClick={() => navigate("/adjustment")}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        취소
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default AdjustmentEditPage;