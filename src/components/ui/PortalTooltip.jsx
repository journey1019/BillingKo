import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const PortalTooltip = ({ children, content }) => {
    const [show, setShow] = useState(false);
    const tooltipRef = useRef(null);
    const wrapperRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const calculatePosition = useCallback(() => {
        if (show && wrapperRef.current && tooltipRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const tooltipHeight = tooltipRef.current.offsetHeight;

            setPosition({
                top: rect.top + window.scrollY - tooltipHeight - 350,
                left: rect.left + window.scrollX,
            });
        }
    }, [show]);

    useEffect(() => {
        // 스크롤 및 리사이즈 이벤트에 위치 업데이트
        window.addEventListener('scroll', calculatePosition, true);
        window.addEventListener('resize', calculatePosition);

        // 초기 위치 계산
        calculatePosition();

        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [calculatePosition]);

    return (
        <>
            <div
                ref={wrapperRef}
                onMouseEnter={() => {
                    setShow(true);
                    calculatePosition();
                }}
                onMouseLeave={() => setShow(false)}
                className="cursor-pointer inline-block"
            >
                {children}
            </div>
            {show &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className="fixed z-[9999] w-72 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-500 transition-opacity duration-300"
                        style={{ top: position.top, left: position.left }}
                    >
                        {content}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default PortalTooltip;
