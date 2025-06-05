import AllMedia from '@/components/allMedia/allMedia';
import Filter from '@/components/ui/filter/filter';
import Search from '@/components/ui/search/search';
import { FaImages, FaMusic, FaVideo } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from './page.module.css'
import DropDownTap from '@/components/search_filter/filterTaps/dropDownTap/dropDownTap';
import FilterTaps from '@/components/search_filter/filterTaps/filterTaps';

interface PageProps {
    searchParams: Promise<{
        query?: string
        sort?: string
        filter?: string
    }>
}

const Page = async ({ searchParams }: PageProps) => {

    const params = await searchParams

    const query = params.query || ""
    const sort = params.sort || "Most Recent"
    const filter = params.filter || "Listed"

    const filterOptions = [
        { key: "audio", label: "", icon: <FaMusic /> },
        { key: "videos", label: "", icon: <FaVideo /> },
        { key: "images", label: "", icon: <FaImages /> },
        { key: "all", label: "All", icon: null },
    ];
    // console.log(query, page)
    return (
        <main className="page">
            <div className={styles.query_box}>
                <div></div>
                <Search
                    placeholder="Search for media..."
                    icon={<FaMagnifyingGlass />}
                />
                <div>
                    <div className={styles.filter_options}>
                        <FilterTaps tabs={["listed"]} />
                        <DropDownTap dropdownOptions=
                            {
                                [
                                    "new to old",
                                    "old to new",
                                    "price hi to low",
                                    " price low to hi"
                                ]
                            }
                        />
                    </div>

                </div>

            </div>
            <div>
                <h1>Media</h1>
                <Filter filterOptions={filterOptions} />
                <AllMedia query={query} sort={sort} filter={filter} />
            </div>
        </main>
    )
}

export default Page