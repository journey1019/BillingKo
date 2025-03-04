import React from "react";

const FormInput = ({ label, name, type, value, onChange }) => {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="border rounded-md p-2 text-sm"
            />
        </div>
    );
};

export default FormInput;
