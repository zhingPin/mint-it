"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdown.module.css";

interface DropdownProps {
  trigger: React.ReactNode; // Element that toggles the dropdown
  children: React.ReactNode; // Dropdown content
  className?: string; // Additional classes for customization
  dropdownClassName?: string; // Classes for dropdown content styling
  onOpen?: () => void; // Optional callback for when the dropdown opens
  onClose?: () => void; // Optional callback for when the dropdown closes
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
  dropdownClassName = "",
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen && onOpen) onOpen();
    if (isOpen && onClose) onClose();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={`${styles.dropdownContainer} ${className}`}
      ref={dropdownRef}
    >
      <div onClick={toggleDropdown} className={styles.trigger}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`${styles.dropdownContent} ${dropdownClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
