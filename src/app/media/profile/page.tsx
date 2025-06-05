import styles from "./page.module.css"
import { Search_filter } from "@/components"
import MyMedia from "@/components/myMedia/myMedia"

interface PageProps {
    searchParams: Promise<{
        query?: string
        sort?: string
        filter?: string
    }>
}

const Page = async ({ searchParams }: PageProps) => {
    // Await the searchParams in Next.js 15+
    const params = await searchParams

    const query = params.query || ""
    const sort = params.sort || "Most Recent"
    const filter = params.filter || "Listed"

    return (
        <div className="page">
            <div className={styles.profile_page}>
                <div className={styles.query_box}>
                    <div></div>
                    <Search_filter placeholder="search me" />
                </div>
                {/* Pass the server-side params to MyMedia for filtering */}
                <MyMedia query={query} sort={sort} filter={filter} />
            </div>
        </div>
    )
}

export default Page
