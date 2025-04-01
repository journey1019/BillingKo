import React from 'react';
import PropTypes from 'prop-types';

/**
 * ✅ 읽기 전용 Switch 컴포넌트
 * - 문자열 "Y" / "N" 또는 boolean 모두 처리 가능
 * - Y → true / N → false
 */
const ReadOnlySwitch = ({
                            isEnabled = false,
                            labelOn = 'Yes',
                            labelOff = 'No',
                        }) => {
    // 문자열이 전달되었을 경우 boolean으로 변환
    const normalizedValue =
        typeof isEnabled === 'string'
            ? isEnabled.toUpperCase() === 'Y'
            : Boolean(isEnabled);

    return (
        <div className="flex items-center space-x-2">
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

ReadOnlySwitch.propTypes = {
    isEnabled: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string, // "Y" or "N"
    ]),
    labelOn: PropTypes.string,
    labelOff: PropTypes.string,
};

export default ReadOnlySwitch;


/**
 * import ReadOnlySwitch from '@/components/ui/switches/ReadOnlySwitch';
 *
 * const ExampleComponent = () => {
 *     const isSwitchOn = true;
 *
 *     return (
 *         <ReadOnlySwitch isEnabled={isSwitchOn} labelOn="활성화" labelOff="비활성화" />
 *     );
 * };
 * */