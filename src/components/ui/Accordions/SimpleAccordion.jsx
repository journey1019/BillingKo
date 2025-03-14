import { useState } from "react";

const SimpleAccordion = ({ items, allOpen = false }) => {
    const [openIndexes, setOpenIndexes] = useState(
        allOpen ? [...Array(items.length).keys()] : []
    );

    const toggleAccordion = (index) => {
        setOpenIndexes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <div id="accordion-color" className="w-full">
            {items.map((item, index) => (
                <div key={index} className="border border-gray-500 dark:border-gray-700 rounded-xl mb-2">
                    {/* Header */}
                    <h2 id={`accordion-color-heading-${index}`}>
                        <button
                            type="button"
                            className={`rounded-t-xl flex items-center justify-between w-full p-5 text-gray-800 border-b border-gray-200 
                          focus:ring-2 focus:ring-gray-400 hover:bg-gray-100 gap-3 
                          ${openIndexes.includes(index) ? "bg-gray-200 text-blue-600" : "rounded-xl"}`}
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={openIndexes.includes(index)}
                            aria-controls={`accordion-color-body-${index}`}
                        >
                            <span className="text-lg font-bold">{item.title}</span>
                            <svg
                                className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                                    openIndexes.includes(index) ? "rotate-180" : "rotate-0"
                                }`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                    </h2>

                    {/* Content */}
                    <div
                        id={`accordion-color-body-${index}`}
                        className={`overflow-hidden transition-all duration-300 ${
                            openIndexes.includes(index) ? "block" : "hidden"
                        }`}
                        aria-labelledby={`accordion-color-heading-${index}`}
                    >
                        <div className="p-5 border-t border-gray-200 bg-white rounded-b-xl">
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SimpleAccordion;
