import React from 'react';
import PropTypes from 'prop-types';

/**
 * ✅ 동작 가능한 토글 스위치 컴포넌트
 * - isEnabled (boolean): 현재 상태
 * - onToggle (function): 상태 변경 핸들러
 * - labelOn / labelOff (string): 상태 라벨
 * - disabled (boolean): 비활성화 여부
 */
const ToggleSwitch = ({
                          isEnabled,
                          onToggle,
                          labelOn = 'Yes',
                          labelOff = 'No',
                          disabled = false
                      }) => {
    // 1️⃣ 문자열 "Y"/"N" -> boolean 변환
    const normalizedValue = typeof isEnabled === 'string'
        ? isEnabled.toUpperCase() === 'Y'
        : Boolean(isEnabled);

    const handleClick = () => {
        if (!disabled && typeof onToggle === 'function') {
            onToggle(!isEnabled);
        }
    };

    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleClick}
        >
            <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    normalizedValue ? 'bg-blue-500' : 'bg-gray-400'
                }`}
            >
                <div
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        normalizedValue ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
            </div>
            <span className="text-sm font-medium">
                {normalizedValue ? labelOn : labelOff}
            </span>
        </div>
    );
};

ToggleSwitch.propTypes = {
    isEnabled: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string, // "Y" or "N"
    ]).isRequired,
    onToggle: PropTypes.func.isRequired,
    labelOn: PropTypes.string,
    labelOff: PropTypes.string,
    disabled: PropTypes.bool,
};

export default ToggleSwitch;


/**
 * import React, { useState } from 'react';
 * import ToggleSwitch from '@/components/ui/switches/ToggleSwitch';
 *
 * const Example = () => {
 *     const [enabled, setEnabled] = useState(false);
 *
 *     return (
 *         <div className="p-4">
 *             <ToggleSwitch
 *                 isEnabled={enabled}
 *                 onToggle={setEnabled}
 *                 labelOn="활성"
 *                 labelOff="비활성"
 *             />
 *         </div>
 *     );
 * };
 * */