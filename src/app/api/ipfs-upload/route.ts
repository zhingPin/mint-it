import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get("file")

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No valid file provided" }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const projectId = process.env.PROJECT_ID
        const projectSecret = process.env.PROJECT_SECRET_KEY
        const subdomain = process.env.NEXT_PUBLIC_IPFS_SUBDOMAIN || "gsoe"

        if (!projectId || !projectSecret) {
            return NextResponse.json({ error: "Missing IPFS credentials" }, { status: 500 })
        }

        const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`
        const ipfsUrl = `https://${subdomain}.infura-ipfs.io:5001/api/v0/add`

        const ipfsFormData = new FormData()
        const blob = new Blob([buffer], { type: file.type })
        ipfsFormData.append("file", blob, file.name || "upload.bin")

        const response = await fetch(ipfsUrl, {
            method: "POST",
            headers: { Authorization: auth },
            body: ipfsFormData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Infura IPFS API error:", errorText)
            throw new Error(`IPFS upload failed: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        const { Hash: cid, Name: name, Size: size } = result

        return NextResponse.json({
            cid,
            url: `https://${subdomain}.infura-ipfs.io/ipfs/${cid}`,
            name,
            size,
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            {
                error: "Upload failed",
                detail: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}
