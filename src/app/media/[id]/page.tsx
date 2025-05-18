import MediaDetails from '@/components/layout/mediaDetails/mediaDetails'
import React from 'react'
import RelatedMedia from '@/components/relatedMedia/relatedMedia'

const Page = async () => {

    // const { query } = await searchParams; 


    return (
        <div className='page'>
            <MediaDetails />
            <RelatedMedia />
        </div>
    )
}

export default Page