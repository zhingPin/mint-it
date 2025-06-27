import { useContext } from "react"
import { IpfsContext } from "../providers/ipfsProvider"

// Custom hook to use the IPFS context
export function useIpfs() {
    const context = useContext(IpfsContext)
    if (!context) {
        throw new Error("useIpfs must be used within an IpfsProvider")
    }
    return context
}
