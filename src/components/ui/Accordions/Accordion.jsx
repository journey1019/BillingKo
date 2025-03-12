// import React, { useState } from "react";
// import { FiChevronDown } from "react-icons/fi";
//
// const Accordion = ({ items }) => {
//     return (
//         <div className="w-full rounded-lg">
//             {items.map((item, index) => (
//                 <AccordionItem key={index} title={item.title} content={item.content} />
//             ))}
//         </div>
//     );
// };
//
// const AccordionItem = ({ title, content }) => {
//     const [isOpen, setIsOpen] = useState(false);
//
//     return (
//         <div className="border-b border-gray-400">
//             <button
//                 type="button"
//                 className="flex items-center justify-between w-full py-3 px-5 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-all duration-300"
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <span>{title}</span>
//                 <FiChevronDown
//                     className={`w-4 h-4 transform transition-transform duration-300 ${
//                         isOpen ? "rotate-180" : ""
//                     }`}
//                 />
//             </button>
//
//             <div
//                 className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                     isOpen ? "max-h-[500px] opacity-100 py-3 px-5" : "max-h-0 opacity-0"
//                 }`}
//             >
//                 <p className="text-gray-600">{content}</p>
//             </div>
//         </div>
//     );
// };
//
// export default Accordion;
import React, { useState } from "react";
import PropTypes from "prop-types"; // ✅ PropTypes 추가
import { FiChevronDown } from "react-icons/fi";

const Accordion = ({ items = [] }) => {
    return (
        <div className="w-full rounded-lg">
            {items.length > 0 ? (
                items.map((item, index) => (
                    <AccordionItem key={index} title={item.title} content={item.content} />
                ))
            ) : (
                <p className="text-center text-gray-500 p-4">항목이 없습니다.</p>
            )}
        </div>
    );
};

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="py-1">
            <button
                type="button"
                className={`flex items-center justify-between w-full p-3 font-medium text-gray-800 rounded-t-md ${isOpen === true ? 'bg-gray-100 border-b border-gray-400': 'border border-gray-200 bg-opacity-0'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold">{title}</span>
                <FiChevronDown
                    className={`w-5 h-5 transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <div className={isOpen ? "block pt-2 border rounded-md my-2" : "hidden"}>
                <p>{content}</p>
            </div>
        </div>
    );
};

// ✅ 기본 props 설정 (items가 전달되지 않을 경우 빈 배열로 설정)
Accordion.defaultProps = {
    items: [],
};

// ✅ PropTypes로 타입 검증 추가
Accordion.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired, // JSX 가능하도록 node 사용
        })
    ),
};

export default Accordion;
