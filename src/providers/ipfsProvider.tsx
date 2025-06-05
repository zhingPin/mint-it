"use client"

import { useState, createContext, useContext, useEffect, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { IPFSHTTPClient } from "ipfs-http-client";

// Define types for our context
interface IpfsContextProps {
    client: IPFSHTTPClient | null;
    uploadToIpfs: (file: File) => Promise<string>
    isLoading: boolean
    progress: number | null;

}

// Create context with default values
export const IpfsContext = createContext<IpfsContextProps>({
    client: null,
    uploadToIpfs: async () => {
        throw new Error("IPFS not initialized")
    },
    isLoading: false,
    progress: null,

})

// Create a client-side only component for IPFS
const IpfsProviderInner = ({ children }: { children: ReactNode }) => {
    const [client, setClient] = useState<IPFSHTTPClient | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState<number | null>(null);


    useEffect(() => {
        // Only import and initialize IPFS in the browser
        const initIpfs = async () => {
            try {
                const projectId = process.env.PROJECT_ID
                const projectSecretKey = process.env.SECRET_KEY

                if (!projectId || !projectSecretKey) {
                    console.error("Project ID and Secret Key must be defined in the environment variables.")
                    return
                }

                // Dynamically import ipfs-http-client only on the client side
                const { create } = await import("ipfs-http-client")

                // Create auth header using btoa for browser compatibility
                const auth = `Basic ${btoa(`${projectId}:${projectSecretKey}`)}`

                const ipfsClient = create({
                    host: "ipfs.infura.io",
                    port: 5001,
                    protocol: "https",
                    headers: {
                        authorization: auth,
                    },
                })

                setClient(ipfsClient)
            } catch (error) {
                console.error("Failed to create IPFS client:", error)
            }
        }

        initIpfs()
    }, [])

    // Function to upload file to IPFS
    const uploadToIpfs = async (file: File): Promise<string> => {
        if (!client) {
            throw new Error("IPFS client not initialized")
        }

        setIsLoading(true)
        setProgress(null);

        try {
            const added = await client.add(
                { content: await file.arrayBuffer() },
                {
                    progress: (prog: number) => {
                        console.log(`Upload progress: ${prog}`);
                        setProgress(prog);
                    },
                },
            )

            const url = `${process.env.NEXT_PUBLIC_SUBDOMAIN}/ipfs/${added.path}`
            return url
        } catch (error) {
            console.error("Error uploading to IPFS:", error)
            throw error
        } finally {
            setIsLoading(false)
            setProgress(null);

        }
    }

    return <IpfsContext.Provider value={{ client, uploadToIpfs, isLoading, progress }}>{children}</IpfsContext.Provider>
}

// Create a dynamic component with SSR disabled
const DynamicIpfsProvider = dynamic(() => Promise.resolve(IpfsProviderInner), { ssr: false })

// Export the provider component
export function IpfsProvider({ children }: { children: ReactNode }) {
    return <DynamicIpfsProvider>{children}</DynamicIpfsProvider>
}

// Export the hook to use the context
export function useIpfs() {
    const context = useContext(IpfsContext)
    if (!context.client && typeof window !== "undefined") {
        console.warn("IPFS client not initialized yet")
    }
    return context
}
