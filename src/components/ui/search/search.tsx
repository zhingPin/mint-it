"use client";
import React from "react";
import styles from "./search.module.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/ui/form_Components/input/input";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
    placeholder: string;
    icon: React.ReactNode;
};

const Search: React.FC<SearchProps> = ({ placeholder, icon }) => {
    const searchParams = useSearchParams();
    const Pathname = usePathname();
    const { replace } = useRouter();

    const query = searchParams.get("query") || ""; // Get the current query from the URL

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
        <div >
            <Input
                placeholder={placeholder}
                defaultValue={query} // Set the current query as the default value
                onChange={handleSearch}
                icon={icon}
            />
        </div>
    );
};

export default Search;