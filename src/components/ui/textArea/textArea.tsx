import React from "react";
import styles from "./textarea.module.css";

type TextareaProps = {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    rows?: number;
    maxLength?: number;
    minLength?: number;
    className?: string;
};

const Textarea: React.FC<TextareaProps> = ({
    id,
    name,
    value,
    defaultValue,
    placeholder,
    onChange,
    required,
    disabled,
    readOnly,
    rows = 5,
    maxLength,
    minLength,
    className,
}) => {
    return (
        <div className={`${styles.textarea_container} ${className || ""}`}>
            <textarea
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                maxLength={maxLength}
                minLength={minLength}
                className={styles.textarea_field}
            />
        </div>
    );
};

export default Textarea;
