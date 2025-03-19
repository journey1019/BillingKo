import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createPrice, fetchPrice } from '@/service/priceService.js';
import { IoMdClose } from 'react-icons/io';

const PriceNewPage = () => {
    const navigate = useNavigate();

    // ✅ 기존 PPID 데이터 불러오기
    const [priceData, setPriceData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPrice();
                setPriceData(response);
            } catch (error) {
                console.error("요금 데이터를 불러오는 중 오류 발생", error);
            }
        };
        fetchData();
    }, []);

    // ✅ 필드 정의
    const fieldLabels = {
        ppid: "PPID",
        basic_fee: "기본료",
        subscription_fee: "가입비",
        free_byte: "무료 데이터",
        surcharge_unit: "추가 사용 과금 단위",
        each_surcharge_fee: "추가 사용 과금 금액",
        apply_company: "적용 회사",
        remarks: "비고",
        note: "메모"
    };

    // ✅ 기본값을 포함한 초기 상태
    const [formData, setFormData] = useState({
        ppid: "",
        basic_fee: 0,
        subscription_fee: 0,
        free_byte: 0,
        surcharge_unit: 0,
        each_surcharge_fee: 0,
        apply_company: "",
        remarks: "",
        note: ""
    });

    const [error, setError] = useState(null);
    const [ppidError, setPpidError] = useState("");

    // ✅ 중복 체크 함수
    const isDuplicatePPID = (ppidNum) => priceData.some((price) => price.ppid === ppidNum);

    // ✅ 입력 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        let formattedValue = value;

        // ✅ PPID 중복 검사
        if (id === "ppid") {
            setPpidError(isDuplicatePPID(value) ? "이미 존재하는 PPID 입니다." : "");
        }

        // ✅ 숫자 필드 처리
        if (["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"].includes(id)) {
            formattedValue = value === "" ? 0 : Number(value.replace(/[^0-9]/g, ""));
        }

        setFormData((prev) => ({
            ...prev,
            [id]: formattedValue
        }));
    };

    // ✅ 필수 입력 필드 검사
    const validateFormData = () => {
        const requiredFields = Object.keys(fieldLabels).filter(field => field !== "apply_company" && field !== "remarks" && field !== "note");

        for (const field of requiredFields) {
            if (!formData[field] && formData[field] !== 0) {
                return `필수 입력 항목: "${fieldLabels[field]}"`;
            }
        }
        return null;
    };

    // ✅ 빈 값 자동 변환 처리
    const normalizeFormData = (data) => {
        const updatedData = { ...data };

        // 숫자 필드에 대한 기본값 0 설정
        ["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"].forEach(field => {
            if (!updatedData[field] || updatedData[field] === "") {
                updatedData[field] = 0;
            }
        });

        // ✅ remarks, note는 빈 문자열 `""` 설정
        if (!updatedData.apply_company) updatedData.apply_company = "-";
        if (!updatedData.remarks) updatedData.remarks = "-";
        if (!updatedData.note) updatedData.note = "-";

        return updatedData;
    };

    // ✅ 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ppidError) return; // 중복된 PPID일 경우 제출 방지

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        const confirmedData = normalizeFormData(formData); // 데이터 변환

        try {
            await createPrice(confirmedData);
            alert("새로운 요금 데이터가 성공적으로 생성되었습니다.");
            navigate("/price");
        } catch (err) {
            setError(err.response?.data?.detail || "요금 데이터 생성에 실패하였습니다.");
        }
    };

    // ✅ 입력 필드 렌더링 함수
    const renderInputField = (id, label, type, required, errorMessage, placeholder, extraProps = {}) => (
        <div className="flex items-center space-x-4" key={id}>
            <label htmlFor={id} className="w-32 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex-1">
                <input
                    id={id}
                    type={type}
                    value={formData[id]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`w-full bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg p-2.5`}
                    {...extraProps}
                    required={required}
                />
                {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
            </div>
        </div>
    );

    return (
        <>
            <div className="container mx-auto">
                {/* ✅ 상단 타이틀 및 닫기 버튼 */}
                <div className="flex flex-row justify-between mb-3">
                    <h1 className="py-1 text-lg font-bold">신규 요금 등록</h1>
                    <button onClick={() => navigate("/price")}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                {/* ✅ 입력 폼 */}
                <form className="bg-white p-5 rounded-xl space-y-4" onSubmit={handleSubmit}>
                    {/* ✅ 고객번호 (중복 검사 포함) */}
                    {renderInputField("ppid", "PPID", "text", true, ppidError, "999")}

                    {/* ✅ 나머지 입력 필드 자동 생성 */}
                    {Object.entries(fieldLabels).map(([id, label]) => {
                        if (id === "ppid") return null; // PPID는 위에서 렌더링
                        return renderInputField(id, label, id.includes("fee") ? "number" : "text", id !== "apply_company" && id !== "remarks" && id !== "note", "", "0");
                    })}

                    {/* ✅ 저장 버튼 */}
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
                        저장
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default PriceNewPage;
