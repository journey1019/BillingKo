import React, { useState } from "react";
import PropTypes from "prop-types"; // ✅ PropTypes 추가
import { FiChevronDown } from "react-icons/fi";

const InnerAccordion = ({ items }) => {
    const safeItems = items || []; // fallback 처리
    return (
        <div className="w-full rounded-lg">
            {safeItems.length > 0 ? (
                safeItems.map((item, index) => (
                    <AccordionItem key={index} title={item.title} content={item.content} />
                ))
            ) : (
                <p className="text-center text-gray-500 p-4">항목이 없습니다.</p>
            )}
        </div>
    );
};

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                className={`flex items-center justify-between w-full p-3 font-medium text-gray-800 border-b border-gray-400 rounded-t-md ${isOpen === true ? 'bg-gray-100': 'bg-opacity-0'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold">{title}</span>
                <FiChevronDown
                    className={`w-5 h-5 transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <div className={isOpen ? "block pt-2 border rounded-md my-2" : "hidden"}>
                <div>{content}</div>
            </div>
        </div>
    );
};

// ✅ PropTypes로 타입 검증 추가
InnerAccordion.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired, // JSX 가능하도록 node 사용
        })
    ),
};

export default InnerAccordion;
