"use client";
import React, { useEffect, useState } from "react";
import styles from "./filterTaps.module.css";
import { Button } from "@/components/ui";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type FilterTapsProps = {
    tabs: string[];
    tabopt: string; // Optional prop for initial active tab
};

const FilterTaps: React.FC<FilterTapsProps> = ({ tabs, tabopt }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // const currentFilter = searchParams.get("filter") || tabs[0]; // URL or default
    const currentFilter = tabopt
    const [activeTab, setActiveTab] = useState<string>(currentFilter);

    useEffect(() => {
        setActiveTab(currentFilter);
    }, [currentFilter]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);

        const params = new URLSearchParams(searchParams);
        params.set("tabopt", tab); // e.g. ?filter=Owned
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={styles.filterTaps} role="tablist">
            {tabs.map((tab, index) => (
                <Button
                    btnName={tab}
                    icon={null}
                    classStyle={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                    handleClick={() => handleTabChange(tab)}
                    key={index}
                    aria-selected={activeTab === tab}
                    role="tab"
                />
            ))}
        </div>
    );
};

export default FilterTaps;
