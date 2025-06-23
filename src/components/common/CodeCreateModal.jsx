import React, { useState, useEffect } from 'react';

const CodeCreateModal = ({
                             code_name = 'adjustment_category',
                             isOpen,
                             onClose,
                             onSubmit,
                             defaultCodeType = 'bill',
                         }) => {
    const [formData, setFormData] = useState({
        code_name: code_name,
        code_type: defaultCodeType,
        code_value: '',
        code_alias: '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                code_name: code_name,
                code_type: defaultCodeType,
                code_value: '',
                code_alias: '',
            });
        }
    }, [isOpen, defaultCodeType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (!formData.code_value || !formData.code_alias) {
            alert('코드 값과 별칭을 입력해주세요.');
            return;
        }
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">새 코드 추가</h2>

                <div className="mb-3">
                    <label className="block text-sm font-medium">코드(Code Value)</label>
                    <input
                        type="text"
                        name="code_value"
                        value={formData.code_value}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">별칭(Code Alias)</label>
                    <input
                        type="text"
                        name="code_alias"
                        value={formData.code_alias}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        취소
                    </button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeCreateModal;
