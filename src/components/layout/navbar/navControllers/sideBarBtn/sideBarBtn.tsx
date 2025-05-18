"use client"
import React, { useState } from 'react'
import styles from './sideBarBtn.module.css'

const SideBarBtn = () => {
    const [active, setActive] = useState(false);
    return (
        <div className={styles.sideBarBtn} onClick={() => setActive(!active)}>
            <div className={`${styles.btn} ${active ? styles.active : ''}`}>
                sideBarBtn
            </div>

        </div>
    );
};

export default SideBarBtn