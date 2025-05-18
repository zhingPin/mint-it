"use client";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./button.module.css";

// Define the type for the component props
type ButtonProps = {
  btnName: string;
  handleClick?: () => void;
  icon?: ReactNode;
  classStyle?: string;
  id?: string;
  navigateTo?: string;
  alt?: string;
  style?: React.CSSProperties;
  disabled?: boolean; // Add disabled prop
  role?: React.AriaRole | undefined; // Allow any valid HTML role
  ariaSelected?: boolean; // Add aria-selected for accessibility
  title?: string;
};

const Button: React.FC<ButtonProps> = ({
  style,
  btnName,
  handleClick,
  icon,
  classStyle = "", // Default to an empty string
  navigateTo,
  title,
  disabled = false, // Default to false
  role,
  ariaSelected,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (!disabled) {
      if (handleClick) {
        handleClick();
      } else if (navigateTo) {
        router.push(navigateTo);
      }
    }
  };

  return (
    <button
      title={title}
      className={`${"new_button"} ${classStyle} ${disabled ? styles.disabled : ""}`}
      onClick={handleButtonClick}
      style={style}
      disabled={disabled} // Apply the disabled attribute
      role={role} // Add role for accessibility
      aria-selected={ariaSelected} // Add aria-selected for accessibility
    >
      {icon}
      {btnName}
    </button>
  );
};

export default Button;