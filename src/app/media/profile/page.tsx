import styles from "./page.module.css"
import { Search_filter } from "@/components"
import MyMedia from "@/components/myMedia/myMedia"
import Filter from "@/components/ui/filter/filter"
import { FaImages, FaMusic, FaVideo } from "react-icons/fa"

interface PageProps {
    searchParams: Promise<{
        query?: string
        sort?: string
        filter?: string
        tabopt?: string
    }>
}

const Page = async ({ searchParams }: PageProps) => {
    // Await the searchParams in Next.js 15+
    const params = await searchParams

    const query = params.query || ""
    const sort = params.sort || "Most Recent"
    const filter = params.filter || "all"
    const tabopt = params.tabopt || ""

    const filterOptions = [
        { key: "audio", label: "", icon: <FaMusic /> },
        { key: "videos", label: "", icon: <FaVideo /> },
        { key: "images", label: "", icon: <FaImages /> },
        { key: "all", label: "All", icon: null },
    ];

    return (
        <div className="page">
            <div className={styles.query_box}>
                <Search_filter placeholder="search me" query={query} sort="Most Recent" tabopt="" />
            </div>
            {/* Pass the server-side params to MyMedia for filtering */}
            <div>
                <Filter filterOptions={filterOptions} filter={filter} />
                <MyMedia query={query} sort={sort} filter={filter} tabopt={tabopt} />
            </div>
        </div>
    )
}

export default Page
