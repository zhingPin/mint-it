// /app/api/processMedia/route.ts (Next.js API Route)
// import { NextRequest } from "next/server";
// import { exec } from "child_process"; // or use fluent-ffmpeg
// import fs from "fs/promises";
// import { uploadBufferToIpfs } from "../../../../lib/ipfs-client";
// import path from "path";

export const runtime = "nodejs"

export async function POST() {
    // const data = await req.formData();
    // const file = data.get("file") as File;

    // if (!file) {
    //     return NextResponse.json({ error: "No file provided" }, { status: 400 });
    // }

    // const buffer = Buffer.from(await file.arrayBuffer());
    // const tempPath = `/tmp/${file.name}`;
    // const outputPath = `/tmp/processed-${file.name}`;

    // try {
    //     // Save uploaded file temporarily
    //     await fs.writeFile(tempPath, buffer);

    //     const ffmpegCommand = `ffmpeg -i ${tempPath} -ss 00:00:01.000 -vframes 1 ${outputPath}`;

    //     return new Promise((resolve) => {
    //         exec(ffmpegCommand, async (error) => {
    //             try {
    //                 if (error) {
    //                     console.error("FFmpeg error:", error);
    //                     resolve(NextResponse.json({ error: "Processing failed" }, { status: 500 }));
    //                     return;
    //                 }

    //                 const thumbBuffer = await fs.readFile(outputPath);
    //                 const previewUrl = await uploadBufferToIpfs(thumbBuffer, "preview.jpg", "image/jpeg");

    //                 resolve(
    //                     NextResponse.json({
    //                         message: "Processing complete",
    //                         previewUrl,
    //                     })
    //                 );
    //             } catch (innerErr) {
    //                 console.error("Post-processing error:", innerErr);
    //                 resolve(NextResponse.json({ error: "Thumbnail upload failed" }, { status: 500 }));
    //             } finally {
    //                 await fs.unlink(tempPath).catch(() => { });
    //                 await fs.unlink(outputPath).catch(() => { });
    //             }
    //         });
    //     });
    // } catch (e) {
    //     console.error("Unexpected error:", e);
    //     return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    // }
}