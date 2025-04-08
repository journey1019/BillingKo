import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { fetchUploadHistoryDetailFiles, updateUpload } from '@/service/fileService.js';
import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { Switch, Tooltip } from "@mui/material";
import { CiCircleQuestion } from "react-icons/ci";

const UploadEditPage = () => {
    const { sp_id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        sp_id: "",
        alias: "",
        active_index: "",
        deactive_index: "",
        use_yn: "Y",
        include_files: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUploadData = async () => {

            try {
                const uploadData = await fetchUploadHistoryDetailFiles(sp_id);
                const { update_date, update_user_id, ...filteredData } = uploadData;

                setFormData({
                    ...filteredData,
                    // active_index: uploadData.active_index && uploadData.active_index.length === 6
                    //     ? `${uploadData.active_index.slice(0, 4)}-${uploadData.active_index.slice(4, 6)}`
                    //     : "",
                    // deactive_index: uploadData.deactive_index && uploadData.deactive_index.length === 6
                    //     ? `${uploadData.deactive_index.slice(0, 4)}-${uploadData.deactive_index.slice(4, 6)}`
                    //     : "",
                    include_files: uploadData.include_files || [],
                });
            } catch (err) {
                setError("Failed to fetch upload data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadUploadData();
    }, [sp_id]);
    console.log(formData)

    // ✅ 날짜 변경 시 YYYY-MM → YYYYMM 변환하여 저장
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value ? value.replace("-", "") : "", // YYYY-MM → YYYYMM 변환
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 포함 파일 리스트 처리
    const handleFileChange = (e) => {
        const files = e.target.value ? e.target.value.split(',').map((file) => file.trim()) : [];
        setFormData((prev) => ({ ...prev, include_files: files }));
    };

    // ✅ 사용 여부 토글 버튼
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updatedData = {
            ...formData,
            // active_index: formData.active_index ? formData.active_index.replace("-", "") : "",
            // deactive_index: formData.deactive_index ? formData.deactive_index.replace("-", "") : "",
        };

        try {
            await updateUpload(sp_id, updatedData);
            alert('파일 업로드 데이터를 성공적으로 수정했습니다.');
            navigate("/file");
        } catch (err) {
            setError("파일 업로드 데이터 수정을 실패했습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">파일 업로드 이력 수정</h1>
                <button onClick={() => navigate('/file')} className="flex items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                {/* ✅ SPID (수정 불가능) */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="sp_id" className="flex flex-row items-center space-x-1 col-span-2 text-sm font-medium text-gray-900">
                        <span>SPID</span>
                        <Tooltip arrow placement="right" title="Service Provicder ID">
                            <span>
                                <CiCircleQuestion className="text-gray-800 hover:cursor-pointer" />
                            </span>
                        </Tooltip>
                    </label>
                    <input type="text" id="sp_id" name="sp_id" value={formData.sp_id} readOnly
                           className="col-span-4 bg-gray-100 border border-gray-300 p-2.5 rounded-lg" />
                </div>

                {/* ✅ 요금제 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="alias" className="col-span-2 text-sm font-medium text-gray-900">요금제</label>
                    <input type="text" id="alias" name="alias" value={formData.alias} onChange={handleChange}
                           className="col-span-4 border p-2.5 rounded-lg" />
                </div>

                {/* ✅ 활성화 날짜 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="active_index" className="col-span-2 text-sm font-medium text-gray-900">활성화 날짜</label>
                    <input
                        type="month"
                        id="active_index"
                        name="active_index"
                        value={
                            formData.active_index && formData.active_index.length === 6
                                ? `${formData.active_index.slice(0, 4)}-${formData.active_index.slice(4, 6)}`
                                : ''
                        }
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace('-', ''); // YYYY-MM → YYYYMM 변환
                            setFormData((prev) => ({ ...prev, active_index: selectedDate }));
                        }}
                        className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                    {/*<input type="month" id="active_index" name="active_index"*/}
                    {/*       value={formData.active_index || ''} onChange={handleDateChange}*/}
                    {/*       className="col-span-4 border p-2.5 rounded-lg" />*/}
                </div>

                {/* ✅ 비활성화 날짜 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="deactive_index" className="col-span-2 text-sm font-medium text-gray-900">비활성화
                        날짜</label>
                    {/*<input type="month" id="deactive_index" name="deactive_index"*/}
                    {/*       value={formData.deactive_index || ''} onChange={handleDateChange}*/}
                    {/*       className="col-span-4 border p-2.5 rounded-lg" />*/}
                    <input
                        type="month"
                        id="deactive_index"
                        name="deactive_index"
                        value={
                            formData.deactive_index && formData.deactive_index.length === 6
                                ? `${formData.deactive_index.slice(0, 4)}-${formData.deactive_index.slice(4, 6)}`
                                : ''
                        }
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace('-', ''); // YYYY-MM → YYYYMM 변환
                            setFormData((prev) => ({ ...prev, deactive_index: selectedDate }));
                        }}
                        className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                </div>

                {/* ✅ 사용 여부 (토글) */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-span-2 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-span-4 flex items-center space-x-4">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* ✅ 포함 파일 */}
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
                           onChange={handleFileChange} className="col-span-4 border p-2.5 rounded-lg" />
                </div>

                {/* ✅ 저장 버튼 */}
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
};

export default UploadEditPage;
