import AllMedia from '@/components/allMedia/allMedia';
import Filter from '@/components/ui/filter/filter';
import { FaImages, FaMusic, FaVideo } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from './page.module.css'
import DropDownTap from '@/components/search_filter/filterTaps/dropDownTap/dropDownTap';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const FilterTaps = dynamic(() => import('@/components/search_filter/filterTaps/filterTaps'), { ssr: false });
const Search = dynamic(() => import('@/components/ui/search/search'), { ssr: false });

const Page = async () => {
    const filterOptions = [
        { key: "audio", label: "", icon: <FaMusic /> },
        { key: "videos", label: "", icon: <FaVideo /> },
        { key: "images", label: "", icon: <FaImages /> },
        { key: "all", label: "All", icon: null },
    ];

    return (
        <main className="page">
            <div className={styles.query_box}>
                <div></div>
                <Suspense fallback={<div>Loading search...</div>}>
                    <Search
                        placeholder="Search for media..."
                        icon={<FaMagnifyingGlass />}
                    />
                </Suspense>
                <div>
                    <div className={styles.filter_options}>
                        <Suspense fallback={<div>Loading filters...</div>}>
                            <FilterTaps tabs={["listed"]} />
                        </Suspense>
                        <DropDownTap dropdownOptions={[
                            "new to old",
                            "old to new",
                            "price hi to low",
                            "price low to hi"
                        ]} />
                    </div>
                </div>
            </div>

            <div>
                <h1>Media</h1>
                <Filter filterOptions={filterOptions} />
                <AllMedia />
            </div>
        </main>
    );
};

export default Page;
