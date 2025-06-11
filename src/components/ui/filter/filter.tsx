"use client";
import React from "react";
import styles from "./filter.module.css";
import { Button } from "@/components/ui";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type FilterOption = {
    key: string;
    label: string;
    icon: React.ReactNode;
};

type FilterProps = {
    filterOptions: FilterOption[];
    filter: string; // Optional prop for initial filter state
};

const Filter: React.FC<FilterProps> = ({ filterOptions, filter }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Derive activeFilter from the URL query parameters
    const activeFilter = filter

    // const activeFilter = searchParams.get("filter") || "all";

    const handleFilterClick = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter === "all") {
            params.delete("filter");
        } else {
            params.set("filter", filter);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={styles.filter_body}>
            {filterOptions.map((option) => (
                <Button
                    key={option.key}
                    btnName={option.label}
                    classStyle={`${styles.filter_button} ${activeFilter === option.key ? styles.active : ""
                        }`}
                    handleClick={() => handleFilterClick(option.key)}
                    icon={option.icon}
                />
            ))}
        </div>
    );
};

export default Filter;