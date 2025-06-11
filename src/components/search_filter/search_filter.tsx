import type React from "react"
import styles from "./search_filter.module.css"
import Search from "../ui/search/search"
import DropDownTap from "./filterTaps/dropDownTap/dropDownTap"
import { FaMagnifyingGlass } from "react-icons/fa6"
import FilterTaps from "./filterTaps/filterTaps"

type SearchFilterProps = {
    placeholder: string
    query: string
    sort: string // Default sort option
    tabopt: string // Optional filter prop
    // Make these optional with defaults
    sortOptions?: string[]
    filterTabs?: string[]
    sortParamName?: string
    filterParamName?: string
}

const Search_filter: React.FC<SearchFilterProps> = ({
    placeholder,
    sortOptions = ["Most Recent", "High to Low", "Low to High", "Old to New"],
    filterTabs = ["Listed", "Owned"],
    query = "",
    sort = "Most Recent",
    tabopt
}) => {
    return (
        <div className={styles.search_filter_body}>
            <div className={styles.search}>
                <Search placeholder={placeholder} icon={<FaMagnifyingGlass />} query={query} />
            </div>
            <div className={styles.filter_controls}>
                <DropDownTap dropdownOptions={sortOptions} sort={sort} />
                <FilterTaps tabs={filterTabs} tabopt={tabopt} />
            </div>
        </div>
    )
}

export default Search_filter
