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

    const {
        query = "",
        sort = "Most Recent",
        filter = "all",
        tabopt = ""
    } = await searchParams;

    const filterOptions = [
        { key: "audio", label: "", icon: <FaMusic /> },
        { key: "videos", label: "", icon: <FaVideo /> },
        { key: "images", label: "", icon: <FaImages /> },
        { key: "all", label: "All", icon: null },
    ];
    const sortOptions = ["Most Recent", "High to Low", "Low to High", "Old to New"];
    return (
        <div className="page">
            <div className={styles.query_box}>
                <Search_filter placeholder="Search media..." query={query} sort={sort} tabopt={tabopt} sortOptions={sortOptions} />
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
