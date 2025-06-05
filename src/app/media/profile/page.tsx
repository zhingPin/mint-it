import React from 'react'
import styles from './page.module.css'
import { Search_filter } from '@/components'
import MyMedia from '@/components/myMedia/myMedia'

const Page = async () => {


    return (
        <div className="page">
            <div className={styles.profile_page}>
                <div className={styles.query_box}>
                    <div>
                    </div> <Search_filter placeholder='search me' />
                </div>
                <MyMedia />
            </div>
        </div>
    )
}

export default Page