import React from 'react'
import styles from './navControllers.module.css'
import SideBarBtn from './sideBarBtn/sideBarBtn'

const NavControllers = () => {
    return (
        <div className={styles.navControllers}>
            <SideBarBtn /><SideBarBtn /><SideBarBtn />
        </div>
    )
}

export default NavControllers