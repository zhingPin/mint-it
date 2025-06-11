"use client";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./button.module.css";
import Image, { StaticImageData } from "next/image";

// Define the type for the component props
type ButtonProps = {
  btnName: string;
  handleClick?: () => void;
  icon?: ReactNode | StaticImageData | string // Allow StaticImageData and string URLs  
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

  // Helper function to render the icon properly
  const renderIcon = () => {
    if (!icon) return null

    // If it's a StaticImageData object (from Next.js imports)
    if (typeof icon === "object" && "src" in icon) {
      return <Image src={icon} alt="icon" width={16} height={16} className={styles.button_icon} />
    }

    // If it's a string URL
    if (typeof icon === "string") {
      return <Image src={icon} alt="icon" width={16} height={16} className={styles.button_icon} />
    }

    // If it's a React component/element
    return <span className={styles.button_icon}>{icon}</span>
  }

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
      {renderIcon()}      {btnName}
    </button>
  );
};

export default Button;