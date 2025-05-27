// hooks/useNftContext.ts
import { useContext } from "react";
import { NftContextProps } from "../nftContext";
import { NftContext } from "@/providers/nftProvider";


export const useNftContext = (): NftContextProps => {
    const context = useContext(NftContext);
    if (!context) {
        throw new Error("useNftContext must be used within a NftProvider");
    }
    return context;
};
