"use client";
import React from "react";
import styles from "./select.module.css";

type SelectOption = {
    label: string;
    value: string;
};

type SelectProps = {
    id: string;
    name: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options: SelectOption[];
    className?: string;
};

const Select: React.FC<SelectProps> = ({
    id,
    name,
    value,
    defaultValue,
    onChange,
    placeholder,
    required,
    disabled,
    options,
    className,
}) => {
    return (
        <div className={`${styles.select_container} ${className || ""}`}>
            <select
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
                disabled={disabled}
                className={styles.select_field}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
