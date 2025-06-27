import { useContext } from "react"
import { MediaContext } from "../providers/mediaProvider"
// Custom hook to use the Media context 
export function useMedia() {
    const context = useContext(MediaContext)
    if (!context) {
        throw new Error("useMedia must be used within a MediaProvider")
    }
    return context
}
