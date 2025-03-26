export const renderStandardInputField = (id, label, type, value, onChange, dataList, required, readOnly, errorMessage, placeholder, extraProps = {}) => {
    const listId = dataList ? `${id}-options` : undefined;
    return (
        <div key={id} className="grid grid-cols-6 items-center space-x-4">
            <label htmlFor={id} className="col-start-1 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                list={listId}
                value={value ?? ''}
                onChange={onChange}
                className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                placeholder={placeholder}
                required={required}
                readOnly={readOnly}
            />
            {dataList && (
                <datalist id={listId}>
                    {dataList?.map((num, index) => (
                        <option key={index} value={num} />
                    ))}
                </datalist>
            )}
        </div>
    )
}

export const renderInputField = (id, label, type, value, onChange, required, errorMessage, placeholder, extraProps = {}) => (
    <div className="grid grid-cols-6 flex items-center space-x-4" key={id}>
        <label htmlFor={id} className="col-span-1 w-32 text-sm font-medium text-gray-900">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="col-span-2 flex-1">
            <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
                   className={`w-full bg-gray-50 border ${errorMessage ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg p-2.5`}
                   {...extraProps} required={required} />
            {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
        </div>
    </div>
);

export const renderSelectFiled = (id, label, type, value, onChange, required, list) => (
    <div className="grid grid-cols-6 flex items-center space-x-4">
        <label className="col-span-1 w-32 text-sm font-medium text-gray-900">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            list="account-type-options"
            id={id}
            name={id}
            value={value ?? ''}
            onChange={onChange}
            className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
        />
        <datalist id="account-type-options">
            {list.map((type, index) => (
                <option key={index} value={type} />
            ))}
        </datalist>
    </div>
)
export const renderBasicInputField = (id, label, type, required, errorMessage, placeholder, extraProps = {}) => (
    <div className="grid grid-cols-6 items-center space-x-4">
        <label htmlFor={id}
               className="col-start-1 text-sm font-medium text-gray-900">{label}{required &&
            <span className="text-red-500">*</span>}</label>
        <input
            id={id}
            name={id}
            type={type === 'number' ? 'text' : type}
            value={formData[id] ?? ''} // null 방지
            onChange={handleInputChange}
            className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
            {...rest}
        />
    </div>
)