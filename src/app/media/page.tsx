import AllMedia from "@/components/allMedia/allMedia"
import Filter from "@/components/ui/filter/filter"
import { FaImages, FaMusic, FaVideo } from "react-icons/fa"
import styles from "./page.module.css"
import { Search_filter } from "@/components"

interface PageProps {
    searchParams: Promise<{
        query?: string
        sort?: string
        filter?: string
        tabopt?: string
    }>
}

const Page = async ({ searchParams }: PageProps) => {
    const params = await searchParams

    const query = params.query || ""
    const sort = params.sort || "mostrecent"
    const filter = params.filter || "all"
    const tabopt = params.tabopt || ""
    // Define filter options with icons

    const filterOptions = [
        { key: "music", label: "Music", icon: <FaMusic /> },
        { key: "videos", label: "Videos", icon: <FaVideo /> },
        { key: "images", label: "Images", icon: <FaImages /> },
        { key: "all", label: "All", icon: null },
    ];
    const sortOptions = ["Most Recent", "High to Low", "Low to High", "Old to New"]
    return (
        <main className="page">
            <div className={styles.query_box}>
                <Search_filter
                    query={query}
                    sort={sort}
                    tabopt={tabopt}
                    placeholder="Search media..."
                    filterTabs={[]} // Empty array = no filter tabs
                    sortOptions={sortOptions}
                />
            </div>
            <div>
                <h1>Marketplace </h1>
                <Filter filterOptions={filterOptions} filter={filter} />
                <AllMedia query={query} sort={sort} filter={filter} tabopt={tabopt} />
            </div>
        </main>
    )
}

export default Page
