"use client";
import React from "react";
import styles from "./search.module.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/ui/form_Components/input/input";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
    placeholder: string;
    icon: React.ReactNode;
    query: string; // Optional query prop for initial value
};

const Search: React.FC<SearchProps> = ({ placeholder, icon, query }) => {
    const searchParams = useSearchParams();
    const Pathname = usePathname();
    const { replace } = useRouter();

    // const query = searchParams.get("query") || ""; // Get the current query from the URL

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term); // Add or update the query parameter
        } else {
            params.delete("query"); // Remove the query parameter if the term is empty
        }
        replace(`${Pathname}?${params.toString()}`); // Update the URL
    }, 300);

    return (
        <div className={styles.search_container}>
            {/* Use the Input component with the current query as the default value */}
            <Input
                name="search_field"
                id="search_field"
                placeholder={placeholder}
                defaultValue={query} // Set the current query as the default value
                onChange={handleSearch}
                icon={icon}
            />
        </div>
    );
};

export default Search;