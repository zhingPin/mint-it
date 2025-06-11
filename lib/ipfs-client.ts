// lib/ipfsClient.ts — SERVER USE ONLY
import { create } from "ipfs-http-client"

const projectId = process.env.PROJECT_ID!
const projectSecret = process.env.PROJECT_SECRET_KEY!
const subdomain = process.env.NEXT_PUBLIC_IPFS_SUBDOMAIN || "gsoe"

const auth = "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64")

export const ipfsClient = create({
    host: `${subdomain}.infura-ipfs.io`,
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
})

export async function uploadBufferToIpfs(buffer: Buffer, name: string): Promise<string> {
    try {
        const result = await ipfsClient.add({
            content: buffer,
            path: name,
        })

        const ipfsUrl = `https://${subdomain}.infura-ipfs.io/ipfs/${result.path}`
        console.log(`File uploaded to IPFS: ${ipfsUrl}`)

        return ipfsUrl
    } catch (error) {
        console.error("IPFS upload error:", error)
        throw new Error(`Failed to upload to IPFS: ${error}`)
    }
}
