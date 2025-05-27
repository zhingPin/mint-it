"use client";
import React from "react";
import styles from "./input.module.css";

type InputProps = {
    id?: string;
    name?: string;
    type?: string;
    value?: string | number | readonly string[];
    defaultValue?: string | number | readonly string[];
    placeholder: string;
    onChange?: (value: string) => void;
    icon?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    maxLength?: number;
    minLength?: number;
    className?: string;
};


const Input: React.FC<InputProps> = ({
    id,
    name,
    type = "text",
    value,
    defaultValue,
    placeholder,
    onChange,
    icon,
    required = false,
    disabled = false,
    readOnly = false,
    autoComplete,
    maxLength,
    minLength,
    className,
}) => {
    return (
        <div className={`${styles.input_container} ${className || ""}`}>
            {icon && <div className={styles.input_icon}>{icon}</div>}
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                maxLength={maxLength}
                minLength={minLength}
                className={styles.input_field}
            />
        </div>
    );
};


export default Input;