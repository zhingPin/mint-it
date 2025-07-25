"use client";
import Link from "next/link";
import styles from "./mainMenu.module.css";
import Button from "../../../ui/button/button"
import Dropdown from "../dropdown/dropdown";
import { shortenAddress } from "../../../../../utils/hooks/address";
import { useWalletContext } from "@/(context)/useContext/walletContext/useWalletContext";
// import ThemeSwitch from "../themeSwitch/themeSwitch";
type MainMenuProps = {
  pageLinks: {
    name: string;
    link: string;
  }[];
};
const MainMenu: React.FC<MainMenuProps> = ({ pageLinks }) => {
  const { currentAccount, handleConnectWallet } = useWalletContext();

  const account = shortenAddress(currentAccount || "");
  return (
    <Dropdown
      trigger={
        <div className={styles.chain_switch}>
          <button className={styles.menu_icon}>&#9776;</button>
        </div>
      }
      dropdownClassName={styles.dropdown}
    >
      {pageLinks.map((el, i) => (
        <Link href={el.link} key={i}>
          <ul>
            <li >
              <div>{el.name}</div>
            </li>
          </ul>
        </Link>
      ))}


      {/* <ThemeSwitch />*/}
      <Button
        btnName={account ? shortenAddress(account) : "Connect"}

        classStyle={styles.connection}
        handleClick={account ? undefined : handleConnectWallet}
      />
    </Dropdown>
  );
};

export default MainMenu;
