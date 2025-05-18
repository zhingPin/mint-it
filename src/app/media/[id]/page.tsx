import MediaDetails from '@/components/layout/mediaDetails/mediaDetails'
import React from 'react'
import styles from "./page.module.css"
import MediaCard from '@/components/mediaComponent/mediaCard/mediaCard'
import RelatedMedia from '@/components/relatedMedia/relatedMedia'

const Page = async ({
    searchParams
}: {
    searchParams: {
        query: string;
        page: string;
    }
}) => {

    // const { query } = await searchParams; 


    return (
        <div className='page'>
            <MediaDetails />
            <RelatedMedia />
        </div>
    )
}

export default Page