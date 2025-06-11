import MediaDetails from '@/components/layout/mediaDetails/mediaDetails'
import React from 'react'
import RelatedMedia from '@/components/relatedMedia/relatedMedia'
// import styles from "./page.module.css"



interface PageProps {
    params: Promise<{
        id: string
    }>
}

const Page = async ({ params }: PageProps) => {

    const { id } = await params;
    console.log("Media ID:", id);

    // const { query } = await searchParams; 


    return (
        <div className='page'>
            <section><MediaDetails /></section>

            <RelatedMedia id={id} />
        </div>
    )
}

export default Page