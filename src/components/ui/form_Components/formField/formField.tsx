import React from "react";
import styles from "./formField.module.css";

type FormFieldProps = {
    id: string;
    label?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
};

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    error,
    required = false,
    children,
    className = "",
}) => {
    return (
        <div className={`${styles.form_field} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.form_label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            {children}

            {error && <p className={styles.form_error}>{error}</p>}
        </div>
    );
};

export default FormField;
