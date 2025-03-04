import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUpload } from '@/service/fileService.js';
import { IoMdClose } from 'react-icons/io';

const UploadNewPage = () => {
    const navigate = useNavigate();
    const getTodayDate = () => new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        sp_id: "",
        alias: "",
        active_index: "",
        deactive_index: "",
        use_yn: "Y",
        regist_user_id: "",
        regist_date: getTodayDate(),
        update_user_id: "",
        update_date: "",
        include_files: []
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = e.target.value ? e.target.value.split(',').map((file) => file.trim()) : [];
        setFormData((prev) => ({ ...prev, include_files: files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUpload(formData);
            alert("Upload entry created successfully!");
            navigate("/uploads");
        } catch (err) {
            setError("Failed to create upload entry");
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">Create New Upload Entry</h1>
                <button onClick={() => navigate('/uploads')} className="flex items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="sp_id" className="col-start-1 text-sm font-medium text-gray-900">SP ID</label>
                    <input type="text" id="sp_id" name="sp_id" value={formData.sp_id} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg" required />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="alias" className="col-start-1 text-sm font-medium text-gray-900">Alias</label>
                    <input type="text" id="alias" name="alias" value={formData.alias} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg" required />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="active_index" className="col-start-1 text-sm font-medium text-gray-900">Active Index (YYYYMM)</label>
                    <input type="text" id="active_index" name="active_index" value={formData.active_index} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg" required />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="deactive_index" className="col-start-1 text-sm font-medium text-gray-900">Deactive Index (YYYYMM)</label>
                    <input type="text" id="deactive_index" name="deactive_index" value={formData.deactive_index} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg" />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">Use Y/N</label>
                    <select id="use_yn" name="use_yn" value={formData.use_yn} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg">
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                    </select>
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="regist_user_id" className="col-start-1 text-sm font-medium text-gray-900">Register User ID</label>
                    <input type="text" id="regist_user_id" name="regist_user_id" value={formData.regist_user_id} onChange={handleChange} className="col-span-2 border p-2.5 rounded-lg" required />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="include_files" className="col-start-1 text-sm font-medium text-gray-900">Include Files (comma-separated)</label>
                    <input type="text" id="include_files" name="include_files" value={formData.include_files.join(', ')} onChange={handleFileChange} className="col-span-2 border p-2.5 rounded-lg" />
                </div>

                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
                    Create Entry
                </button>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default UploadNewPage;
