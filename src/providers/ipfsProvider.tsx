"use client"

import { useState, createContext, useContext, type ReactNode } from "react"

// Define context types
interface IpfsContextProps {
    uploadToIpfs: (file: File) => Promise<string>
    isLoading: boolean
    progress: number | null
}

// Create context with default values
export const IpfsContext = createContext<IpfsContextProps>({
    uploadToIpfs: async () => {
        throw new Error("IPFS not initialized")
    },
    isLoading: false,
    progress: null,
})

// Provider component
export function IpfsProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState<number | null>(null)

    const uploadToIpfs = async (file: File): Promise<string> => {
        setIsLoading(true)
        setProgress(null)
        console.log("Uploading file to IPFS:", file.name)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/ipfs-upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to upload to IPFS")
            }

            const { url } = await response.json()
            console.log("File uploaded successfully:", url)
            return url
        } catch (error) {
            console.error("Error uploading to IPFS via API:", error)
            throw error
        } finally {
            setIsLoading(false)
            setProgress(null)
        }
    }

    return <IpfsContext.Provider value={{ uploadToIpfs, isLoading, progress }}>{children}</IpfsContext.Provider>
}

// Custom hook to use the IPFS context
export function useIpfs() {
    const context = useContext(IpfsContext)
    if (!context) {
        throw new Error("useIpfs must be used within an IpfsProvider")
    }
    return context
}
