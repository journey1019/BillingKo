// ✅ 드롭다운 형태로 적용할 FormInput 대체
const FormSelect = ({ label, name, value, onChange, options = [] }) => {
    return (
        <div className="flex flex-row items-center grid grid-cols-3">
            <label className="col-span-1 text-xs 2xl:text-sm font-semibold text-gray-600">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="col-span-2 border rounded-md p-2 text-xs"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default FormSelect;