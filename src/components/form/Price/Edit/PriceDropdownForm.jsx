import React, { useState, useEffect, useRef } from 'react';

const PriceDropdownForm = ({ pricePartData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const initialData = pricePartData || {};
    const [formData, setFormData] = useState({
        ppid: initialData.ppid || "",
    });

    return(
        <>
        </>
    )
}

export default PriceDropdownForm;