import React from "react";

const FormInput = ({ label, name, type, value, onChange, placeholder = "" }) => {
    return (
        <div className="flex flex-col">
            <label className="2xl:text-sm font-semibold text-gray-600">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border rounded-md p-2 text-sm"
            />
        </div>
    );
};

export default FormInput;
