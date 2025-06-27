// hooks/useNftContext.ts
import { useContext } from "react";
import { NftContextProps } from "../context/nftContext";
import { NftContext } from "@/(context)/providers/nftProvider";


export const useNftContext = (): NftContextProps => {
    const context = useContext(NftContext);
    if (!context) {
        throw new Error("useNftContext must be used within a NftProvider");
    }
    return context;
};
