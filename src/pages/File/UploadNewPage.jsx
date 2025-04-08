import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUpload } from '@/service/fileService.js';
import { Switch, Tooltip } from "@mui/material";

import { IoMdClose } from 'react-icons/io';
import { CiCircleQuestion } from "react-icons/ci";

const UploadNewPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        sp_id: 0,
        alias: "",
        active_index: "",
        deactive_index: "",
        use_yn: "Y",
        include_files: ["CDRv3.csv", "NetworkReport.csv"],
    });

    const [error, setError] = useState(null);

    // ✅ 일반 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 날짜 입력 핸들러 (YYYY-MM → YYYYMM 변환)
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value.replace("-", ""), // YYYY-MM → YYYYMM 변환
        }));
    };

    // ✅ 포함된 파일 리스트 변환
    const handleFileChange = (e) => {
        const files = e.target.value ? e.target.value.split(',').map((file) => file.trim()) : [];
        setFormData((prev) => ({ ...prev, include_files: files }));
    };

    // ✅ 사용 여부 토글
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === "Y" ? "N" : "Y" }));
    };

    // ✅ 데이터 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                active_index: formData.active_index ? formData.active_index.replace("-", "") : "",
                deactive_index: formData.deactive_index ? formData.deactive_index.replace("-", "") : "",
            };

            await createUpload(submissionData);
            alert("새로운 파일 데이터 생성을 성공하셨습니다.");
            navigate("/file");
        } catch (err) {
            setError("파일 데이터 생성을 실패하셨습니다.");
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto">
            {/* 🔹 헤더 */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">새로운 SPID 생성</h1>
                <button onClick={() => navigate('/file')} className="flex items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* 🔹 폼 */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                {/* ✅ SPID */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="sp_id" className="flex flex-row items-center space-x-1 col-span-2 text-sm font-medium text-gray-900">
                        <span>SPID</span>
                        <Tooltip arrow placement="right" title="Service Provicder ID">
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <input type="number" id="sp_id" name="sp_id" value={formData.sp_id} onChange={handleChange}
                           className="col-span-4 border p-2.5 rounded-lg" required />
                </div>

                {/* ✅ 요금제 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="alias" className="col-span-2 text-sm font-medium text-gray-900">요금제</label>
                    <input type="text" id="alias" name="alias" placeholder="1MB Pooled" value={formData.alias} onChange={handleChange}
                           className="col-span-4 border p-2.5 rounded-lg" required />
                </div>

                {/* ✅ 활성화 날짜 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="active_index" className="col-span-2 text-sm font-medium text-gray-900">활성화 날짜</label>
                    <input
                        type="month"
                        id="active_index"
                        name="active_index"
                        value={formData.active_index ? `${formData.active_index.slice(0, 4)}-${formData.active_index.slice(4, 6)}` : ""}
                        onChange={handleDateChange}
                        className="col-span-4 border p-2.5 rounded-lg"
                        required
                    />
                </div>

                {/* ✅ 비활성화 날짜 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="deactive_index" className="col-span-2 text-sm font-medium text-gray-900">비활성화 날짜</label>
                    <input
                        type="month"
                        id="deactive_index"
                        name="deactive_index"
                        value={formData.deactive_index ? `${formData.deactive_index.slice(0, 4)}-${formData.deactive_index.slice(4, 6)}` : ""}
                        onChange={handleDateChange}
                        className="col-span-4 border p-2.5 rounded-lg"
                    />
                </div>

                {/* ✅ 사용 여부 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-span-2 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-span-4 flex items-center space-x-4">
                        <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
                    </div>
                </div>

                {/* ✅ 포함된 파일 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="include_files" className="flex flex-row items-center space-x-1 col-span-2 text-sm font-medium text-gray-900">
                        <span>포함된 파일 (',' 구분)</span>
                        <Tooltip arrow placement="right"
                                 title={
                                     <div>
                                         파일에 들어올 수 있는 항목은 다음과 같다.<br />
                                         CDRv3.csv, NetworkReport.csv
                                     </div>
                                 }
                        >
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <input type="text" id="include_files" name="include_files" value={formData.include_files.join(', ')}
                           onChange={handleFileChange} className="col-span-4 border p-2.5 rounded-lg"
                           placeholder="CDRv3.csv, NetworkReport.csv" />
                </div>

                {/* ✅ 제출 버튼 */}
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
                    생성하기
                </button>

                {/* ✅ 오류 메시지 */}
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default UploadNewPage;
