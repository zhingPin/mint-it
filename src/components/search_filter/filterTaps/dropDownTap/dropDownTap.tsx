"use client"
import React, { useState } from 'react'
import styles from './dropDownTap.module.css'

type DropDownTapProps = {
    dropdownOptions: string[]; // Array of dropdown options
};
const DropDownTap: React.FC<DropDownTapProps> = ({ dropdownOptions }) => {
    const [selectedOption, setSelectedOption] = useState<string>(dropdownOptions[0]); // Default to the first dropdown option

    const handleDropdownChange = (option: string) => {
        setSelectedOption(option);
        console.log("Selected Option:", option);
        // Perform actions based on the selected dropdown option
    };
    return (
        // {/* Dropdown */ }
        < div className={styles.dropdown} >
            <select
                value={selectedOption}
                onChange={(e) => handleDropdownChange(e.target.value)}
                className={styles.dropdownSelect}
            >
                {dropdownOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </ div>)
}

export default DropDownTap