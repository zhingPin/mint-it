import React, { ReactNode } from "react";
import Link from "next/link";
import styles from "../button.module.css";

// Define the type for the component props
interface ServerButtonProps {
  btnName: string;
  icon?: ReactNode;
  classstyle?: string;
  navigateTo?: string;
  btnMsg?: string;
  alt?: string;
}

const ServerButton: React.FC<ServerButtonProps> = ({
  btnName,
  icon,
  classstyle = "",
  navigateTo,
  btnMsg,
}) => {
  const content = (
    <>
      <h5>{btnName}</h5>
      {icon}
      {btnMsg}
    </>
  );

  if (navigateTo) {
    return (
      <Link href={navigateTo} className={`${styles.new_button} ${classstyle}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`${styles.new_button} ${classstyle}`}>{content}</button>
  );
};

export default ServerButton;
