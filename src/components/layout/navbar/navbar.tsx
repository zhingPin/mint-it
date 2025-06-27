import React from 'react'
import styles from './navbar.module.css'
import MainMenu from './mainMenu/mainMenu'
import NavConnect from './navConnect/navConnect'
import { Logo } from '@/components/ui'
import { Web3Connection } from '@/components'

const Navbar = () => {
    const pageLinks = [
        {
            name: "Home",
            link: "/media",
        },
        {
            name: "Mint",
            link: "/media/mint",
        },
        {
            name: "Media",
            link: "/media"
        },
        {
            name: "Profile",
            link: "/media/profile"
        },
        {
            name: "Edit Profile",
            link: "/media/profile/editProfile"
        },

    ];
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Logo />
            </div>
            <div className={styles.nav_controllers}>
                <Web3Connection />
                {/* <NavConnect /> */}

                <MainMenu pageLinks={pageLinks} />
            </div>

        </nav>
    )
}

export default Navbar