const ToggleSwitchButton = (value) => {
    return (
        <div className="flex items-center justify-center">
            <label className="relative inline-flex items-center cursor-pointer">
                {/* ✅ 비활성화된 토글 (수정 불가) */}
                <input
                    type="checkbox"
                    checked={value === 'Y'}
                    disabled
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
                                rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}

export default ToggleSwitchButton;