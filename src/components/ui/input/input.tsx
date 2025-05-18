import React, { HTMLAttributes } from "react";
import styles from "./input.module.css";

type InputProps = {
    defaultValue?: string | number | readonly string[] | undefined;
    value?: string | number | readonly string[] | undefined;
    placeholder?: string;
    onChange?: (value: string) => void;
    icon?: React.ReactNode; // Optional icon to display inside the input
};

const Input: React.FC<InputProps> = ({ value, placeholder, onChange, icon, defaultValue }) => {
    return (
        <div className={styles.input_container}>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className={styles.input_field}
                defaultValue={defaultValue}
            />
            {icon && <div className={styles.input_icon}>{icon}</div>}
        </div>
    );
};

export default Input;