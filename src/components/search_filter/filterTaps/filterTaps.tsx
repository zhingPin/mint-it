"use client";
import React, { useState } from "react";
import styles from "./filterTaps.module.css";
import { Button } from "@/components/ui";
// import DropDownTap from "./dropDownTap/dropDownTap";

type FilterTapsProps = {
    tabs: string[];
    dropdownOptions: string[];
};

const FilterTaps: React.FC<FilterTapsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]); // Default to the first tab
    // const [selectedOption, setSelectedOption] = useState<string>(dropdownOptions[0]); // Default to the first dropdown option

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        console.log("Selected Tab:", tab);
        // Perform actions based on the selected tab
    };

    // const handleDropdownChange = (option: string) => {
    //     setSelectedOption(option);
    //     console.log("Selected Option:", option);
    //     // Perform actions based on the selected dropdown option
    // };

    return (
        <div className={styles.filterTaps}>
            {/* Tabs */}
            <div className={styles.tabs}>
                {tabs.map((tab, index) => (
                    <Button
                        btnName={tab}
                        icon={null} // No icon for tabs, but you can add one if needed
                        classStyle={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                        handleClick={() => handleTabChange(tab)}
                        key={index}
                        aria-selected={activeTab === tab}
                        role="tab"
                    />

                ))}
            </div>


            {/* <DropDownTap
                dropdownOptions={dropdownOptions} // Pass dropdown options to the component
            /> */}
        </div>
    );
};

export default FilterTaps;