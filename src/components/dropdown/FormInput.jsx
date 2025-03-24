import React from "react";
import { formatNumberWithCommasNumber } from '@/utils/formatHelpers.jsx';

const FormInput = ({ label, name, type, value, onChange, placeholder = "", direct = "" }) => {
    const handleInputChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/,/g, "");

        // name이 없으면 반영 안 되는 문제 방지
        onChange({
            target: {
                name,
                value: numericValue,
            },
        });
    };

    const displayValue = type === "number" ? formatNumberWithCommasNumber(value) : value;

    return (
        <div className="flex flex-row items-center grid grid-cols-3">
            <label className="col-span-1 text-xs 2xl:text-sm font-semibold text-gray-600">
                {label}
            </label>
            <input
                type={type === "number" ? "text" : type}
                name={name}
                value={displayValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`col-span-2 border rounded-md p-2 text-xs w-auto ${
                    direct === "number" ? "text-right" : "text-left"
                }`}
            />
        </div>
    );
};


export default FormInput;
