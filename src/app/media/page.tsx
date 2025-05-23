import AllMedia from '@/components/allMedia/allMedia';
import Filter from '@/components/ui/filter/filter';
import Search from '@/components/ui/search/search';
import { FaImages, FaMusic, FaVideo } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from './page.module.css'


const Page = async () => {

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
                {/* <Search_filter placeholder={"search all"} /> */}
                <Search
                    placeholder="Search for media..."
                    icon={<FaMagnifyingGlass />} // Pass the icon here
                />
            </div>
            <div>
                <h1>Media</h1>
                <Filter filterOptions={filterOptions} />
                <AllMedia />
            </div>
        </main>
    )
}

export default Page