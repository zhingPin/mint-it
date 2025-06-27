import React from 'react'
import styles from './index.module.css'
import ConnectButton from './connectButton/connectButton'
import ChainSwitch from './chainSwitch/chainSwitch'

const Web3Connection = () => {
    return (
        <div className={styles.connect_ui}>
            <div className={styles.is_connected}><ConnectButton /></div>
            <ChainSwitch />
        </div>
    )
}

export default Web3Connection