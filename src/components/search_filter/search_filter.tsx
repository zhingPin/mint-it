import React from 'react'
import styles from './search_filter.module.css'
import Search from '../ui/search/search'
import Filter from '../ui/filter/filter'
import FilterTaps from './filterTaps/filterTaps'
import DropDownTap from './filterTaps/dropDownTap/dropDownTap'
type SearchFilterProps = {
    placeholder: string;
}
const Search_filter: React.FC<SearchFilterProps> = ({ placeholder }) => {

    return (
        <div className={styles.search_filter_body}>
            <div className={styles.search} /* grid-area: search */>
                <Search placeholder={placeholder} />
            </div>
            <div className={styles.filter} >
                <DropDownTap
                    dropdownOptions={["Most Recent", "High to Low", "Low to High", "Old to New"]}
                />
            </div>
            <div className={styles.dropdown} /* grid-area: dropdown */>
                type  <DropDownTap
                    dropdownOptions={["music", "audio book", "podcast", "video", "movie", "tv show"]}
                />
                {/* <FilterTaps
                    tabs={["Listed", "Owned", "Liked", "Following", "Followers"]}
                    dropdownOptions={["Most Recent", "High to Low", "Low to High", "Old to New"]}
                /> */}

            </div>
        </div>
    )
}

export default Search_filter