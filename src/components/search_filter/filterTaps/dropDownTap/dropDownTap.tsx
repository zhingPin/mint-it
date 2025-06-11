"use client";
import React, { useEffect, useState } from "react";
import styles from "./dropDownTap.module.css";
import Select from "@/components/ui/form_Components/select/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type DropDownTapProps = {
    dropdownOptions: string[];
    sort: string; // Optional sort prop for initial value
};

const DropDownTap: React.FC<DropDownTapProps> = ({ dropdownOptions, sort }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentSort = sort

    // const currentSort = searchParams.get("sort") || dropdownOptions[0]; // Get from URL or default
    const [selectedOption, setSelectedOption] = useState<string>(currentSort);

    useEffect(() => {
        setSelectedOption(currentSort);
    }, [currentSort]);

    const handleDropdownChange = (value: string) => {
        setSelectedOption(value);

        const params = new URLSearchParams(searchParams);
        params.set("sort", value);

        replace(`${pathname}?${params.toString()}`);
    };

    const selectOptions = dropdownOptions.map((opt) => ({
        label: opt,
        value: opt,
    }));

    return (
        <Select
            value={selectedOption}
            onChange={handleDropdownChange}
            options={selectOptions}
            className={styles.dropdown_select}
        />
    );
};

export default DropDownTap;
