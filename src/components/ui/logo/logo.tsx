import React from 'react'
import styles from "./logo.module.css"
import Link from 'next/link'

const Logo = () => {
    return (
        <div className={styles.logo}>
            <Link href="/media"> The Mint</Link>
        </div>
    )
}

export default Logo